const express = require("express");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const Seller = require("../models/seller");
const Product = require("../models/product");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty() === false) {
    console.log(errors);
    const error = new Error("Invalid inputs. please check your input again.");
    return next(error);
  }

  const { name, email, password } = req.body;

  let existingSeller;
  try {
    existingSeller = await Seller.findOne({ email: email });
  } catch (error) {
    console.log(error);
  }

  if (existingSeller) {
    const error = new Error(
      "same seller is already exist in specified email address.please check you email again."
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcryptjs.hash(password, 12);
  } catch (error) {
    console.log(error);
  }
  console.log(hashedPassword);

  const createdSeller = new Seller({
    name: name,
    email: email,
    password: hashedPassword,
  });

  try {
    await createdSeller.save();
  } catch (error) {
    console.log(error);
  }

  let token;
  try {
    token = await jsonwebtoken.sign(
      { sellerId: createdSeller.id, email: createdSeller.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (error) {
    console.log(error);
  }
  console.log(token);

  res.json({
    name: createdSeller.name,
    sellerId: createdSeller.id,
    email: createdSeller.email,
    token,
    message: "successfully signed up",
  });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty() !== true) {
    console.log(errors);
    const error = new Error("Invalid inputs. please check your input again.");
    return next(error);
  }

  const { email, password } = req.body;

  let existingSeller;
  try {
    existingSeller = await Seller.findOne({ email: email });
  } catch (error) {
    console.log(error);
  }

  if (!existingSeller) {
    const error = new Error(
      "Seller was not found in specified email address. please signup again."
    );
    return next(error);
  }

  let isValidPassword;
  try {
    isValidPassword = await bcryptjs.compare(password, existingSeller.password);
  } catch (error) {
    console.log(error);
  }

  if (isValidPassword === false) {
    const error = new Error(
      "password is incorrect. please check password again."
    );
    return next(error);
  }

  let token;
  try {
    token = await jsonwebtoken.sign(
      { sellerId: existingSeller.id, email: existingSeller.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (error) {
    console.log(error);
  }
  console.log(token);

  //   if (password !== existingSeller.password) {
  //     return next(new Error("password is incorrect"));
  //   }
  res.json({
    name: existingSeller.name,
    email: existingSeller.email,
    sellerId: existingSeller.id,
    token,
    message: "succsessfully loggedin",
  });
};

const createProduct = async (req, res, next) => {
  const sellerId = req.params.sellerId;

  const errors = validationResult(req);
  if (errors.isEmpty() === false) {
    const error = new Error("Invalid inputs.");
    console.log(error);
    return next(error);
  }

  const imageFiles = req.files;

  const {
    name,
    price,
    deliveryDate,
    brand,
    parentCategory,
    ancestorCategories,
    categories,
    stockQuantity,
    isStock,
  } = req.body;

  const parsedAncestorsCategories = ancestorCategories.split(",");

  const createdProduct = new Product({
    name,
    price,
    deliveryDate,
    brand,
    parentCategory,
    ancestorCategories: parsedAncestorsCategories,
    categories,
    stockQuantity,
    isStock,
    seller: sellerId,
    images: [],
  });

  for (let i = 0; i < imageFiles.length; i++) {
    const element = imageFiles[i];
    const filePath = element.path;
    const imageName = "image" + (i + 1);
    createdProduct.images.push({ imageName: imageName, imageUrl: filePath });
  }

  try {
    await createdProduct.save();
  } catch (error) {
    console.log(error);
    next(error);
  }

  let seller;
  try {
    seller = await Seller.findById(sellerId);
  } catch (error) {
    console.log(error);
  }

  await seller.products.push(createdProduct);

  try {
    await seller.save();
  } catch (error) {
    console.log(error);
  }

  res.json({
    createdProduct: createdProduct.toObject({ getters: true }),
    seller,
    message: "商品データが正常に保存されました",
  });
};

const updateProduct = async (req, res, next) => {
  console.log(req);
  const sellerId = req.params.sellerId;
  const productId = req.params.productId;

  const errors = validationResult(req);
  if (errors.isEmpty() === false) {
    const error = new Error("Invalid inputs.");
    return next(error);
  }

  const {
    name,
    price,
    deliveryDate,
    brand,
    parentCategory,
    ancestorCategories,
    categories,
    stockQuantity,
    isStock,
  } = req.body;

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

  //Authorization
  if (product.seller.toString() !== req.sellerData.sellerId.toString()) {
    const error = new Error(
      "Authorization failed. you are not allowed to edit this data."
    );
    return next(error);
  }

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

  res.json({ product });
};

const deleteProduct = async (req, res, next) => {
  console.log(req);
  const sellerId = req.params.sellerId;
  const productId = req.params.productId;

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

  let product;

  try {
    product = await Product.findById(productId);
  } catch (error) {
    console.log(error);
  }

  if (!product) {
    const error = new Error("Specified product was not found.");
    return next(error);
  }

  if (product.seller.toString() !== req.sellerData.sellerId.toString()) {
    const error = new Error(
      "Authorization failed. you are not allowed to delete thi data."
    );
    return next(error);
  }

  try {
    await seller.products.pull(productId);
    await seller.save();
  } catch (error) {
    console.log(error);
  }

  try {
    await product.remove();
  } catch (error) {
    console.log(error);
  }

  res.json({ seller });
};

const getAllProductOfThisSeller = async (req, res, next) => {
  const sellerId = req.params.sellerId;

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

  const countOfProducts = allProductOfThisSeller.length;

  res.json({
    allProductOfThisSeller: allProductOfThisSeller.map((v) =>
      v.toObject({ getters: true })
    ),
    countOfProducts,
  });
};

exports.signup = signup;
exports.login = login;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.getAllProductOfThisSeller = getAllProductOfThisSeller;
