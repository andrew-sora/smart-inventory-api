const express = require('express');
const {
  addProduct,
  getAllProducts
} = require('../controllers/productController');

const router = express.Router();

router.post('/', addProduct);
router.get('/', getAllProducts);

module.exports = router;
