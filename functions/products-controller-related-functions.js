const Order = require("../models/order");
const User = require("../models/user");
const Product = require("../models/product");

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

async function OrSearchProduct(keyword) {
  query = {
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { brand: { $regex: keyword, $options: "i" } },
      { categories: { $regex: keyword, $options: "i" } },
    ],
  };

  let products;
  try {
    products = await Product.find(query);
  } catch (error) {
    console.log(error);
  }

  if (!products) {
    const error = new Error("キーワードに一致する商品が見つかりませんでした。");
    return next(error);
  }

  return products;
}

function find_0To500_Priced_Items(docArray) {
  const matchedDocs = returnPriceMatchedDocs(0, 500, docArray);
  return matchedDocs;
}

function find_500To1000_Priced_Items(docArray) {
  const matchedDocs = returnPriceMatchedDocs(500, 1000, docArray);
  return matchedDocs;
}

function find_1000To2000_Priced_Items(docArray) {
  const matchedDocs = returnPriceMatchedDocs(1000, 2000, docArray);
  return matchedDocs;
}

function find_2000To5000_Priced_Items(docArray) {
  const matchedDocs = returnPriceMatchedDocs(2000, 5000, docArray);
  return matchedDocs;
}
function find_moreThan5000_Priced_Items(docArray) {
  let matchedDocs = [];
  for (let i = 0; i < docArray.length; i++) {
    const doc = docArray[i];
    const price = doc.price;
    if (isMoreThan5000(price)) {
      matchedDocs.push(doc);
    }
  }
  return matchedDocs;
}

function returnPriceMatchedDocs(price1, price2, docArray) {
  let matchedDocs = [];
  for (let i = 0; i < docArray.length; i++) {
    const doc = docArray[i];
    const price = doc.price;
    if (isPriceMatch(price, price1, price2)) {
      matchedDocs.push(doc);
    }
  }
  return matchedDocs;
}

function isPriceMatch(value, price1, price2) {
  if (value >= price1 && value <= price2) {
    return true;
  } else {
    return false;
  }
}
function isMoreThan5000(value) {
  if (value > 5000) {
    return true;
  } else {
    false;
  }
}
function filterByPrice(docArray, priceQuery) {
  let results;
  if (docArray.length === 0) {
    console.log("array is empty");
  }
  if (!priceQuery) {
    console.log("price query is not provided");
  }
  switch (priceQuery) {
    case "0-500":
      // 0 - 500
      results = find_0To500_Priced_Items(docArray);
      break;

    case "500-1000":
      results = find_500To1000_Priced_Items(docArray);

      break;

    case "1000-2000":
      results = find_1000To2000_Priced_Items(docArray);
      break;

    case "2000-5000":
      results = find_2000To5000_Priced_Items(docArray);
      break;

    case ">5000":
      results = find_moreThan5000_Priced_Items(docArray);
      break;

    default:
      break;
  }

  return results;
}

function filterProductWithTrueStockStatus(docArray) {
  let trueStockProducts = [];
  for (let i = 0; i < docArray.length; i++) {
    const doc = docArray[i];
    const stockStatus = doc.isStock;
    if (stockStatus) {
      trueStockProducts.push(doc);
    }
  }
  return trueStockProducts;
}

function filterProductWithFalseStockStatus(docArray) {
  let falseStockProducts = [];

  for (let i = 0; i < docArray.length; i++) {
    const doc = docArray[i];
    const stockStatus = doc.isStock;
    if (!stockStatus) {
      falseStockProducts.push(doc);
    }
  }
  return falseStockProducts;
}

function filterProductWithBrand(docArray, brandQuery) {
  let brandFilteredProducts = [];

  if (!brandQuery) {
    console.log("brandQuery is not provided");
  }

  for (let i = 0; i < docArray.length; i++) {
    const doc = docArray[i];
    const brand = doc.brand;
    if (brandQuery.toString() === brand.toString()) {
      brandFilteredProducts.push(doc);
    }
  }

  return brandFilteredProducts;
}

function filterProductWithSeller(docArray, sellerQuery) {
  // populate(seller) is required before execute this function
  let sellerFilteredQuery = [];

  if (!sellerQuery) {
    console.log("seller query is not provided");
  }

  for (let i = 0; i < docArray.length; i++) {
    const doc = docArray[i];
    const seller = doc.seller.name;
    if (seller) {
      if (sellerQuery.toString() === seller.toString()) {
        sellerFilteredQuery.push(doc);
      }
    }
  }

  return sellerFilteredQuery;
}

exports.getPagination = getPagination;
exports.HowManyTimesIBoughtThisProduct = HowManyTimesIBoughtThisProduct;
exports.filterByPrice = filterByPrice;
