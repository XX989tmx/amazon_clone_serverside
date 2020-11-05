const express = require("express");
const router = express.Router();

router.post("/signup", function (req, res) {
  const { name, email, password } = req.body;
  const createdUser = {
    name: name,
    email: email,
    password: password,
  };

  res.json({ createdUser });
});

router.post("/login", function (req, res) {
  const { email, password } = req.body;

  const existinguser = {
    name: "customer1",
    email: "customer1@gmail.com",
    password: "samplepasswprd123",
  };

  let isError = false;

  if (existinguser.email !== email) {
    isError = true;
    throw new Error("email is not valid");
  }

  if (existinguser.password !== password) {
    isError = true;
    throw new Error("password is not valid");
  }

  if (isError) {
    res
      .status(401)
      .json({ message: "authentication failed. credential is not valid" });
  } else {
    res.status(200).json({ existinguser, message: "logged in" });
  }
});

module.exports = router;
