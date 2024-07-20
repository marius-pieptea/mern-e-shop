// tests/models/User.test.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../../models/User");
const bcrypt = require("bcryptjs");

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

describe("User Model Test", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it("should create and save a user successfully", async () => {
    const userData = {
      name: "Test User",
      email: "testuser@example.com",
      password: await bcrypt.hash("plaintextpassword", 10), // Hashing in the test
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(userData.name);
    expect(savedUser.email).toBe(userData.email);
    expect(savedUser.password).toBe(userData.password); // Password should already be hashed
    expect(savedUser.isAdmin).toBe(false); // Default value
  });

  it("should not allow duplicate email addresses", async () => {
    const userData = {
      name: "Test User",
      email: "testuser@example.com",
      password: await bcrypt.hash("plaintextpassword", 10), // Hashing in the test
    };

    const user1 = new User(userData);
    await user1.save();

    const user2 = new User(userData);
    let error;
    try {
      await user2.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.name).toBe("MongoServerError");
    expect(error.code).toBe(11000); // Duplicate key error code
  });

  it("should require name, email, and password fields", async () => {
    const user = new User();

    let error;
    try {
      await user.save();
    } catch (e) {
      error = e;
    }

    expect(error).toBeDefined();
    expect(error.errors.name).toBeDefined();
    expect(error.errors.email).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  it("should set isAdmin to false by default", async () => {
    const userData = {
      name: "Test User",
      email: "testuser@example.com",
      password: await bcrypt.hash("plaintextpassword", 10), // Hashing in the test
    };

    const user = new User(userData);
    const savedUser = await user.save();

    expect(savedUser.isAdmin).toBe(false);
  });
});
