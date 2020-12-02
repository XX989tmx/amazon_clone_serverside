const User = require("../models/user");

async function documentLastLoggedInTime(userId) {
  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
  }
  const now = new Date();
  user.lastLoggedIn.push(now);
  let message;
  try {
    await user.save();
    message = "logged in time was successfully documented.";
  } catch (error) {
    console.log(error);
  }

  return message;
}
