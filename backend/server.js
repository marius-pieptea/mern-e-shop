const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');

const setupSwagger = require('./swagger');

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

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected...'))
.catch((err) => console.error(err));

app.get('/', (req, res) => {
    res.send('API is running...');    
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));