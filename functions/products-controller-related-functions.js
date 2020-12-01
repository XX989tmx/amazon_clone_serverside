const Order = require("../models/order");

function getPagination(currentPage, totalItems, perPage) {
  const nextPage = +currentPage + 1;
  const previousPage = +currentPage - 1;
  const hasNextPage = perPage * +currentPage < totalItems;
  const hasPreviousPage = +currentPage > 1;
  const lastPage = Math.ceil(totalItems / perPage);

  const pagination = {
    currentPage: +currentPage,
    perPage: perPage,
    totalItems: totalItems,
    nextPage: nextPage,
    previousPage: previousPage,
    hasNextPage: hasNextPage,
    hasPreviousPage: hasPreviousPage,
    lastPage: lastPage,
  };
  return pagination;
}

async function HowManyTimesIBoughtThisProduct(userId, productId) {
  let orders;
  try {
    orders = await Order.find({ user: userId }).sort({ _id: "-1" });
  } catch (error) {
    console.log(error);
  }

  if (!orders) {
    const error = new Error("エラーが発生しました。");
    return next(error);
  }

  let isCounted = false;
  let frequency = 0;

  for (const order of orders) {
    let items = order.items;
    isCounted = false;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (isCounted === false) {
        if (item.productId.toString() === productId.toString()) {
          frequency += 1;
          isCounted = true;
        }
      }
    }
  }
  console.log(frequency);
  return frequency;
}
exports.getPagination = getPagination;
exports.HowManyTimesIBoughtThisProduct = HowManyTimesIBoughtThisProduct;
