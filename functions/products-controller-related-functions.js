const Order = require("../models/order");
const User = require("../models/user");

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

async function updatePurchaseFrequency(userId, productId) {
  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
  }

  let notFound = false;

  if (user.purchaseFrequency.length !== 0) {
    const purchaseFrequency = user.purchaseFrequency;

    for (let i = 0; i < purchaseFrequency.length; i++) {
      const doc = purchaseFrequency[i];
      if (doc[productId].toString() === productId.toString()) {
        doc[frequency] += 1;
        doc.purchasedDate.push(new Date());
      }
    }

    try {
      await user.save();
    } catch (error) {
      console.log(error);
    }
  }

  for (let i = 0; i < purchaseFrequency.length; i++) {
    const doc = purchaseFrequency[i];
    if (doc[productId].toString() !== productId.toString()) {
      notFound = true;
    }
  }

  //todo : このままでは買っていないものまでカウントされるので、Orderデータを読みチェックをかけるなどにより、フィルターをかける。

  if (notFound) {
    const newDoc = {
      productId: productId,
      frequency: 1,
      purchasedDate: [],
    };
    newDoc.purchasedDate.push(new Date());
    user.purchaseFrequency.push(newDoc);
    try {
      await user.save();
    } catch (error) {
      console.log(error);
    }
  }

  return user;
}

async function countPurchaseFrequencyOfThisProduct(userId, productId) {
  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
  }

  const purchaseFrequency = user.purchaseFrequency;
  let frequency;

  for (const doc of purchaseFrequency) {
    if (doc.productId.toString() === productId.toString()) {
      frequency = doc.frequency;
      break;
    }
  }

  return frequency;
}

async function getLatestPurchasedDate(userId, productId) {
  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
  }

  const purchaseFrequency = user.purchaseFrequency;
  let lastDayOfPurchase;

  for (const doc of purchaseFrequency) {
    if (doc.productId.toString() === productId.toString()) {
      lastDayOfPurchase = doc.purchasedDate.pop();
      break;
    }
  }

  return lastDayOfPurchase;
}
exports.getPagination = getPagination;
exports.HowManyTimesIBoughtThisProduct = HowManyTimesIBoughtThisProduct;
