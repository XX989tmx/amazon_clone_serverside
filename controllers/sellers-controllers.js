const express = require('express')
const expressValidator = require('express-validator')
const mongoose = require('mongoose')


const signup = async (req, res, next) => {
  res.json({ res: "seller signup page" });
};

const login = async (req, res, next) => {
  res.json({ res: "seller login page" });
};

exports.signup = signup;
exports.login = login;
