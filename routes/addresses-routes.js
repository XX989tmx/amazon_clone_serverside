const express = require("express");
const expressValidator = require("express-validator");
const addressControllers = require("../controllers/address-controllers");

const router = express.Router();

router.post("/createAddress/:userId", addressControllers.createAddress);
router.patch("/updateAddress/:addressId", addressControllers.updateAddress);
module.exports = router;
