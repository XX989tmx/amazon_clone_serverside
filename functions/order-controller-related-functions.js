const mongoose = require("mongoose");
const Order = require("../models/order");
/**
 *
 *
 * @param {number} price
 * @return {number}
 */
async function getOrdersOfThisUser(userId) {
  let orders;
  try {
    orders = await Order.find({ user: userId }).sort({ dateOrdered: "-1" });
  } catch (error) {
    console.log(error);
    return next(error);
  }

  if (!orders) {
    const error = new Error("Error occurred. Failed to load data.");
    return next(error);
  }

  return orders;
}

function calculateAcquirableAmazonPoint(price) {
  if (typeof price !== "number") {
    const error = new TypeError("Input is not a number");
    return error;
  }
  const acquirablePoint = Math.round(price * 0.01);
  return acquirablePoint;
}

async function calculateTotalAmountOfPriceOfOrderOfAllTime(userId) {
  const orders = await getOrdersOfThisUser(userId);

  let sum = 0;
  for (let i = 0; i < orders.length; i++) {
    const order = orders[i];
    sum += order.totalPrice;
  }

  //   for (const { totalPrice } of orders) {
  //     sum += totalPrice;
  //   }

  return sum;
}

async function calculateTotalAmountOfPriceOfOrderOfThisMonth(userId) {
  const orders = await getOrdersOfThisUser(userId);
  let thisMonth = new Date().getMonth();
  let sum = 0;

  for (const order of orders) {
    const orderedMonth = order.dateOrdered.getMonth();
    if (orderedMonth === thisMonth) {
      sum += order.totalPrice;
    }
  }

  if (sum === 0) {
    const error = new Error("今月のご注文履歴はありません。");
    console.log(sum);
    // return next(error);
  }

  return sum;
}

async function getOrdersOfThisMonth(userId) {
  const orders = await getOrdersOfThisUser(userId);

  let ordersOfThisMonth = [];
  let thisMonth = new Date().getMonth();
  for (const order of orders) {
    const orderedMonth = order.dateOrdered.getMonth();
    if (orderedMonth === thisMonth) {
      ordersOfThisMonth.push(order);
    }
  }

  if (ordersOfThisMonth.length === 0) {
    const error = new Error("今月のご注文履歴はありません。");
    console.log(error);
  }

  return ordersOfThisMonth;
}

exports.calculateAcquirableAmazonPoint = calculateAcquirableAmazonPoint;
exports.calculateTotalAmountOfPriceOfOrderOfAllTime = calculateTotalAmountOfPriceOfOrderOfAllTime;
exports.calculateTotalAmountOfPriceOfOrderOfThisMonth = calculateTotalAmountOfPriceOfOrderOfThisMonth;
exports.getOrdersOfThisMonth = getOrdersOfThisMonth;