const {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  addReview,
} = require("../../controllers/productController");
const Product = require("../../models/Product");

jest.mock("../../models/Product");

describe("Product Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProducts", () => {
    it("should fetch products based on query", async () => {
      const req = { query: { search: "test" } };
      const res = { send: jest.fn() };
      Product.find.mockResolvedValue(["product1", "product2"]);

      await getProducts(req, res);
      expect(Product.find).toHaveBeenCalledWith({
        name: { $regex: "test", $options: "i" },
      });
      expect(res.send).toHaveBeenCalledWith(["product1", "product2"]);
    });
  });

  describe("createProduct", () => {
    it("should create a product", async () => {
      const req = { body: { name: "New Product", price: 100 } };
      const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };
      const mockProduct = new Product();
      Product.mockImplementation(() => mockProduct);
      mockProduct.save = jest.fn().mockResolvedValue(mockProduct);

      await createProduct(req, res);
      expect(mockProduct.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockProduct);
    });
  });

  describe("getProductById", () => {
    it("should return a product by ID", async () => {
      const req = { params: { id: "1" } };
      const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };
      Product.findById.mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue({
          // Mock product data
          _id: "someId",
          name: "Mock Product",
          reviews: [
            // Mock reviews data if necessary
          ],
        }),
      }));

      await getProductById(req, res);
      expect(Product.findById).toHaveBeenCalledWith("1");
      expect(res.send).toHaveBeenCalledWith({
        _id: "someId",
        name: "Mock Product",
        reviews: [],
      });
    });
  });

  describe("updateProduct", () => {
    it("should update a product", async () => {
      const req = { params: { id: "1" }, body: { price: 150 } };
      const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };
      Product.findByIdAndUpdate.mockResolvedValue({ name: "Updated Product" });

      await updateProduct(req, res);
      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
        "1",
        { price: 150 },
        { new: true }
      );
      expect(res.send).toHaveBeenCalledWith({ name: "Updated Product" });
    });
  });

  describe("deleteProduct", () => {
    it("should delete a product", async () => {
      const req = { params: { id: "1" } };
      const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };
      Product.findByIdAndDelete.mockResolvedValue(true);

      await deleteProduct(req, res);
      expect(Product.findByIdAndDelete).toHaveBeenCalledWith("1");
      expect(res.send).toHaveBeenCalledWith({ message: "Product deleted" });
    });
  });

  describe("addReview", () => {
    it("should add a review to a product", async () => {
      const req = {
        params: { id: "1" },
        body: { rating: 5, comment: "Great product!" },
        user: { _id: "user1" },
      };
      const res = { send: jest.fn(), status: jest.fn().mockReturnThis() };
      const mockProduct = {
        reviews: [],
        save: jest.fn().mockResolvedValue(true),
      };
      Product.findById.mockResolvedValue(mockProduct);

      await addReview(req, res);
      expect(Product.findById).toHaveBeenCalledWith("1");
      expect(mockProduct.reviews.length).toBe(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockProduct);
    });
  });
});
