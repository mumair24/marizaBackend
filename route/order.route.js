const express = require("express");
const router = express.Router();
const orderController = require('../controller/order.controller');

router.post(
    "/order",
    orderController.fillDeliveryInfoForAllCarts
);

router.get(
    "/getOrders",
    orderController.getAllOrdersController
);

// router.get(
//     "/getOrderItems",
//     orderController.getAllOrderItemsWithDetails
// );

module.exports = router;