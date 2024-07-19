const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require("../middleware/authMiddleware");


router.post("/", auth, async (req, res) => {
  const { orderItems, totalPrice } = req.body;
  const order = new Order({ user: req.user._id, orderItems, totalPrice });
  const createdOrder = await order.save();
  res.status(201).send(createdOrder);
});

router.get("/", auth, async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
});

module.exports = router;