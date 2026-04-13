# Smart Inventory API

Production-like backend API for inventory management and sales analytics using Node.js, Express, MySQL, `mysql2`, and `dotenv`.

## Features

- Add product
- Get all products
- Create sale with stock validation
- Auto-reduce stock after successful sale
- Top selling products analytics
- Daily revenue analytics
- Low stock alert analytics

## Project Structure

```text
smart-inventory-api/
│── config/
│   └── db.js
│── controllers/
│   ├── productController.js
│   └── salesController.js
│── routes/
│   ├── productRoutes.js
│   └── salesRoutes.js
│── .env.example
│── app.js
│── package.json
│── README.md
│── schema.sql
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment file:

```bash
copy .env.example .env
```

3. Update `.env` with your MySQL credentials.

4. Create the database and tables:

```bash
mysql -u root -p < schema.sql
```

5. Start the server:

```bash
node app.js
```

## API Endpoints

### Products

- `POST /api/products`
- `GET /api/products`

### Sales

- `POST /api/sales`

### Analytics

- `GET /api/sales/analytics/top-products`
- `GET /api/sales/analytics/daily-revenue`
- `GET /api/sales/analytics/low-stock?threshold=10`

## Example Request Bodies

### Add Product

```json
{
  "name": "Wireless Mouse",
  "stock": 50,
  "price": 25.99
}
```

### Create Sale

```json
{
  "product_id": 1,
  "quantity": 3
}
```

## Suggested Improvements

- Add request validation middleware with `express-validator` or `joi`
- Add authentication and role-based access control
- Add pagination and filtering for product listing
- Add unit and integration tests
- Add Swagger or OpenAPI documentation
- Add structured logging with a logger like `pino`
- Add database migration tooling
- Add rate limiting and security middleware like `helmet`
- Add caching for analytics endpoints

## Performance and Indexing Notes

- Indexes are included on `products.stock`, `products.name`, `sales.product_id`, and `sales.created_at`
- Use connection pooling for better concurrent request handling
- Transaction locking with `FOR UPDATE` prevents stock inconsistency during concurrent sales

## AI Usage Section

This project was generated with AI assistance to accelerate scaffolding, controller separation, route setup, SQL design, and documentation. All generated code should still be reviewed, tested, and adapted to your environment before production deployment. AI helped speed up the initial implementation, but engineering validation remains essential for security, performance, and maintainability.
