const mongoose = require("mongoose");
const express = require("express");
const User = require("../models/user");

const signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  const createdUser = {
    name: name,
    email: email,
    password: password,
  };

  const existinguser = {
    name: "customer1",
    email: "customer1@gmail.com",
    password: "samplepasswprd123",
  };

  let isError = false;

  if (email === existinguser.email) {
    isError = true;
    const error = new Error("email is already taken");
    next(error);
  }

  if (password === existinguser.password) {
    isError = true;
    const error = new Error("password is already taken");
    next(error);
  }

  if (isError) {
    res.status(401).json({ messsage: "credential is not valid" });
  } else {
    res.status(200).json({ createdUser, message: "successfully signed up" });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const existinguser = {
    name: "customer1",
    email: "customer1@gmail.com",
    password: "samplepasswprd123",
  };

  let isError = false;

  if (existinguser.email !== email) {
    isError = true;
    // throw new Error("email is not valid");
  }

  if (existinguser.password !== password) {
    isError = true;
    // throw new Error("password is not valid");
  }

  if (isError) {
    res
      .status(401)
      .json({ message: "authentication failed. credential is not valid" });
  } else {
    res.status(200).json({ existinguser, message: "logged in" });
  }
};

exports.signup = signup;
exports.login = login;
