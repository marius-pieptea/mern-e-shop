const Product = require("../models/Product");

exports.getProducts = async (req, res) => {
  const { category, minPrice, maxPrice, search } = req.query;
  let query = {};

  if (category) query.category = category;
  if (minPrice) query.price = { $gte: minPrice };
  if (maxPrice) query.price = { ...query.price, $lte: maxPrice };
  if (search) query.name = { $regex: search, $options: "i" };

  const products = await Product.find(query);
  res.send(products);
};

exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).send(product);
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "reviews.user",
      "name"
    );
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.send(product);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      return res.status(404).send("Product not found");
    }
    res.send(product);
  } catch (error) {
    res.status(500).send("Server error");
  }
};

exports.deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).send("Product not found");
  res.send({ message: "Product deleted" });
};

exports.addReview = async (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).send("Product not found");
    }

    const review = {
      user: req.user._id,
      rating,
      comment,
    };

    product.reviews.push(review);
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error.message);
  }
};
