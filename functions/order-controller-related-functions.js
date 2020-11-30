const mongoose = require("mongoose");
const Order = require("../models/order");
/**
 *
 *
 * @param {number} price
 * @return {number}
 */
function calculateAcquirableAmazonPoint(price) {
  if (typeof price !== "number") {
    const error = new TypeError("Input is not a number");
    return error;
  }
  const acquirablePoint = Math.round(price * 0.01);
  return acquirablePoint;
}

async function calculateTotalAmountOfPriceOfOrderOfAllTime(userId) {
  let orders;
  try {
    orders = await Order.find({ user: userId });
  } catch (error) {
    console.log(error);
    return next(error);
  }

  if (!orders) {
    const error = new Error("Error occurred. Failed to load data.");
    return next(error);
  }
  
  let sum = 0;
  for (let i = 0; i < orders.length; i++) {
      const order = orders[i];
      sum += order.totalPrice;
  }
  
  return sum;
}

exports.calculateAcquirableAmazonPoint = calculateAcquirableAmazonPoint;
