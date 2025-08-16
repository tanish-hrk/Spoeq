## SPOEQ Backend

### Prerequisites
- Node 18+ / 20+
- MongoDB (local or via docker-compose)

### Environment
Copy `.env.example` to `.env` and fill secrets:
```
cp .env.example .env
```

### Install & Run (Dev)
```
npm install
npm run dev
```

### Seed Data
Products:
```
npm run seed
```
Admin user:
```
ADMIN_EMAIL=admin@example.com ADMIN_PASSWORD=StrongPass123 npm run seed:admin
```

### API Routes (Initial)
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET /products
- POST /products (admin)
- GET /products/:id
- PATCH /products/:id (admin)
- DELETE /products/:id (admin)
- GET /cart
- POST /cart
- PATCH /cart/:productId
- DELETE /cart/:productId
- POST /cart/apply-coupon
- POST /orders (create draft from cart)
- GET /orders
- GET /orders/:id
- POST /orders/:id/create-payment-intent (create Razorpay order)
- POST /orders/verify (verify signature & capture)
- GET /reviews/product/:productId
- POST /reviews (requires purchase)
- PATCH /reviews/:id/status (admin)
- GET /auth/me
- POST /auth/me/addresses
- PATCH /auth/me/addresses/:idx
- DELETE /auth/me/addresses/:idx

### Docker (Prod-ish)
```
docker compose up --build
```

### Next Steps
- Add cart module
- Add order/payment flow
- Add review system
- Implement caching & rate limiting strategies
