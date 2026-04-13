const db = require('../config/db');

exports.createSale = async (req, res) => {
  let connection;

  try {
    const { product_id, quantity } = req.body;

    if (!product_id || !quantity) {
      return res.status(400).json({
        success: false,
        message: 'product_id and quantity are required'
      });
    }

    if (Number(quantity) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be greater than 0'
      });
    }

    connection = await db.getConnection();
    await connection.beginTransaction();

    const [products] = await connection.execute(
      'SELECT id, name, stock, price FROM products WHERE id = ? FOR UPDATE',
      [product_id]
    );

    if (products.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const product = products[0];

    if (product.stock < Number(quantity)) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock',
        available_stock: product.stock
      });
    }

    const total = product.price * Number(quantity);
    const updatedStock = product.stock - Number(quantity);

    await connection.execute(
      'UPDATE products SET stock = ? WHERE id = ?',
      [updatedStock, product_id]
    );

    const [saleResult] = await connection.execute(
      'INSERT INTO sales (product_id, quantity, total) VALUES (?, ?, ?)',
      [product_id, quantity, total]
    );

    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Sale created successfully',
      data: {
        sale_id: saleResult.insertId,
        product_id: product.id,
        product_name: product.name,
        quantity: Number(quantity),
        total,
        remaining_stock: updatedStock
      }
    });
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }

    console.error('Create sale error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create sale'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

exports.getTopSellingProducts = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        p.id,
        p.name,
        SUM(s.quantity) AS total_quantity_sold,
        SUM(s.total) AS total_revenue
      FROM sales s
      INNER JOIN products p ON s.product_id = p.id
      GROUP BY p.id, p.name
      ORDER BY total_quantity_sold DESC
      LIMIT 5
    `);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Top selling products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top selling products'
    });
  }
};

exports.getDailyRevenue = async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        DATE(created_at) AS sale_date,
        SUM(total) AS daily_revenue,
        COUNT(*) AS total_transactions
      FROM sales
      GROUP BY DATE(created_at)
      ORDER BY sale_date DESC
    `);

    res.status(200).json({
      success: true,
      data: rows
    });
  } catch (error) {
    console.error('Daily revenue error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily revenue'
    });
  }
};

exports.getLowStockProducts = async (req, res) => {
  try {
    const threshold = Number(req.query.threshold) || 10;

    const [rows] = await db.execute(
      'SELECT id, name, stock, price FROM products WHERE stock <= ? ORDER BY stock ASC',
      [threshold]
    );

    res.status(200).json({
      success: true,
      threshold,
      data: rows
    });
  } catch (error) {
    console.error('Low stock alert error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch low stock products'
    });
  }
};
