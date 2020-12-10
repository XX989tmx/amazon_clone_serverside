const express = require("express");
const mongoose = require("mongoose");
const {
  getPagination,
  HowManyTimesIBoughtThisProduct,
  filterByPrice,
} = require("../functions/products-controller-related-functions");
const Product = require("../models/product");

const getAllProducts = async (req, res, next) => {
  // demonstration only;

  //pagination
  const currentPage = req.query.page || 1;
  let perPage;

  switch (req.query.perPage) {
    case "20":
      perPage = 20;
      break;
    case "15":
      perPage = 15;
      break;
    case "10":
      perPage = 10;
      break;

    default:
      perPage = 5;
      break;
  }

  let totalItems;
  let count;
  try {
    count = await Product.find({}).countDocuments();
  } catch (error) {
    console.log();
  }
  totalItems = count;

  let products;
  try {
    products = await Product.find({})
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
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
    totalItems,
  });
};

const getSpecificProductById = async (req, res, next) => {
  //:product = productName or productId
  const productId = req.params.productId;

  let product;
  try {
    product = await Product.findById(productId).populate({
      path: "seller",
      select: "-password",
    });
  } catch (error) {
    console.log(error);
  }

  if (!product) {
    const error = new Error("No product data was found.");
    return next(error);
  }

  const specificProduct = [product];

  res.json({
    specificProduct: specificProduct.map((v) => v.toObject({ getters: true })),
  });
};

const getProductIndexByCategory = async (req, res, next) => {
  // grandGrandChildCategory("categories":grandGrandChildCategory)に一致するproduct documentを配列の形で受け取る。pagination16 grandGrandChildCategoryIdをクエリにして、ドキュメントを検索。
  // スキーマ上はcategories,クライアント側では、grandGrandChildCategory
  const category = req.params.category; //grandGrandChildCategoryのこと
  let perPage;
  const currentPage = req.query.page || 1;

  //   if (req.query.perPage === 60) {
  //     perPage = 60;
  //   } else if (req.query.perPage === 40) {
  //     perPage = 40;
  //   } else {
  //     perPage = 24;
  //   }
  perPage = 16;

  let totalItems;
  let count;
  try {
    count = await Product.find({ categories: category }).countDocuments();
  } catch (error) {
    console.log(error);
  }

  totalItems = count;

  let products;
  try {
    products = await Product.find({ categories: category })
      .populate({ path: "seller", select: "-password" })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  } catch (error) {
    console.log(error);
  }

  if (!products) {
    const error = new Error("product data was not found for this category.");
    return next(error);
  }

  const countOfProducts = products.length;
  const pagination = getPagination(currentPage, totalItems, perPage);
  console.log(pagination);
  // const nextPage = +currentPage + 1;
  // const previousPage = +currentPage - 1;
  // const hasNextPage = perPage * +currentPage < totalItems;
  // const hasPreviousPage = +currentPage > 1;
  // const lastPage = Math.ceil(totalItems / perPage);

  // const pagination = {
  //   currentPage: +currentPage,
  //   perPage: perPage,
  //   totalItems: totalItems,
  //   nextPage: nextPage,
  //   previousPage: previousPage,
  //   hasNextPage: hasNextPage,
  //   hasPreviousPage: hasPreviousPage,
  //   lastPage: lastPage,
  // };

  res.json({
    products: products.map((v) => v.toObject({ getters: true })),
    countOfProducts,
    totalItems,
    pagination,
  });
};

const getProductIndexByParentCategory = async (req, res, next) => {
  // pagination 24
  const parentCategory = req.params.parentCategory; //クライアント側では,grandChildCategory

  const currentPage = req.query.page || 1;
  let perPage;
  let totalItems;
  let count;
  perPage = 24;
  try {
    count = await Product.find({
      parentCategory: parentCategory,
    }).countDocuments();
  } catch (error) {
    console.log(error);
  }
  totalItems = count;

  let products;
  try {
    products = await Product.find({ parentCategory: parentCategory })
      .populate({ path: "seller", select: "-password" })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
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

  const pagination = getPagination(currentPage, totalItems, perPage);
  console.log(pagination);

  res.json({
    products: products.map((v) => v.toObject({ getters: true })),
    countOfProduct,
    totalItems,
    pagination,
  });
};

const getProductIndexByAncestorCategory = async (req, res, next) => {
  // pagination 24
  // クライアント側でいう、parentCategory, childCategoryによるクエリは、すべてここに送る。スキーマ上の、'ancestor categories'にクエリをかける。いずれかがマッチしたならそれでよい、ということで進める(すべて一つのfieldでまかなってしまう)。必要なら、parentCategory, childCategoryごとに、field,controller function, routeを追加する。
  const ancestorCategory = req.params.ancestorCategory; // クライアント側でいう、parentCategory, or childCategoryのこと

  let perPage;
  const currentPage = req.query.page || 1;
  perPage = 24;
  let totalItems;
  let count;
  try {
    count = await Product.find({
      ancestorCategories: ancestorCategory,
    }).countDocuments();
  } catch (error) {
    console.log(error);
  }
  totalItems = count;

  let products;
  try {
    products = await Product.find({ ancestorCategories: ancestorCategory })
      .populate({ path: "seller", select: "-password" })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
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

  const pagination = getPagination(currentPage, totalItems, perPage);
  console.log(pagination);

  res.json({
    products: products.map((v) => v.toObject({ getters: true })),
    countOfProduct,
    totalItems,
    pagination,
  });
};

const getProductIndexByBrand = async (req, res, next) => {
  const brand = req.params.brand;

  let perPage;
  const currentPage = req.query.page || 1;
  perPage = 16;

  let totalItems;
  let count;

  try {
    count = await Product.find({ brand: brand }).countDocuments();
  } catch (error) {
    console.log(error);
  }

  totalItems = count;

  let products;
  try {
    products = await Product.find({ brand: brand })
      .populate({
        path: "seller",
        select: "-select",
      })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  } catch (error) {
    console.log(error);
    return next(error);
  }

  if (!products) {
    const error = new Error("Error occurred. Failed to get data.");
    return next(error);
  }

  const countOfProducts = products.length;

  const pagination = getPagination(currentPage, totalItems, perPage);
  console.log(pagination);

  res.status(200).json({
    products: products.map((v) => v.toObject({ getters: true })),
    countOfProducts,
    totalItems,
    pagination,
  });
};

exports.getAllProducts = getAllProducts;
exports.getSpecificProductById = getSpecificProductById;
exports.getProductIndexByCategory = getProductIndexByCategory;
exports.getProductIndexByParentCategory = getProductIndexByParentCategory;
exports.getProductIndexByAncestorCategory = getProductIndexByAncestorCategory;
exports.getProductIndexByBrand = getProductIndexByBrand;
