// tests/models/Product.test.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Product = require("../../models/Product");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Product Model Test", () => {
  beforeEach(async () => {
    await Product.deleteMany({});
  });

  it("should create and save a product successfully", async () => {
    const productData = {
      name: "Test Product",
      price: 29.99,
      description: "Description for test product",
      image: "image.jpg",
      stock: 100,
    };

    const product = new Product(productData);
    const savedProduct = await product.save();

    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe(productData.name);
    expect(savedProduct.price).toBe(productData.price);
    expect(savedProduct.description).toBe(productData.description);
    expect(savedProduct.image).toBe(productData.image);
    expect(savedProduct.stock).toBe(productData.stock);
    expect(savedProduct.reviews).toEqual([]);
  });


  it("should set default values for price and stock", async () => {
    const productData = {
      name: "Test Product",
      description: "Description for test product",
      image: "image.jpg",
    };

    const product = new Product(productData);
    const savedProduct = await product.save();

    expect(savedProduct.price).toBe(0);
    expect(savedProduct.stock).toBe(0);
  });

  it("should add a review to the product", async () => {
    const productData = {
      name: "Test Product",
      price: 29.99,
      description: "Description for test product",
      image: "image.jpg",
      stock: 100,
    };

    const product = new Product(productData);
    const savedProduct = await product.save();

    const review = {
      user: new mongoose.Types.ObjectId(),
      rating: 5,
      comment: "Great product!",
    };

    savedProduct.reviews.push(review);
    const updatedProduct = await savedProduct.save();

    expect(updatedProduct.reviews.length).toBe(1);
    expect(updatedProduct.reviews[0].rating).toBe(review.rating);
    expect(updatedProduct.reviews[0].comment).toBe(review.comment);
  });
});
