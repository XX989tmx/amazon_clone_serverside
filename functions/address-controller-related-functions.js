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

exports.isThisEmailInBlackList = isThisEmailInBlackList;
