const express = require("express");
const expressValidator = require("express-validator");
const ordersControllers = require("../controllers/orders-controllers");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.use(checkAuth);
router.post("/createOrder/:userId/:addressId", ordersControllers.createOrder);

router.get("/getAllOrderHistory/:userId", ordersControllers.getAllOrderHistory);

router.get(
  "/getOrderHistoriesTransactedWithAmazonCredit/:userId",
  ordersControllers.getOrderHistoriesTransactedWithAmazonCredit
);

router.get(
  "/getLatestOrderData/:orderId",
  ordersControllers.getLatestOrderData
);

module.exports = router;
