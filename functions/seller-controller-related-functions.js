const Product = require("../models/product");
/**
 *
 *
 * @param {*} productId
 * @return {Document} product 
 */
async function findProduct(productId) {
  let product;
  try {
    product = await Product.findById(productId);
  } catch (error) {
    console.log(error);
  }

  if (!product) {
    const error = new Error("Specified product data was not found.");
    return next(error);
  }

  return product;
}
/**
 *
 *
 * @param {*} sellerId
 * @return {Document} seller 
 */
async function findSeller(sellerId) {
  let seller;
  try {
    seller = await Seller.findById(sellerId);
  } catch (error) {
    console.log(error);
  }

  if (!seller) {
    const error = new Error("Specified Seller was not found.");
    return next(error);
  }

  return seller;
}
/**
 *
 *
 * @param {*} product
 */
async function updateExistingProduct(product) {
  product.name = name;
  product.price = price;
  product.deliveryDate = deliveryDate;
  product.brand = brand;
  product.parentCategory = parentCategory;
  product.ancestorCategories = ancestorCategories;
  product.categories = categories;
  product.stockQuantity = stockQuantity;
  product.isStock = isStock;
  const existingImages = product.images;

  product.images = [];

  //image
  const imageFiles = req.files;

  for (let i = 0; i < imageFiles.length; i++) {
    const element = imageFiles[i];
    const filePath = element.path;
    const imageName = "image" + (i + 1);
    product.images.push({ imageName: imageName, imageUrl: filePath });
  }

  try {
    await product.save();
  } catch (error) {
    console.log(error);
  }
}
/**
 *
 *
 * @param {*} sellerId
 * @return {Document[]} 
 */
async function findAllOfTheProductsOfThisUser(sellerId) {
  let allProductOfThisSeller;
  try {
    allProductOfThisSeller = await Product.find({ seller: sellerId });
  } catch (error) {
    console.log(error);
  }

  console.log(allProductOfThisSeller);

  if (!allProductOfThisSeller) {
    const error = new Error(
      "Product data was not found fot this seller. please try again."
    );
    return next(error);
  }

  return allProductOfThisSeller;
}

exports.findProduct = findProduct;
exports.findSeller = findSeller;
exports.updateExistingProduct = updateExistingProduct;
exports.findAllOfTheProductsOfThisUser = findAllOfTheProductsOfThisUser;
