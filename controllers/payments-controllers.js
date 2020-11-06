const User = require("../models/user");
const CreditCard = require("../models/credit-card");

const addNewCreditCard = async (req, res, next) => {
  const userId = req.params.userId;

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

exports.addNewCreditCard = addNewCreditCard;
exports.updateCreditCard = updateCreditCard;
