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

exports.addNewCreditCard = addNewCreditCard;
