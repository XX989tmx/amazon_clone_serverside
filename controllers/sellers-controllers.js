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
  res.json({ res: "seller login page" });
};

exports.signup = signup;
exports.login = login;
