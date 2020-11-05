const express = require("express");
const expressValidator = require("express-validator");
const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const Seller = require("../models/seller");

const signup = async (req, res, next) => {
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

  //   if (password !== existingSeller.password) {
  //     return next(new Error("password is incorrect"));
  //   }
  res.json({ existingSeller, msg: "succsessfully loggedin" });
};

exports.signup = signup;
exports.login = login;
