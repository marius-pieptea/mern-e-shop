const admin = require("../../middleware/adminMiddleware");

describe("Admin Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: {
        isAdmin: false,
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should call next if user is admin", () => {
    req.user.isAdmin = true;
    admin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it("should return 403 if user is not admin", () => {
    admin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Not authorized as an admin",
    });
  });

  it("should return 403 if user is not defined", () => {
    req.user = undefined;
    admin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Not authorized as an admin",
    });
  });
});
