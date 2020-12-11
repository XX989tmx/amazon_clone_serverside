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

async function findProductById(productId) {
  let product;
  try {
    product = await (
      await Product.findById(productId).populate("reviews").populate("seller")
    ).populate({ path: "user", select: "-password" });
  } catch (error) {
    console.log(error);
  }
  if (!product) {
    const error = new Error("data was not found.");
    return next(error);
  }

  return product;
}

function calculateAverageRateOfReview(product) {
  // rate
  // 平均星N個のNを取得
  let reviews = product.reviews;
  //   let count = reviews.length;
  let count = getReviewCountOfProduct(product);
  let sum = 0;
  for (let i = 0; i < reviews.length; i++) {
    const reviewDoc = reviews[i];
    const rate = reviewDoc.rate;
    sum += rate;
  }

  const averageRate = Math.floor(sum / count);

  return averageRate;
}

function getReviewCountOfProduct(product) {
  let reviews = product.reviews;
  let count = reviews.length;
  return count;
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

async function OrSearchProduct(keyword, currentPage, perPage) {
  query = {
    $or: [
      { name: { $regex: keyword, $options: "i" } },
      { brand: { $regex: keyword, $options: "i" } },
      { categories: { $regex: keyword, $options: "i" } },
    ],
  };

  let products;
  try {
    products = await Product.find(query)
      .populate({ path: "seller", select: "-password" })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
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

async function updateAverageRateOfReviewOfProduct(product) {
  const averageRate = calculateAverageRateOfReview(product);
  product.stats.reviewStats.averageRate = averageRate;
  return product;
}

async function updateTotalCountOfReviewOfProduct(product) {
  const reviewCount = getReviewCountOfProduct(product);
  product.stats.reviewStats.totalCount = reviewCount;
  return product;
}

async function saveProduct(product) {
  try {
    await product.save();
  } catch (error) {
    console.log(error);
  }
}

// レビュー作成ごとに以下を実行
async function updateReviewStatsOfProduct(product) {
  const updated1Product = await updateAverageRateOfReviewOfProduct(product);

  const updated2Product = await updateTotalCountOfReviewOfProduct(
    updated1Product
  );

  await saveProduct(updated2Product);

  return updated2Product;
}

function findXRatedProducts(docArray, rate) {
  let gteXRateProducts = [];
  for (let i = 0; i < docArray.length; i++) {
    const doc = docArray[i];
    const averageRate = doc.stats.reviewStats.averageRate;
    if (averageRate >= rate) {
      gteXRateProducts.push(doc);
    }
  }
  return gteXRateProducts;
}

function filterProductByReviewRate(docArray, rateQuery) {
  let gteXRateProducts = [];

  if (!rateQuery) {
    console.log("rateQuery is not provided.");
  }

  switch (rateQuery) {
    case ">=4":
      gteXRateProducts = findXRatedProducts(docArray, 4);
      break;

    case ">=3":
      gteXRateProducts = findXRatedProducts(docArray, 3);
      break;

    case ">=2":
      gteXRateProducts = findXRatedProducts(docArray, 2);
      break;

    case ">=1":
      gteXRateProducts = findXRatedProducts(docArray, 1);
    default:
      break;
  }

  return gteXRateProducts;
}

exports.getPagination = getPagination;
exports.HowManyTimesIBoughtThisProduct = HowManyTimesIBoughtThisProduct;
exports.filterByPrice = filterByPrice;
exports.findProductById = findProductById;
exports.updateReviewStatsOfProduct = updateReviewStatsOfProduct;
exports.OrSearchProduct = OrSearchProduct;
