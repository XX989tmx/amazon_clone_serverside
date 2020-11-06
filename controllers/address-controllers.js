const User = require("../models/user");
const Address = require("../models/address");

const createAddress = async (req, res, next) => {
  const userId = req.params.userId;

  const {
    zipCode,
    country,
    name,
    todoufuken,
    addressInfo1,
    addressInfo2,
    phoneNumber,
    email,
    company,
  } = req.body;

  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
  }

  const createdAddress = new Address({
    user: userId,
    zipCode,
    country,
    name,
    todoufuken,
    addressInfo1,
    addressInfo2,
    phoneNumber,
    email,
    company,
  });

  try {
    await createdAddress.save();
  } catch (error) {
    console.log(error);
  }

  await user.addresses.push(createdAddress);

  try {
    await user.save();
  } catch (error) {
    console.log(error);
  }

  res.json({ createdAddress, user });
};

const updateAddress = async (req, res, next) => {
  const addressId = req.params.addressId;
  const {
    zipCode,
    country,
    name,
    todoufuken,
    addressInfo1,
    addressInfo2,
    phoneNumber,
    email,
    company,
  } = req.body;

  let existingAddress;
  try {
    existingAddress = await Address.findById(addressId);
  } catch (error) {
    console.log(error);
  }

  if (!existingAddress) {
    const error = new Error("Address wa not found.");
    return next(error);
  }

  existingAddress.zipCode = zipCode;
  existingAddress.country = country;
  existingAddress.name = name;
  existingAddress.todoufuken = todoufuken;
  existingAddress.addressInfo1 = addressInfo1;
  existingAddress.addressInfo2 = addressInfo2;
  existingAddress.phoneNumber = phoneNumber;
  existingAddress.email = email;
  existingAddress.company = company;

  try {
    await existingAddress.save();
  } catch (error) {
    console.log(error);
  };

  res.json({ existingAddress });
};

exports.createAddress = createAddress;
exports.updateAddress = updateAddress;
