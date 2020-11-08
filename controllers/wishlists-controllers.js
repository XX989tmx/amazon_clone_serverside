const expressValidator = require("express-validator");
const { remove } = require("../models/user");
const User = require("../models/user");

const createNewWishlist = async (req, res, next) => {
  const userId = req.params.userId;
  const productId = req.params.productId;

  const { nameOfWishlist } = req.body;

  if (!nameOfWishlist) {
    const error = new Error(
      "No name is provided for whishlist. Name is required."
    );
    return next(error);
  }

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

  const duplicatedItems = user.wishlists[targetIndex].wishlist.filter((v) => {
    return v.productId.toString() === productId.toString();
  });
  console.log(duplicatedItems);

  if (duplicatedItems.length !== 0) {
    const error = new Error("the same item is already in the wishlist.");
    return next(error);
  }

  user.wishlists[targetIndex].wishlist.push({
    productId: productId,
    dateAdded: new Date(),
  });

  await user.save();

  res.json({ user });
};

const removeProductFromWishlist = async (req, res, next) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  const wishlistId = req.params.wishlistId;
  const idOfItemInWishlist = req.params.idOfItemInWishlist;

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
      return v._id.toString() === idOfItemInWishlist.toString();
    }
  );
  console.log(IndexOfProductToRemove);

  if (IndexOfProductToRemove === -1) {
    const error = new Error(
      "Id does not match. Failed to remove item from wishlist."
    );
    return next(error);
  } else {
    user.wishlists[targetIndex].wishlist.splice(IndexOfProductToRemove, 1);
  }

  await user.save();

  res.json({ user });
};

const deleteWishlist = async (req, res, next) => {
  const userId = req.params.userId;
  const wishlistId = req.params.wishlistId;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
    next(error);
  }

  if (!user) {
    const error = new Error("user was not found. failed to delete wishlist.");
    return next(error);
  }

  const targetIndex = user.wishlists.findIndex((v) => {
    return v._id.toString() === wishlistId.toString();
  });
  const wishlistDocument = user.wishlists[targetIndex];
  await wishlistDocument.remove();

  await user.save();

  res.json({ user });
};

const getSpecificWishlist = async (req, res, next) => {
  const userId = req.params.userId;
  const wishlistId = req.params.wishlistId;

  let user;
  try {
    user = await User.findById(userId).populate({
      path: "wishlists",
      populate: { path: "wishlist", populate: { path: "productId" } },
    });
  } catch (error) {
    console.log(error);
    next(error);
  }

  if (!user) {
    const error = new Error("user was not found. failed to get wishlist.");
    return next(error);
  }

  const targetWishlist = user.wishlists.find((v) => {
    return v._id.toString() === wishlistId.toString();
  });

  const itemCountInWishlist = targetWishlist.wishlist.length;

  res.json({ targetWishlist, itemCountInWishlist });
};

exports.createNewWishlist = createNewWishlist;
exports.addProductToWishlist = addProductToWishlist;
exports.removeProductFromWishlist = removeProductFromWishlist;
exports.deleteWishlist = deleteWishlist;
exports.getSpecificWishlist = getSpecificWishlist;
