const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const auth = require("../middleware/authMiddleware");

// Fetch all products with optional filters
router.get("/", async (req, res) => {
  const { category, minPrice, maxPrice, search } = req.query;
  let query = {};

  if (category) query.category = category;
  if (minPrice) query.price = { $gte: minPrice };
  if (maxPrice) query.price = { ...query.price, $lte: maxPrice };
  if (search) query.name = { $regex: search, $options: "i" };

  const products = await Product.find(query);
  res.send(products);
});

// Add a new product
router.post("/", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.send(product);
});

// Fetch a single product by ID
router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).send("Product not found");
  res.send(product);
});

// Add a review to a product
router.post("/products/:id/reviews", auth, async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    const review = {
      user: req.user._id, // Ensure this is an ObjectId
      rating,
      comment,
    };

    product.reviews.push(review);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error.message);
  }
});


module.exports = router;
