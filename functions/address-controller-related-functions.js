const Address = require("../models/address");

function isThisEmailInBlackList(email) {
  if (typeof email !== "string") {
    const error = new TypeError("input is not a string");
    return error;
  }
  let blackListedEmails = ["someone@mail.com", "badcustomer@mail.com"];

  let result;

  for (let i = 0; i < blackListedEmails.length; i++) {
    const blackListedEmail = blackListedEmails[i];
    if (email === blackListedEmail) {
      result = true;
    } else {
      result = false;
    }
  }
  return result;
}

async function setOtherAddressesAsNonDefault(addressId, userId) {
  let allAddresses;
  try {
    allAddresses = await Address.find({ user: userId });
  } catch (error) {
    console.log(error);
    return next(error);
  }

  if (!allAddresses) {
    const error = new Error("エラーが発生しました。");
    return next(error);
  }

  for (let i = 0; i < allAddresses.length; i++) {
    const address = allAddresses[i];
    if (address._id.toString() !== addressId.toString()) {
      address.isDefaultAddress = false;
      try {
        await address.save();
        console.log(updatedAddresses);
      } catch (error) {
        console.log(error);
      }
    }
  }

  // const remainingAddresses = allAddresses.filter(
  //   (v, i) => v._id.toString() !== addressId.toString()
  // );

  // const updatedAddresses = remainingAddresses.map(
  //   (v, i) => (v.isDefaultAddress = false)
  // );

  
}

async function setThisAddressAsDefaultAddress(addressId, userId) {
  // find address doc
  let address;
  try {
    address = await Address.findById(addressId);
  } catch (error) {
    console.log(error);
  }

  if (!address) {
    const error = new Error("住所情報の設定に失敗しました。");
    return next(error);
  }

  // set is default as true
  address.isDefaultAddress = true;
  let message;
  try {
    await address.save();
    message = "この住所をデフォルトに設定しました。";
    console.log(message);
  } catch (error) {
    console.log(error);
    return next(error);
  }

  await setOtherAddressesAsNonDefault(addressId, userId);

  const result = {
    address: address,
    message: message,
  };

  return result;
}

async function getDefaultAddress(userId) {
  let defaultAddress;
  try {
    defaultAddress = await Address.find({
      user: userId,
      isDefaultAddress: true,
    }).exec();
  } catch (error) {
    console.log(error);
    return next(error);
  }

  if (!defaultAddress) {
    const error = new Error("デフォルトの住所が存在しません");
    return next(error);
  }

  return defaultAddress;
}

async function getNonDefaultAddress(userId) {
  let nonDefaultAddresses;
  try {
    nonDefaultAddresses = await Address.find({
      user: userId,
      isDefaultAddress: false,
    })
      .sort({ _id: "-1" })
      .exec();
  } catch (error) {
    console.log(error);
    return next(error);
  }

  if (!nonDefaultAddresses) {
    const error = new Error(
      "エラーが発生しました。データの取得に失敗しました。"
    );
    return next(error);
  }

  return nonDefaultAddresses;
}

async function getAllOfRegisteredAddressesOfThisUser(userId) {
  const defaultAddress = await getDefaultAddress(userId);

  const nonDefaultAddresses = await getNonDefaultAddress(userId);

  const addresses = [...defaultAddress, ...nonDefaultAddresses];

  return addresses;
}

exports.isThisEmailInBlackList = isThisEmailInBlackList;
exports.setThisAddressAsDefaultAddress = setThisAddressAsDefaultAddress;
exports.getDefaultAddress = getDefaultAddress;
exports.getNonDefaultAddress = getNonDefaultAddress;
exports.getAllOfRegisteredAddressesOfThisUser = getAllOfRegisteredAddressesOfThisUser;
