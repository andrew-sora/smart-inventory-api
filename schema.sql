CREATE DATABASE IF NOT EXISTS smart_inventory;
USE smart_inventory;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  stock INT NOT NULL DEFAULT 0,
  price DECIMAL(10, 2) NOT NULL,
  INDEX idx_product_name (name),
  INDEX idx_product_stock (stock)
);

CREATE TABLE IF NOT EXISTS sales (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_sales_product
    FOREIGN KEY (product_id) REFERENCES products(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  INDEX idx_sales_product_id (product_id),
  INDEX idx_sales_created_at (created_at)
);
