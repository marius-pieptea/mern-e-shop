const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");
const Order = require("./models/Order");
const bcrypt = require("bcryptjs");

const defaultProducts = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Lenovo 15.6 Inch Full HD Notebook",
    price: 10.99,
    description:
      " Intel Quad N5100 4 x 2.80 GHz, 16GB DDR4, 1000 GB SSD, Intel UHD, HDMI, Webcam, Bluetooth, USB 3.0, WiFi, Windows 11 Prof. 64 Bit - 7323",
    image: "https://f.media-amazon.com/images/I/41YQS3VySQL._AC_SX355_.jpg",
    stock: 100,
    reviews: [],
    category: "Laptops",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Gaming PC ",
    price: 20.99,
    description:
      "22 Inch Set Complete - Quad Core AMD Ryzen 3200G 4GHz - Radeon Vega 8-8GB RAM - 480GB SSD ",
    image:
      "https://f.media-amazon.com/images/I/81wHrTotfzL._AC_UY327_FMwebp_QL65_.jpg",
    stock: 200,
    reviews: [],
    category: "Desktops",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Dell XPS 16 9640 Laptop 16.3 Inch OLED UHD+ Touch Display, Intel Evo Edition",
    price: 30.99,
    description:
      " Intel Core Ultra 9, NVIDIA GeForce RTX 4070 Graphics, 32GB RAM, 1TB, Windows 11 Home, Fingerprint Reader, German Keyboard",
    image:
      "https://f.media-amazon.com/images/I/81NGddxS2BL._AC_UY327_FMwebp_QL65_.jpg",
    stock: 300,
    reviews: [],
    category: "Laptops",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Apple iPhone 15 (128GB) - Black",
    price: 40.99,
    description: `About this item
DYNAMIC ISLAND COMES ON THE IPHONE 15 – Dynamic Island brings clues and live activities forward – so you don't miss anything when you're doing something else. See who's calling, whether your flight is on time, and more.
Innovative design - The iPhone 15 has a robust design made of dyed glass and aluminium. It is protected from water and dust. The ceramic shield front is harder than any smartphone glass. And the 6.1 inch Super Retina XDR display is up to 2x brighter in the sun than that of the iPhone 14.
48 MP main camera with 2 x telephoto zoom - The 48 MP main camera records in super high resolution. This makes it even easier to take incredible pictures with fantastic details. And with the 2x optical tele zoom you can achieve the perfect close-up shot.
Next generation portraits – Capture portraits with significantly more detail and colours. Just tap to shift focus from one subject to another, even after shooting.
With the power of the A16 Bionic Chip - The super-fast chip delivers the power for advanced features such as computation-based photography, smooth transitions in Dynamic Island and voice isolation during phone calls. And the A16 Bionic is incredibly efficient so you have battery for the whole day.
USB C connectivity - With the USB C port, you can charge your Mac or iPad with the same cable as your iPhone 15. With the iPhone 15, you can even charge your Apple Watch and AirPods.
Important safety features - If you need to contact an emergency service, but have no network and no WiFi, you can use emergency call SOS via satellite. 4. With accident detection, the iPhone can detect a serious car accident and call for help if you can't.`,
    image:
      "https://f.media-amazon.com/images/I/61eEYLATF9L._AC_UY327_FMwebp_QL65_.jpg",
    stock: 400,
    reviews: [],
    category: "Phones",
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "High End Gaming PC ",
    price: 50.99,
    description:
      " High End Gaming PC AMD Ryzen 7 4700 16 Threads 4 GHz • AMD Radeon RX 5600 XT 6GB • 16GB • 1000GB SSD • Windows 11",
    image:
      "https://f.media-amazon.com/images/I/61AjHCxX5qL._AC_UY327_FMwebp_QL65_.jpg",
    stock: 500,
    reviews: [],
    category: "Desktops",
  },
];



const defaultUsers = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Admin User",
    email: "admin@example.com",
    password: bcrypt.hashSync("adminpassword", 10), 
    isAdmin: true,
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Normal User",
    email: "user@example.com",
    password: bcrypt.hashSync("userpassword", 10), 
    isAdmin: false,
  },
];


const defaultOrders = [
  {
    user: defaultUsers[1]._id,
    orderItems: [
      {
        name: "Product 1",
        qty: 1,
        price: 10.99,
        product: defaultProducts[0]._id,
      },
    ],
    totalPrice: 10.99,
    isPaid: true,
    status: "Completed",
  },
  {
    user: defaultUsers[1]._id,
    orderItems: [
      {
        name: "Product 2",
        qty: 2,
        price: 20.99,
        product: defaultProducts[1]._id,
      },
    ],
    totalPrice: 41.98,
    isPaid: true,
    status: "Completed",
  },
  {
    user: defaultUsers[1]._id,
    orderItems: [
      {
        name: "Product 3",
        qty: 3,
        price: 30.99,
        product: defaultProducts[2]._id,
      },
    ],
    totalPrice: 92.97,
    isPaid: false,
    status: "Pending",
  },
  {
    user: defaultUsers[1]._id,
    orderItems: [
      {
        name: "Product 4",
        qty: 4,
        price: 40.99,
        product: defaultProducts[3]._id,
      },
    ],
    totalPrice: 163.96,
    isPaid: false,
    status: "Pending",
  },
  {
    user: defaultUsers[1]._id,
    orderItems: [
      {
        name: "Product 5",
        qty: 5,
        price: 50.99,
        product: defaultProducts[4]._id,
      },
    ],
    totalPrice: 254.95,
    isPaid: true,
    status: "Completed",
  },
];

const setupInMemoryDB = async () => {
  const mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, );

  await Product.insertMany(defaultProducts);
  await User.insertMany(defaultUsers);
  await Order.insertMany(defaultOrders);

  console.log("In-memory MongoDB setup complete with default data");
};

module.exports = setupInMemoryDB;