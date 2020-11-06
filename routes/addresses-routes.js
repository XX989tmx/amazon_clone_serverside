const express = require("express");
const expressValidator = require("express-validator");
const addressControllers = require("../controllers/address-controllers");

const router = express.Router();

router.post("/createAddress/:userId", addressControllers.createAddress);
router.patch("/updateAddress/:addressId", addressControllers.updateAddress);
router.delete(
  "/deleteAddress/:userId/:addressId",
  addressControllers.deleteAddress
);
module.exports = router;
