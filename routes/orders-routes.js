const express = require("express");
const expressValidator = require("express-validator");
const ordersControllers = require("../controllers/orders-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.get("/getAllOrderHistory/:userId", ordersControllers.getAllOrderHistory);

router.get(
  "/getOrderHistoriesTransactedWithAmazonCredit/:userId",
  ordersControllers.getOrderHistoriesTransactedWithAmazonCredit
);

router.use(checkAuth);
router.post("/createOrder/:userId/:addressId", ordersControllers.createOrder);

module.exports = router;
