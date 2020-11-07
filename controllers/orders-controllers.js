const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");
const Address = require("../models/address");

const createOrder = async (req, res, next) => {
  const userId = req.params.userId;
  const addressId = req.params.addressId;

  const { nameOfPaymentMethod } = req.body;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
  }

  // user specified address. eg. default address
  let address;

  try {
    address = await Address.findById(addressId);
  } catch (error) {
    console.log(error);
  }

  const createdOrder = new Order({
    items: user.cart.items,
    totalPrice: user.cart.totalPrice,
    totalCount: user.cart.totalCount,
    dateOrdered: new Date(Date.now()).toString(),
    shipmentAddress: address,
    user: userId,
    nameOfPaymentMethod,
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

  await userAfterOrderCompletion.save();

  res.json({ createdOrder, userAfterOrderCompletion });
};

const getAllOrderHistory = async (req, res, next) => {
  const userId = req.params.userId;

  let perPage;
  const currentPage = req.query.page || 1;
  perPage = 5;
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

exports.createOrder = createOrder;
exports.getAllOrderHistory = getAllOrderHistory;
