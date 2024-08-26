const mongoose = require("mongoose");
const Order = require("../models/Order");

exports.createOrder = async (req, res) => {
  try {
    const { orderItems, totalPrice } = req.body;

    // No need to validate product IDs as ObjectId
    const validatedOrderItems = orderItems.map((item) => ({
      ...item,
      product: item.product, // Keep product as string
    }));

    const order = new Order({
      user: req.user._id,
      orderItems: validatedOrderItems,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).send(createdOrder);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  let orders;
  if (req.user.isAdmin) {
    orders = await Order.find().populate("user", "name email");
  } else {
    orders = await Order.find({ user: req.user._id });
  }
  res.send(orders);
};

exports.updateOrder = async (req, res) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!order) return res.status(404).send("Order not found");
  res.send(order);
};

exports.deleteOrder = async (req, res) => {
  const order = await Order.findByIdAndDelete(req.params.id);
  if (!order) return res.status(404).send("Order not found");
  res.send({ message: "Order deleted" });
};
