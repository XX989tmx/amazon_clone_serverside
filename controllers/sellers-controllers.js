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
      { userId: createdSeller.id, email: createdSeller.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (error) {
    console.log(error);
  }
  console.log(token);

  res.json({ createdSeller, token, msg: "successfully signed up" });
};

const login = async (req, res, next) => {
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
      { userId: existingSeller.id, email: existingSeller.email },
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
  res.json({ existingSeller, token, msg: "succsessfully loggedin" });
};

const createProduct = async (req, res, next) => {
  const sellerId = req.params.sellerId;
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

  const createdProduct = new Product({
    name,
    price,
    deliveryDate,
    brand,
    parentCategory,
    ancestorCategories,
    categories,
    stockQuantity,
    isStock,
    seller: sellerId,
  });

  try {
    await createdProduct.save();
  } catch (error) {
    console.log(error);
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
  });
};

const updateProduct = async (req, res, next) => {
  const sellerId = req.params.sellerId;
  const productId = req.params.productId;
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

  product.name = name;
  product.price = price;
  product.deliveryDate = deliveryDate;
  product.brand = brand;
  product.parentCategory = parentCategory;
  product.ancestorCategories = ancestorCategories;
  product.categories = categories;
  product.stockQuantity = stockQuantity;
  product.isStock = isStock;

  try {
    await product.save();
  } catch (error) {
    console.log(error);
  }

  res.json({ product });
};

exports.signup = signup;
exports.login = login;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
