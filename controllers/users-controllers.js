const mongoose = require("mongoose");
const express = require("express");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty() !== true) {
    console.log(errors);
    const error = new Error("Invalid inputs. please check your input again.");
    return next(error);
  }
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
    cart: {
      items: [],
      totalPrice: 0,
      totalCount: 0,
    },
    paymentMethod: {
      creditCards: [],
    },
    wallet: {
      amazonPoint: 0,
      amazonCredit: 0,
    },
    wishlists: [],
    amazonCreditOrders: [],
    reviews: [],
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
  const errors = validationResult(req);
  if (errors.isEmpty() !== true) {
    console.log(errors);
    const error = new Error("Invalid inputs. please check you input again.");
    return next(error);
  }

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

const addToCart = async (req, res, next) => {
  const productId = req.params.productId;
  const { quantity } = req.body;
  const userId = req.params.userId;

  //   const productToAdd = {
  //     productId,
  //     quantity,
  //   };

  let product;
  try {
    product = await Product.findById(productId);
  } catch (error) {
    console.log(error);
  }

  const sum = product.price * quantity;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
  }

  let existingItemsInCart;

  let existingTotalPriceOfCart;

  existingTotalPriceOfCart = user.cart.totalPrice;

  let updatedTotalPriceOfCart;
  updatedTotalPriceOfCart = existingTotalPriceOfCart + sum;

  let existingTotalCountOfItemInCart;
  existingTotalCountOfItemInCart = user.cart.totalCount;

  let updatedTotalCountOfItemInCart;
  updatedTotalCountOfItemInCart = existingTotalCountOfItemInCart + quantity;

  existingItemsInCart = user.cart.items;
  let updatedItemsInCart;
  updatedItemsInCart = existingItemsInCart.concat([
    {
      productId: productId,
      quantity: Number(quantity),
    },
  ]);

  user.cart = {
    items: updatedItemsInCart,
    totalPrice: updatedTotalPriceOfCart,
    totalCount: updatedTotalCountOfItemInCart,
  };
  await user.save();

  product.userCart = userId;
  await product.save();

  res.json({ cart: user.cart });
};

const clearCart = async (req, res, next) => {
  const userId = req.params.userId;

  let user;
  try {
    user = await User.findById(userId).select("-password");
  } catch (error) {
    console.log(error);
  }

  user.cart = {
    items: [],
    totalPrice: 0,
    totalCount: 0,
  };

  try {
    await user.save();
  } catch (error) {
    console.log(error);
  }

  res.json({ user, message: "カートの中身が空になりました。" });
};

const getLatestContentOfCart = async (req, res, next) => {
  // checkout pageでのFetch用
  const userId = req.params.userId;
  let user;
  try {
    user = await User.findById(userId)
      .select("-password")
      .populate({
        path: "cart",
        populate: { path: "items", populate: { path: "productId" } },
      });
  } catch (error) {
    console.log(error);
    return next(error);
  }

  if (!user) {
    const error = new Error("Error Occurre. Failedd to get user data.");
    return next(error);
  }

  res.status(200).json({ user: user.toObject({ getters: true }) });
};
// async function createOrder(params) {
//   const userId = rew.params.userId;
//   let user;
//   try {
//     user = await User.findById(userId);
//   } catch (error) {
//     console.log(error);
//   }
//   if (!user) {
//     const error = new Error("user not found");
//     return next(error);
//   }

//   const cart = user.cart.items;

//   const createdOrder = new Order({
//     items: [...cart],
//     user: userId,
//   });

//   await createdOrder.save();
// }

exports.signup = signup;
exports.login = login;
exports.addToCart = addToCart;
exports.clearCart = clearCart;
exports.getLatestContentOfCart = getLatestContentOfCart;
