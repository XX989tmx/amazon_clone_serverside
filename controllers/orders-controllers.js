const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");
const Address = require("../models/address");

const createOrder = async (req, res, next) => {
  const userId = req.params.userId;
  const addressId = req.params.addressId;

  //   const useAmazonPoint = req.query.amazonPoint; // boolean
  //   const useAmazonCredit = req.query.amazonCredit; // boolean

  const {
    nameOfPaymentMethod,
    amazonPointAmount,
    amazonCreditAmount,
  } = req.body;

  let isAmazonCreditUsed = false;
  let amountOfAmazonCreditUsed = 0;
  let isAmazonPointUsed = false;
  let amountOfAmazonPointUsed = 0;

  let totalDiscountAmount = 0;
  let totalPriceBeforeDiscount = 0;

  let AddedAmazonPoint = 0;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
  }

  if (user.cart.items.length === 0) {
    const error = new Error("cart is empty. Could not make a order.");
    return next(error);
  }

  totalPriceBeforeDiscount = user.cart.totalPrice;

  AddedAmazonPoint = Math.round(user.cart.totalPrice * 0.01);

  let existingAmazonPointBalance = user.wallet.amazonPoint;
  let existingAmazonCreditBalance = user.wallet.amazonCredit;

  // user specified address. eg. default address
  let address;

  try {
    address = await Address.findById(addressId);
  } catch (error) {
    console.log(error);
  }

  if (
    user.cart.totalPrice !== 0 &&
    !!amazonPointAmount &&
    existingAmazonPointBalance >= amazonPointAmount
  ) {
    isAmazonPointUsed = true;
    amountOfAmazonPointUsed = Number(amazonPointAmount);
    if (amountOfAmazonPointUsed > user.cart.totalPrice) {
      const error = new Error(
        "Invalid input amount. Please input the same amount of amazon point as the total price of cart."
      );
      return next(error);
    }
    user.cart.totalPrice = user.cart.totalPrice - amountOfAmazonPointUsed;
    totalDiscountAmount = totalDiscountAmount + amountOfAmazonPointUsed;
  }

  if (
    user.cart.totalPrice !== 0 &&
    !!amazonCreditAmount &&
    existingAmazonCreditBalance >= amazonCreditAmount
  ) {
    isAmazonCreditUsed = true;
    amountOfAmazonCreditUsed = Number(amazonCreditAmount);
    if (amountOfAmazonCreditUsed > user.cart.totalPrice) {
      const error = new Error(
        "Invalid input amount. Please input the same amount of amazon credit as the total price of cart."
      );
      return next(error);
    }
    user.cart.totalPrice = user.cart.totalPrice - amountOfAmazonCreditUsed;
    totalDiscountAmount = totalDiscountAmount + amountOfAmazonCreditUsed;
  }

  //各商品の在庫数を更新する。在庫数から注文個数分を引き、スキーマ保存。loop.
  for (let i = 0; i < user.cart.items.length; i++) {
    const itemInCart = user.cart.items[i];
    const productId = itemInCart.productId;
    const orderedQuantity = itemInCart.quantity;
    let product;
    product = await Product.findById(productId);
    if (!product) {
      const error = new Error(
        "エラーが発生しました。商品データの取得に失敗しました。"
      );
      return next(error);
    }
    const existingQuantity = product.stockQuantity;
    if (existingQuantity < orderedQuantity) {
      const error = new Error(
        "エラーが発生しました。注文点数が在庫数を超えています。"
      );
      return next(error);
    }
    product.stockQuantity = existingQuantity - orderedQuantity;
    await product.save();
  }

  const createdOrder = new Order({
    items: user.cart.items,
    totalPrice: user.cart.totalPrice,
    totalCount: user.cart.totalCount,
    dateOrdered: new Date(),
    shipmentAddress: address,
    user: userId,
    nameOfPaymentMethod,
    usedAmazonCredit: amountOfAmazonCreditUsed,
    usedAmazonPoint: amountOfAmazonPointUsed,
    addedAmazonPoint: AddedAmazonPoint,
    isAmazonCreditUsed,
    isAmazonPointUsed,
    totalDiscountAmount,
    totalPriceBeforeDiscount,
  });

  try {
    await createdOrder.save();
  } catch (error) {
    console.log(error);
  }

  await user.orders.push(createdOrder);

  try {
    await user.save();
  } catch (error) {
    console.log(error);
  }

  // clear cart after order completion;
  let userAfterOrderCompletion;

  try {
    userAfterOrderCompletion = await User.findById(userId);
  } catch (error) {
    console.log(error);
  }

  userAfterOrderCompletion.cart = {
    items: [],
    totalPrice: 0,
    totalCount: 0,
  };

  const updatedAmazonPointBalance =
    existingAmazonPointBalance + AddedAmazonPoint - amountOfAmazonPointUsed;
  const updatedAmazonCreditBalance =
    existingAmazonCreditBalance - amountOfAmazonCreditUsed;

  userAfterOrderCompletion.wallet.amazonPoint = updatedAmazonPointBalance;

  userAfterOrderCompletion.wallet.amazonCredit = updatedAmazonCreditBalance;
  try {
    await userAfterOrderCompletion.save();
  } catch (error) {
    console.log(error);
  }

  res.json({ createdOrder, userAfterOrderCompletion });
};

