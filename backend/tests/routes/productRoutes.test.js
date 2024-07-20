const request = require("supertest");
const express = require("express");
const productRoutes = require("../../routes/productRoutes");
const productController = require("../../controllers/productController");
const auth = require("../../middleware/authMiddleware");
const admin = require("../../middleware/adminMiddleware");

const app = express();
app.use(express.json());
app.use("/api/products", productRoutes);

jest.mock("../../controllers/productController");
jest.mock("../../middleware/authMiddleware");
jest.mock("../../middleware/adminMiddleware");

describe("Product Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /api/products", () => {
    it("should fetch all products", async () => {
      productController.getProducts.mockImplementation((req, res) => {
        res.status(200).send([]);
      });

      const res = await request(app).get("/api/products");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
      expect(productController.getProducts).toHaveBeenCalled();
    });
  });

  describe("POST /api/products", () => {
    it("should create a new product", async () => {
      auth.mockImplementation((req, res, next) => next());
      admin.mockImplementation((req, res, next) => next());
      productController.createProduct.mockImplementation((req, res) => {
        res.status(201).send(req.body);
      });

      const newProduct = { name: "Test Product", price: 100, category: "Test" };
      const res = await request(app).post("/api/products").send(newProduct);
      expect(res.status).toBe(201);
      expect(res.body).toEqual(newProduct);
      expect(productController.createProduct).toHaveBeenCalled();
    });
  });

  describe("GET /api/products/:id", () => {
    it("should fetch a single product by ID", async () => {
      const product = {
        _id: "1",
        name: "Test Product",
        price: 100,
        category: "Test",
      };
      productController.getProductById.mockImplementation((req, res) => {
        res.status(200).send(product);
      });

      const res = await request(app).get("/api/products/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual(product);
      expect(productController.getProductById).toHaveBeenCalled();
    });
  });

  describe("PUT /api/products/:id", () => {
    it("should update a product", async () => {
      auth.mockImplementation((req, res, next) => next());
      admin.mockImplementation((req, res, next) => next());
      const updatedProduct = {
        name: "Updated Product",
        price: 150,
        category: "Updated",
      };
      productController.updateProduct.mockImplementation((req, res) => {
        res.status(200).send(updatedProduct);
      });

      const res = await request(app)
        .put("/api/products/1")
        .send(updatedProduct);
      expect(res.status).toBe(200);
      expect(res.body).toEqual(updatedProduct);
      expect(productController.updateProduct).toHaveBeenCalled();
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("should delete a product", async () => {
      auth.mockImplementation((req, res, next) => next());
      admin.mockImplementation((req, res, next) => next());
      productController.deleteProduct.mockImplementation((req, res) => {
        res.status(200).send({ message: "Product deleted" });
      });

      const res = await request(app).delete("/api/products/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: "Product deleted" });
      expect(productController.deleteProduct).toHaveBeenCalled();
    });
  });

  describe("POST /api/products/:id/reviews", () => {
    it("should add a review to a product", async () => {
      auth.mockImplementation((req, res, next) => next());
      const review = { rating: 5, comment: "Great product!" };
      productController.addReview.mockImplementation((req, res) => {
        res.status(201).send(review);
      });

      const res = await request(app)
        .post("/api/products/1/reviews")
        .send(review);
      expect(res.status).toBe(201);
      expect(res.body).toEqual(review);
      expect(productController.addReview).toHaveBeenCalled();
    });
  });
});
