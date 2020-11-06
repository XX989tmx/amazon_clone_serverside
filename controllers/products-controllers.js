const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/product");

const getAllProducts = async (req, res, next) => {
  // demonstration only;

  let products;
  try {
    products = await Product.find({});
  } catch (error) {
    console.log(error);
  }

  if (!products) {
    const error = new Error("error occurred. product data was not found.");
    return next(error);
  }

  const countOfProducts = products.length;

  res.json({
    products: products.map((v) => v.toObject({ getters: true })),
    countOfProducts,
  });
};

const getSpecificProductById = async (req, res, next) => {
  //:product = productName or productId
  const productId = req.params.productId;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (error) {
    console.log(error);
  }

  if (!product) {
    const error = new Error("No product data was found.");
    return next(error);
  }

  res.json({ product: product.toObject({ getters: true }) });
};

const getProductIndexByCategory = async (req, res, next) => {
  const category = req.params.category;

  let products;
  try {
    products = await Product.find({ categories: category });
  } catch (error) {
    console.log(error);
  }

  if (!products) {
    const error = new Error("product data was not found for this category.");
    return next(error);
  }

  const countOfProducts = products.length;

  res.json({
    products: products.map((v) => v.toObject({ getters: true })),
    countOfProducts,
  });
};

const getProductIndexByParentCategory = async (req, res, next) => {
  const parentCategory = req.params.parentCategory;

  let products;
  try {
    products = await Product.find({ parentCategory: parentCategory });
  } catch (error) {
    console.log(error);
  }

  if (!products) {
    const error = new Error(
      "No product data was found in specified parent category."
    );
    return next(error);
  }

  const countOfProduct = products.length;

  res.json({
    products: products.map((v) => v.toObject({ getters: true })),
    countOfProduct,
  });
};

const getProductIndexByAncestorCategory = async (req, res, next) => {
  const ancestorCategory = req.params.ancestorCategory;

  let products;
  try {
    products = await Product.find({ ancestorCategories: ancestorCategory });
  } catch (error) {
    console.log(error);
  }

  if (!products) {
    const error = new Error(
      "No product data was found in specified ancestor category."
    );
    return next(error);
  }

  const countOfProduct = products.length;

  res.json({
    products: products.map((v) => v.toObject({ getters: true })),
    countOfProduct,
  });
};

exports.getAllProducts = getAllProducts;
exports.getSpecificProductById = getSpecificProductById;
exports.getProductIndexByCategory = getProductIndexByCategory;
exports.getProductIndexByParentCategory = getProductIndexByParentCategory;
exports.getProductIndexByAncestorCategory = getProductIndexByAncestorCategory;