const getAllOrderHistory = async (req, res, next) => {
  const userId = req.params.userId;

  let perPage;
  const currentPage = req.query.page || 1;
  perPage = 16;
  let totalItems;
  let count;
  try {
    count = await Order.find({ user: userId }).countDocuments();
  } catch (error) {
    return next(error);
  }

  //   if (count === 0) {
  //     const error = new Error("no data was found.");
  //     return next(error);
  //   }

  totalItems = count;

  let orders;
  try {
    orders = await Order.find({ user: userId })
      .populate({ path: "items", populate: { path: "productId" } })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  } catch (error) {
    console.log(error);
    return next(error);
  }

  console.log(orders);

  if (!orders) {
    const error = new Error(
      "Error occurred. Failed to load order history data."
    );
    return next(error);
  }

  const totalCountOfOrders = orders.length;

  res.json({ orders, totalCountOfOrders, totalItems });
};

const getOrderHistoriesTransactedWithAmazonCredit = async (req, res, next) => {
  const userId = req.params.userId;

  let perPage;
  const currentPage = req.query.page || 1;
  perPage = 10;
  let totalItems;
  let count;

  try {
    count = await Order.find({ user: userId })
      .where("isAmazonCreditUsed")
      .equals(true)
      .countDocuments();
  } catch (error) {
    console.log(error);
  }
  if (count === 0) {
    const error = new Error("There is no data.");
    return next(error);
  }

  totalItems = count;

  let orders;
  try {
    orders = await Order.find({ user: userId })
      .where("isAmazonCreditUsed")
      .equals(true)
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  } catch (error) {
    console.log(error);
  }

  if (!orders) {
    const error = new Error("Error occurred. There is no order history.");
    return next(error);
  }

  const totalCountOfOrders = orders.length;

  res.status(200).json({
    orders: orders.map((v) => v.toObject({ getters: true })),
    totalCountOfOrders,
    totalItems,
  });
};

const getLatestOrderData = async (req, res, next) => {
  const userId = req.params.userId;
  const orderId = req.params.orderId;

  //直近のOrderデータを取得。
  let orderData;
  try {
    orderData = await Order.findById(orderId).populate({
      path: "items",
      populate: { path: "productId" },
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }

  if (!orderData) {
    const error = new Error("error occurred. failed to get order data.");
    return next(error);
  }

  res.status(200).json({
    orderData: orderData.toObject({ getters: true }),
    message: "注文が確定されました。ご利用ありがとうございました。",
  });
};

exports.createOrder = createOrder;
exports.getAllOrderHistory = getAllOrderHistory;
exports.getOrderHistoriesTransactedWithAmazonCredit = getOrderHistoriesTransactedWithAmazonCredit;
exports.getLatestOrderData = getLatestOrderData;
