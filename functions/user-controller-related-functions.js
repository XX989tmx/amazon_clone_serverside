const User = require("../models/user");

async function findUserById(userId) {
  let user;
  try {
    user = await User.findById(userId);
  } catch (error) {
    console.log(error);
  }

  if (!user) {
    const error = new Error("user data was not found.");
    return next(error);
  }

  return user;
}

async function saveUser(user) {
  try {
    await user.save();
  } catch (error) {
    console.log(error);
  }
}

async function documentLastLoggedInTime(userId) {
  let user = await findUserById(userId);

  const now = new Date();
  user.lastLoggedIn.push(now);
  await saveUser(user);

  let message = "logged in time was successfully documented.";
  return message;
}
