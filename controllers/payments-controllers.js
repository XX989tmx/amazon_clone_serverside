const { validationResult } = require("express-validator");
const User = require("../models/user");
const CreditCard = require("../models/credit-card");
const AmazonCreditOrder = require("../models/amazon-credit-order");

const addNewCreditCard = async (req, res, next) => {
  const userId = req.userData.userId;

  const errors = validationResult(req);
  if (errors.isEmpty() === false) {
    console.log(errors);
    const error = new Error("Invalid inputs.");
    return next(error);
  }

  const {
    cardNumber,
    firstName,
    lastName,
    pinNumber,
    expirationMonth,
    expirationYear,
  } = req.body;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
  }

  const createdCreditCard = new CreditCard({
    user: user._id,
    cardNumber,
    firstName,
    lastName,
    pinNumber,
    expirationMonth,
    expirationYear,
  });

  try {
    await createdCreditCard.save();
  } catch (error) {
    console.log(error);
  }

  await user.paymentMethod.creditCards.push(createdCreditCard);

  try {
    await user.save();
  } catch (error) {
    console.log(error);
  }

  res.json({ user, createdCreditCard });
};

const updateCreditCard = async (req, res, next) => {
  const userId = req.params.userId;
  const creditCardId = req.params.creditCardId;

  const errors = validationResult(req);
  if (errors.isEmpty() === false) {
    const error = new Error("Invalid inputs.");
    console.log(error);
    return next(error);
  }

  const {
    cardNumber,
    firstName,
    lastName,
    pinNumber,
    expirationMonth,
    expirationYear,
  } = req.body;

  let existingCreditCard;
  try {
    existingCreditCard = await CreditCard.findById(creditCardId);
  } catch (error) {
    console.log(error);
  }

  if (!existingCreditCard) {
    const error = new Error("Card data was not found.");
    return next(error);
  }

  console.log(existingCreditCard.user);
  console.log(req.userData.userId);

  if (existingCreditCard.user.toString() !== req.userData.userId) {
    const error = new Error(
      "Authorization error. you are not authorized to edit this data."
    );
    return next(error);
  }

  existingCreditCard.cardNumber = cardNumber;
  existingCreditCard.firstName = firstName;
  existingCreditCard.lastName = lastName;
  existingCreditCard.pinNumber = pinNumber;
  existingCreditCard.expirationMonth = expirationMonth;
  existingCreditCard.expirationYear = expirationYear;

  try {
    await existingCreditCard.save();
  } catch (error) {
    console.log(error);
  }

  res.json({ existingCreditCard });
};

const deleteCreditCard = async (req, res, next) => {
  const userId = req.userData.userId;
  const creditCardId = req.params.creditCardId;

  let existingCreditCard;
  try {
    existingCreditCard = await CreditCard.findById(creditCardId);
  } catch (error) {
    console.log(error);
  }

  if (!existingCreditCard) {
    const error = new Error("Card was not found.");
    return next(error);
  }

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
  }

  if (!user) {
    const error = new Error("User was not found.");
    return next(error);
  }

  console.log(existingCreditCard.user);
  console.log(req.userData.userId);

  if (existingCreditCard.user.toString() !== req.userData.userId) {
    const error = new Error(
      "Authorization failed. you are not allowed to delete this data."
    );
    return next(error);
  }

  try {
    await user.paymentMethod.creditCards.pull(existingCreditCard);
    await user.save();
  } catch (error) {
    console.log(error);
  }

  try {
    await existingCreditCard.remove();
  } catch (error) {
    console.log(error);
  }

  res.json({ user });
};

const chargeAmazonCredit = async (req, res, next) => {
  const { amount, paymentMethod } = req.body;
  const selectedPrice = req.query.selectedPrice;
  const userId = req.params.userId;

  let orderedPrice;

  if (amount) {
    orderedPrice = Number(amount);
  } else if (selectedPrice) {
    switch (selectedPrice) {
      case "5000":
        orderedPrice = 5000;
        break;
      case "20000":
        orderedPrice = 20000;
        break;
      case "40000":
        orderedPrice = 40000;
        break;
      case "90000":
        orderedPrice = 90000;
        break;

      default:
        orderedPrice = 20000;
        break;
    }
  } else {
    orderedPrice = 20000;
  }

  const createdAmazonCreditOrder = new AmazonCreditOrder({
    totalPrice: orderedPrice,
    dateOrdered: new Date(),
    paymentMethod: paymentMethod,
    user: userId,
  });

  await createdAmazonCreditOrder.save();

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
    return next(error);
  }

  if (!user) {
    const error = new Error("Error occurred. user data was not found.");
    return next(error);
  }

  const existingAmazonCreditAmount = user.wallet.amazonCredit;
  const updatedAmazonCreditAmount = existingAmazonCreditAmount + orderedPrice;

  user.wallet.amazonCredit = updatedAmazonCreditAmount;

  await user.amazonCreditOrders.push(createdAmazonCreditOrder);

  await user.save();

  res.json({ user, createdAmazonCreditOrder });
};

const getAllAmazonCreditPurchaseHistory = async (req, res, next) => {
  const userId = req.params.userId;

  let user;
  try {
    user = await User.findById(userId).populate({path: "amazonCreditOrders"});
  } catch (error) {
    console.log(error);
    return next(error);
  }

  if (!user) {
    const error = new Error("User was not found. please try again.");
    return next(error);
  }

  const amazonCreditOrderHistories = user.amazonCreditOrders;

  if (!amazonCreditOrderHistories) {
    const error = new Error("Error occurred. Failed to load data.");
    return next(error);
  }

  if (amazonCreditOrderHistories.length === 0) {
    const error = new Error("You do not have order history.");
    return next(error);
  }

  res.status(200).json({ amazonCreditOrderHistories });
};

exports.addNewCreditCard = addNewCreditCard;
exports.updateCreditCard = updateCreditCard;
exports.deleteCreditCard = deleteCreditCard;
exports.chargeAmazonCredit = chargeAmazonCredit;
exports.getAllAmazonCreditPurchaseHistory = getAllAmazonCreditPurchaseHistory;
