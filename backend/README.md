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

### Docker (Prod-ish)
```
docker compose up --build
```

### Next Steps
- Add cart module
- Add order/payment flow
- Add review system
- Implement caching & rate limiting strategies
