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

exports.createAddress = createAddress;
