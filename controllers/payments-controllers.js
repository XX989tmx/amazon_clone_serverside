const { validationResult } = require("express-validator");
const User = require("../models/user");
const CreditCard = require("../models/credit-card");

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

exports.addNewCreditCard = addNewCreditCard;
exports.updateCreditCard = updateCreditCard;
exports.deleteCreditCard = deleteCreditCard;
