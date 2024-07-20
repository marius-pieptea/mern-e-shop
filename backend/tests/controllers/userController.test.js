const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const userController = require("../../controllers/userController");

jest.mock("../../models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("crypto");
jest.mock("nodemailer");

describe("User Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: { _id: "userId" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    jest.clearAllMocks();
    process.env.JWT_SECRET = "testsecret"; // Set the JWT secret for testing
  });

  describe("loginUser", () => {
    it("should login a user", async () => {
      req.body = { email: "john@example.com", password: "123456" };
      User.findOne.mockResolvedValue({
        _id: "userId",
        name: "John",
        email: "john@example.com",
        password: "hashedPassword",
        isAdmin: false,
        toObject: jest.fn().mockReturnValue({
          _id: "userId",
          name: "John",
          email: "john@example.com",
          isAdmin: false,
        }),
      });
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token");

      await userController.loginUser(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
      expect(bcrypt.compare).toHaveBeenCalledWith("123456", "hashedPassword");
      expect(jwt.sign).toHaveBeenCalledWith(
        {
          _id: "userId",
          name: "John",
          email: "john@example.com",
          isAdmin: false,
        },
        "testsecret",
        { expiresIn: "1h" }
      );
      expect(res.send).toHaveBeenCalledWith({
        _id: "userId",
        name: "John",
        email: "john@example.com",
        isAdmin: false,
        token: "token",
      });
    });

    it("should return 401 if email or password is incorrect", async () => {
      req.body = { email: "john@example.com", password: "123456" };
      User.findOne.mockResolvedValue(null);

      await userController.loginUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Invalid email or password");
    });
  });

  // describe("updateUserProfile", () => {
  //   it("should update user profile", async () => {
  //     req.body = {
  //       name: "John Updated",
  //       email: "johnupdated@example.com",
  //       oldPassword: "123456",
  //       newPassword: "654321",
  //     };
  //     const mockUser = {
  //       _id: "userId",
  //       name: "John",
  //       email: "john@example.com",
  //       password: "hashedPassword",
  //       save: jest.fn().mockResolvedValue(true),
  //     };
  //     User.findById.mockResolvedValue(mockUser);
  //     bcrypt.compareSync.mockReturnValue(true);
  //     bcrypt.hashSync.mockReturnValue("newHashedPassword");

  //     await userController.updateUserProfile(req, res);

  //     expect(User.findById).toHaveBeenCalledWith("userId");
  //     expect(bcrypt.compareSync).toHaveBeenCalledWith(
  //       "123456",
  //       "hashedPassword"
  //     );
  //     expect(bcrypt.hashSync).toHaveBeenCalledWith("654321", 8);
  //     expect(res.send).toHaveBeenCalledWith({
  //       _id: mockUser._id,
  //       name: "John Updated",
  //       email: "johnupdated@example.com",
  //       password: "newHashedPassword",
  //     });
  //   });

  //   it("should return 404 if user not found", async () => {
  //     User.findById.mockResolvedValue(null);

  //     await userController.updateUserProfile(req, res);

  //     expect(res.status).toHaveBeenCalledWith(404);
  //     expect(res.send).toHaveBeenCalledWith("User not found");
  //   });
  // });

  // describe("requestPasswordReset", () => {
  //   it("should send password reset email", async () => {
  //     req.body = { email: "john@example.com" };
  //     User.findOne.mockResolvedValue({
  //       _id: "userId",
  //       email: "john@example.com",
  //       save: jest.fn().mockResolvedValue(true),
  //     });
  //     crypto.randomBytes.mockReturnValue(Buffer.from("resetToken"));
  //     const sendMailMock = jest
  //       .fn()
  //       .mockImplementation((options, callback) => callback(null, true));
  //     nodemailer.createTransport.mockReturnValue({ sendMail: sendMailMock });

  //     await userController.requestPasswordReset(req, res);

  //     expect(User.findOne).toHaveBeenCalledWith({ email: "john@example.com" });
  //     expect(crypto.randomBytes).toHaveBeenCalledWith(32);
  //     expect(User.prototype.save).toHaveBeenCalled();
  //     expect(nodemailer.createTransport).toHaveBeenCalledWith({
  //       service: "gmail",
  //       auth: {
  //         user: process.env.EMAIL,
  //         pass: process.env.EMAIL_PASSWORD,
  //       },
  //     });
  //     expect(sendMailMock).toHaveBeenCalled();
  //   });
  // });
});
