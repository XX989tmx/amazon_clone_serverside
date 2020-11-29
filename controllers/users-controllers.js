const mongoose = require("mongoose");
const express = require("express");
const bcryptjs = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

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

  const errors = validationResult(req);
  if (errors.isEmpty() !== true) {
    console.log(errors);
    const error = new Error("Invalid inputs. please check your input again.");
    return next(error);
  }

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

  res.json({ cart: user.cart, message: "商品がカートに追加されました。" });
};

const clearCart = async (req, res, next) => {
  const userId = req.params.userId;

  let user;
  try {
    user = await User.findById(userId).select("-password");
  } catch (error) {
    console.log(error);
  }

  if (!user) {
    const error = new Error("Error occurred. Could not find cart data.");
    return next(error);
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
        populate: {
          path: "items",
          populate: {
            path: "productId",
            populate: { path: "seller", select: "-password" },
          },
        },
      })
      .populate("addresses");
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

const removeItemFromCart = async (req, res, next) => {
  const itemId = req.params.itemId;
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
    const error = new Error("Error occurred. Data was not found.");
    return next(error);
  }

  const cart = user.cart;

  const totalCountOfItemInCart = cart.totalCount;
  const totalPriceOfCart = cart.totalPrice;

  const IndexOfDeleteCandidateItem = cart.items.findIndex(
    (v, i) => v._id.toString() === itemId.toString()
  );
  const deleteCandidateItem = cart.items[IndexOfDeleteCandidateItem];
  console.log(deleteCandidateItem);
  const countOfDeleteCandidateItem = deleteCandidateItem.quantity;
  console.log(countOfDeleteCandidateItem);
  const priceOfDeleteCandidateItem = deleteCandidateItem.productId.price;
  const totalPriceOfDeleteCandidateItem =
    priceOfDeleteCandidateItem * countOfDeleteCandidateItem;

  // カートの合計額と合計商品点数を更新する
  const updatedTotalPriceOfCart =
    totalPriceOfCart - totalPriceOfDeleteCandidateItem;

  const updatedTotalCountOfCart =
    totalCountOfItemInCart - countOfDeleteCandidateItem;

  //合計額の更新
  user.cart.totalPrice = updatedTotalPriceOfCart;
  //合計点数の更新
  user.cart.totalCount = updatedTotalCountOfCart;

  // deleteCandidateをItems array から削除する
  const targetIndex = user.cart.items.findIndex(
    (v, i) => v.id.toString() === itemId.toString()
  );
  console.log(targetIndex);

  user.cart.items.splice(targetIndex, 1);

  // カートの更新完了
  await user.save();

  const message = "商品がカートから削除されました";

  res.status(200).json({ user: user, message: message });
};

const changeQuantityOfItemInCart = async (req, res, next) => {
  const userId = req.params.userId;
  const itemId = req.params.itemId;

  const { changedQuantity } = req.body;

  let user;
  try {
    user = await User.findById(userId)
      .select("password")
      .populate({
        path: "cart",
        populate: { path: "items", populate: { path: "productId" } },
      });
  } catch (error) {
    console.log(error);
    return next(error);
  }

  if (!user) {
    const error = new Error("Error occurred. Failed to load data.");
    return next(error);
  }

  const cart = user.cart;
  //現在のカートの総数と総額を取得
  const totalCountOfItemInCart = cart.totalCount;
  const totalPriceOdItemInCart = cart.totalPrice;

  // find target item
  let updateCandidate;
  for (let i = 0; i < user.cart.items.length; i++) {
    const item = user.cart.items[i];
    if (item._id.toString() === itemId.toString()) {
      updateCandidate = item;
    }
  }

  // 既存のquantityを取得
  const existingQuantity = updateCandidate.quantity;
  console.log(existingQuantity);

  const existingPrice = updateCandidate.productId.price;
  const existingTotalPrice = existingPrice * existingQuantity;

  // 変更された数量による影響額と個数を取得
  const changedPrice = existingPrice * +changedQuantity;

  // カートの総数と総額を更新

  const temp =
    Number(user.cart.totalCount) - +existingQuantity + +changedQuantity;
  user.cart.totalCount = temp;

  user.cart.totalPrice =
    user.cart.totalPrice - existingTotalPrice + changedPrice;

  // target itemを数量を更新
  for (let i = 0; i < user.cart.items.length; i++) {
    const item = user.cart.items[i];
    if (item._id.toString() === itemId.toString()) {
      user.cart.items[i].quantity = +changedQuantity;
    }
  }

  // 保存
  await user.save();

  const message = "カート内商品の数量が変更されました";

  res.status(200).json({ user, message });
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
exports.removeItemFromCart = removeItemFromCart;
exports.changeQuantityOfItemInCart = changeQuantityOfItemInCart;
