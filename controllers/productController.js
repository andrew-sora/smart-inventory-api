const db = require('../config/db');

exports.addProduct = async (req, res) => {
  try {
    const { name, stock, price } = req.body;

    if (!name || stock === undefined || price === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name, stock, and price are required'
      });
    }

    if (Number(stock) < 0 || Number(price) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Stock and price must be zero or greater'
      });
    }

    const [result] = await db.execute(
      'INSERT INTO products (name, stock, price) VALUES (?, ?, ?)',
      [name, stock, price]
    );

    res.status(201).json({
      success: true,
      message: 'Product added successfully',
      data: {
        id: result.insertId,
        name,
        stock: Number(stock),
        price: Number(price)
      }
    });
  } catch (error) {
    console.error('Add product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add product'
    });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const [products] = await db.execute(
      'SELECT id, name, stock, price FROM products ORDER BY id DESC'
    );

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch products'
    });
  }
};
