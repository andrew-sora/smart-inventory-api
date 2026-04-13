const express = require('express');
const dotenv = require('dotenv');

const productRoutes = require('./routes/productRoutes');
const salesRoutes = require('./routes/salesRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Smart Inventory API is running',
    endpoints: {
      products: '/api/products',
      sales: '/api/sales',
      analytics: '/api/sales/analytics'
    }
  });
});

app.use('/api/products', productRoutes);
app.use('/api/sales', salesRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
