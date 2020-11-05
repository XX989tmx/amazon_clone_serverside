const mongoose = require("mongoose");
const express = require("express");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const User = require("../models/user");
const { json } = require("body-parser");

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  //   const user = {
  //     name: name,
  //     email: email,
  //     password: password,
  //   };

  //   const existinguser = {
  //     name: "customer1",
  //     email: "customer1@gmail.com",
  //     password: "samplepasswprd123",
  //   };
  let isError = false;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    console.log(error);
  }

  if (existingUser) {
    isError = true;
    const error = new Error(
      "user already exist in the same email address. please change email."
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

  //   if (email === existinguser.email) {
  //     isError = true;
  //     const error = new Error("email is already taken");
  //     next(error);
  //   }

  //   if (password === existinguser.password) {
  //     isError = true;
  //     const error = new Error("password is already taken");
  //     next(error);
  //   }

  const createdUser = new User({
    name: name,
    email: email,
    password: hashedPassword,
  });

  try {
    await createdUser.save();
  } catch (error) {
    console.log(error);
  }

  let token;
  try {
    token = await jsonwebtoken.sign(
      { userId: createdUser.id, email: createdUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (error) {
    console.log(error);
  }

  if (isError) {
    res.status(401).json({ messsage: "credential is not valid" });
  } else {
    res.status(200).json({
      name: createdUser.name,
      userId: createdUser.id,
      email: createdUser.email,
      token,
      message: "successfully signed up",
    });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  //   const existinguser = {
  //     name: "customer1",
  //     email: "customer1@gmail.com",
  //     password: "samplepasswprd123",
  //   };
  let isError = false;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (error) {
    console.log(error);
  }

  if (!existingUser) {
    isError = true;
    const error = new Error(
      "User was not found in specified email address. authentication failed"
    );
    return next(error);
  }

  //   if (existinguser.email !== email) {
  //     isError = true;
  //     // throw new Error("email is not valid");
  //   }

  let isValidPassword;
  try {
    isValidPassword = await bcryptjs.compare(password, existingUser.password);
  } catch (error) {
    console.log(error);
  }

  if (isValidPassword !== true) {
    isError = true;
    const error = new Error("Password is not valid. authentication failed.");
    return next(error);
  }

  //   if (existingUser.password !== password) {
  //     isError = true;
  //     const error = new Error("password is not matched");
  //     return next(error);
  //   }

  let token;
  try {
    token = await jsonwebtoken.sign(
      { userId: existingUser.id, email: existingUser.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (error) {
    console.log(error);
  }

  if (isError === true) {
    res
      .status(401)
      .json({ message: "authentication failed. credential is not valid" });
  } else {
    res.status(200).json({
      name: existingUser.name,
      userId: existingUser.id,
      email: existingUser.email,
      token,
      message: "logged in",
    });
  }
};

exports.signup = signup;
exports.login = login;
