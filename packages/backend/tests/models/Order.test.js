const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Order = require("../../models/Order");
const Product = require("../../models/Product");
const User = require("../../models/User");

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

describe("Order Model Test", () => {
  let user;
  let product;

  beforeEach(async () => {
    await Order.deleteMany({});
    await User.deleteMany({});
    await Product.deleteMany({});

    user = new User({
      name: "Test User",
      email: "test@example.com",
      password: "password",
    });
    await user.save();

    product = new Product({
      name: "Test Product",
      price: 29.99,
      description: "Description for test product",
      image: "image.jpg",
      stock: 100,
    });
    await product.save();
  });

  it("should create and save an order successfully", async () => {
    const orderData = {
      user: user._id,
      orderItems: [
        {
          name: product.name,
          qty: 2,
          price: product.price,
          product: product._id,
        },
      ],
      totalPrice: 59.98,
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();

    expect(savedOrder._id).toBeDefined();
    expect(savedOrder.user.toString()).toBe(orderData.user.toString());
    expect(savedOrder.orderItems.length).toBe(1);
    expect(savedOrder.orderItems[0].name).toBe(orderData.orderItems[0].name);
    expect(savedOrder.orderItems[0].qty).toBe(orderData.orderItems[0].qty);
    expect(savedOrder.orderItems[0].price).toBe(orderData.orderItems[0].price);
    expect(savedOrder.orderItems[0].product.toString()).toBe(
      orderData.orderItems[0].product.toString()
    );
    expect(savedOrder.totalPrice).toBe(orderData.totalPrice);
    expect(savedOrder.isPaid).toBe(false);
  });

  it("should set default values for isPaid", async () => {
    const orderData = {
      user: user._id,
      orderItems: [
        {
          name: product.name,
          qty: 2,
          price: product.price,
          product: product._id,
        },
      ],
      totalPrice: 59.98,
    };

    const order = new Order(orderData);
    const savedOrder = await order.save();

    expect(savedOrder.isPaid).toBe(false);
  });

it("should fail to create an order without required fields", async () => {
  const orderData = {
    user: user._id,
    orderItems: [{}], // Empty object to trigger nested validation errors
    totalPrice: 0,
  };

  const order = new Order(orderData);

  let err;
  try {
    await order.save();
  } catch (error) {
    err = error;
  }

  expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  expect(err.errors.user).toBeUndefined(); // User is provided, so no error here
  expect(err.errors["orderItems.0.name"]).toBeDefined();
  expect(err.errors["orderItems.0.qty"]).toBeDefined();
  expect(err.errors["orderItems.0.price"]).toBeDefined();
  expect(err.errors["orderItems.0.product"]).toBeDefined();
  expect(err.errors.totalPrice).toBeUndefined(); // Total price is provided, so no error here
});

  it("should calculate the total price correctly", async () => {
    const orderData = {
      user: user._id,
      orderItems: [
        {
          name: product.name,
          qty: 2,
          price: product.price,
          product: product._id,
        },
        {
          name: product.name,
          qty: 1,
          price: product.price,
          product: product._id,
        },
      ],
      totalPrice: 0, // This will be calculated
    };

    const order = new Order(orderData);
    order.totalPrice = order.orderItems.reduce(
      (acc, item) => acc + item.qty * item.price,
      0
    );
    const savedOrder = await order.save();

    expect(savedOrder.totalPrice).toBe(89.97); // 2 * 29.99 + 1 * 29.99
  });
});