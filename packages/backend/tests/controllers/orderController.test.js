const Order = require("../../models/Order");
const orderController = require("../../controllers/orderController");

jest.mock("../../models/Order");

describe("Order Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { _id: "userId", isAdmin: false },
      body: { orderItems: [], totalPrice: 100 },
      params: { id: "orderId" },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
    };
  });

  describe("createOrder", () => {
    it("should create a new order", async () => {
      Order.prototype.save = jest.fn().mockResolvedValue(req.body);
      await orderController.createOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(req.body);
    });
  });

  describe("getOrders", () => {
    it("should fetch orders for admin", async () => {
      req.user.isAdmin = true;
      Order.find = jest
        .fn()
        .mockReturnValue({ populate: jest.fn().mockResolvedValue([]) });
      await orderController.getOrders(req, res);
      expect(res.send).toHaveBeenCalledWith([]);
    });

    it("should fetch orders for user", async () => {
      Order.find = jest.fn().mockResolvedValue([]);
      await orderController.getOrders(req, res);
      expect(res.send).toHaveBeenCalledWith([]);
    });
  });

  describe("updateOrder", () => {
    it("should update an order", async () => {
      Order.findByIdAndUpdate = jest.fn().mockResolvedValue(req.body);
      await orderController.updateOrder(req, res);
      expect(res.send).toHaveBeenCalledWith(req.body);
    });

    it("should return 404 if order not found", async () => {
      Order.findByIdAndUpdate = jest.fn().mockResolvedValue(null);
      await orderController.updateOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Order not found");
    });
  });

  describe("deleteOrder", () => {
    it("should delete an order", async () => {
      Order.findByIdAndDelete = jest.fn().mockResolvedValue(req.body);
      await orderController.deleteOrder(req, res);
      expect(res.send).toHaveBeenCalledWith({ message: "Order deleted" });
    });

    it("should return 404 if order not found", async () => {
      Order.findByIdAndDelete = jest.fn().mockResolvedValue(null);
      await orderController.deleteOrder(req, res);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith("Order not found");
    });
  });
});
