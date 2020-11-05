const express = require("express");
const expressValidator = require("express-validator");
const mongoose = require("mongoose");

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  const createdSeller = {
    name: name,
    email: email,
    password: password,
  };

  res.json({ createdSeller });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const existingSeller = {
    name: "someone",
    email: "sample@mail.com",
    password: "passworddadsad",
  };

  if (email !== existingSeller.email) {
    return next(new Error("email is not matched"));
  }

  if (password !== existingSeller.password) {
    return next(new Error("password is incorrect"));
  }
  res.json({ existingSeller, msg: "succsessfully loggedin" });
};

exports.signup = signup;
exports.login = login;
