const expressValidator = require("express-validator");
const { remove } = require("../models/user");
const User = require("../models/user");

const createNewWishlist = async (req, res, next) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  const { nameOfWishlist } = req.body;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
    next(error);
  }

  if (!user) {
    const error = new Error("user was not found. failed to create wishlist.");
    return next(error);
  }

  const createdWishlist = {
    name: nameOfWishlist,
    wishlist: [],
    dateCreated: new Date(),
  };

  //   createdWishlist.wishlist.push(productId);

  user.wishlists.push(createdWishlist);

  try {
    await user.save();
  } catch (error) {
    console.log(error);
    next(error);
  }

  res.json({
    wishlists: user.wishlists.map((v) => v.toObject({ getters: true })),
  });
};

const addProductToWishlist = async (req, res, next) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  const wishlistId = req.params.wishlistId;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
    next(error);
  }

  if (!user) {
    const error = new Error(
      "user was not found. faild to add product to wishlist."
    );
    return next(error);
  }

  const targetIndex = user.wishlists.findIndex((v) => {
    return v._id.toString() === wishlistId.toString();
  });
  console.log(targetIndex);

  user.wishlists[targetIndex].wishlist.push(productId);

  await user.save();

  res.json({ user });
};

const removeProductFromWishlist = async (req, res, next) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  const wishlistId = req.params.wishlistId;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
    next(error);
  }

  if (!user) {
    const error = new Error(
      "user was not founc. failed to remove item from wishlist."
    );
    return next(error);
  }

  const targetIndex = user.wishlists.findIndex((v) => {
    return v._id.toString() === wishlistId.toString();
  });
  const IndexOfProductToRemove = user.wishlists[targetIndex].wishlist.findIndex(
    (v) => {
      return v.toString() === productId.toString();
    }
  );

  user.wishlists[targetIndex].wishlist.splice(IndexOfProductToRemove, 1);

  await user.save();

  res.json({ user });
};

exports.createNewWishlist = createNewWishlist;
exports.addProductToWishlist = addProductToWishlist;
exports.removeProductFromWishlist = removeProductFromWishlist;
