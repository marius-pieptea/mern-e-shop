const jwt = require("jsonwebtoken");
const auth = require("../../middleware/authMiddleware");

jest.mock("jsonwebtoken");

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: "Bearer token",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should call next if token is valid", () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { id: "userId" });
    });

    auth(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toEqual({ id: "userId" });
  });

  it("should return 401 if token is invalid", () => {
    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error("Token is invalid"), null);
    });

    auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token is invalid" });
  });

  it("should return 401 if token is not provided", () => {
    req.headers.authorization = undefined;
    auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token is required" });
  });

  it("should return 401 if token does not start with 'Bearer '", () => {
    req.headers.authorization = "InvalidToken";
    auth(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token is required" });
  });
});
