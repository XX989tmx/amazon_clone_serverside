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

exports.calculateAcquirableAmazonPoint = calculateAcquirableAmazonPoint;
