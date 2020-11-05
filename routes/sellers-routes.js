const express = require("express");
const { check } = require("express-validator");
const sellersControllers = require("../controllers/sellers-controllers");

const router = express.Router();

router.post("/signup", sellersControllers.signup);

router.post("/login", sellersControllers.login);
module.exports = router;
