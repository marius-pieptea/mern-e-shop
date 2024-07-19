const mongoose = require("mongoose");
const Product = require("./models/Product"); // Adjust the path as necessary

// Sample product data
const products = [
  {
    name: "Product 1",
    price: 29.99,
    description: "Description for product 1",
    image: "image1.jpg",
    stock: 100,
    category: "Category1",
    reviews: [
      {
        user: "60d21b4667d0d8992e610c85", // Example user ID
        rating: 4,
        comment: "Great product!",
      },
    ],
    rating: 4,
    numReviews: 1,
  },
  {
    name: "Product 2",
    price: 49.99,
    description: "Description for product 2",
    image: "image2.jpg",
    stock: 200,
    category: "Category2",
    reviews: [
      {
        user: "60d21b4667d0d8992e610c86", // Example user ID
        rating: 5,
        comment: "Excellent quality!",
      },
    ],
    rating: 5,
    numReviews: 1,
  },
  {
    name: "Product 3",
    price: 19.99,
    description: "Description for product 3",
    image: "image3.jpg",
    stock: 150,
    category: "Category1",
    reviews: [
      {
        user: "60d21b4667d0d8992e610c87", // Example user ID
        rating: 3,
        comment: "Good value for money.",
      },
    ],
    rating: 3,
    numReviews: 1,
  },
];

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/eshop", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Insert sample data
const seedProducts = async () => {
  try {
    await Product.deleteMany(); // Clear existing products
    await Product.insertMany(products); // Insert sample products
    console.log("Sample products inserted successfully!");
    mongoose.connection.close();
  } catch (error) {
    console.error("Error inserting sample products:", error);
    mongoose.connection.close();
  }
};

seedProducts();
