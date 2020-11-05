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

  const createdSeller = new Seller({
    name,
    email,
    password,
  });

  try {
    await createdSeller.save();
  } catch (error) {
    console.log(error);
  }

  res.json({ createdSeller });
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

  if (email !== existingSeller.email) {
    return next(new Error("email is not matched"));
  }

  if (password !== existingSeller.password) {
    return next(new Error("password is incorrect"));
  }
  res.json({ existingSeller, msg: "succsessfully loggedin" });
};

exports.signup = signup;
exports.login = login;
