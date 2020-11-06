const express = require("express");
const expressValidator = require("express-validator");
const paymentsControllers = require("../controllers/payments-controllers");

const router = express.Router();

router.post("/addNewCreditCard/:userId", paymentsControllers.addNewCreditCard);

router.patch(
  "/updateCreditCard/:creditCardId",
  paymentsControllers.updateCreditCard
);

module.exports = router;
