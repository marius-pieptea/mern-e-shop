const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');

const setupSwagger = require('./swagger');
const setupInMemoryDB = require('./setupInMemoryDb'); // Adjust the path as necessary

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

setupSwagger(app);

// Routes 
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);


const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(
      "Failed to connect to MongoDB, setting up in-memory MongoDB",
      error
    );
    await setupInMemoryDB();
  }
};

connectDB();

app.get('/', (req, res) => {
    res.send('API is running...');    
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));