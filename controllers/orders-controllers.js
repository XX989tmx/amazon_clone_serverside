const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");
const Address = require("../models/address");

const createOrder = async (req, res, next) => {
  const userId = req.params.userId;
  const addressId = req.params.addressId;

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

  let orders;
  try {
    orders = await Order.find({ user: userId });
  } catch (error) {
    console.log(error);
  }

  console.log(orders);

  if (!orders) {
    const error = new Error(
      "Error occurred. Failed to load order history data."
    );
    return next(error);
  };

  const totalCountOfOrders = orders.length;

  res.json({ orders, totalCountOfOrders });
};

exports.createOrder = createOrder;
exports.getAllOrderHistory = getAllOrderHistory;
