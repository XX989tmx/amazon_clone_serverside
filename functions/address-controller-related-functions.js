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

async function setThisAddressAsDefaultAddress(addressId) {
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

  const result = {
    address: address,
    message: message,
  };

  return result;
}

exports.isThisEmailInBlackList = isThisEmailInBlackList;
exports.setThisAddressAsDefaultAddress = setThisAddressAsDefaultAddress;
