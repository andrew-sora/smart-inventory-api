const express = require('express');
const {
  createSale,
  getTopSellingProducts,
  getDailyRevenue,
  getLowStockProducts
} = require('../controllers/salesController');

const router = express.Router();

router.post('/', createSale);
router.get('/analytics/top-products', getTopSellingProducts);
router.get('/analytics/daily-revenue', getDailyRevenue);
router.get('/analytics/low-stock', getLowStockProducts);

module.exports = router;
