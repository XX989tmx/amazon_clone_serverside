const express = require("express");
const expressValidator = require("express-validator");
const ordersControllers = require("../controllers/orders-controllers");

const router = express.Router();

router.post("/createOrder/:userId/:addressId", ordersControllers.createOrder);

module.exports = router;
