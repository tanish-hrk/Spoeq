<div align="center">
<h1>SPOEQ</h1>
<p><strong>Modern sports & fitness commerce platform</strong><br/>React 18 + Vite + Tailwind (frontend) • Node.js / Express / MongoDB (backend) • Razorpay Payments • JWT Auth • Caching • Admin Console</p>
<img src="public/vite.svg" width="60" alt="logo"/>
</div>

---

## ✨ Key Features
Frontend
- React 18 + Vite + Tailwind custom neon / glassmorphism design system
- React Query data layer + Zustand lightweight state (auth / cart / wishlist)
- Product listing with full‑text search, debounced suggestions, category & brand facets, price filters, sorting
- Product detail with reviews & wishlist toggle
- Cart with coupon application & dynamic pricing breakdown
- Secure checkout with live Razorpay integration & post‑payment verification
- Order lifecycle timeline (pending → paid → processing → shipped → delivered)
- Wishlist (batched fetch endpoint to avoid N+1)
- Account dashboard with address management
- Global toast notifications, skeleton loading states

Backend
- Modular Express API: auth, catalog, cart, orders, reviews, coupons
- MongoDB + Mongoose schemas with indexing (text search, status, userId)
- JWT access + rotating hashed refresh tokens (allowlist)
- Coupons with validation (time window, min subtotal, usage limits)
- Razorpay intent creation + signature verification & transactional inventory decrement
- Order lifecycle transitions + admin advance/refund endpoints
- Review system with rating aggregation & cache invalidation
- Redis (optional) or in‑memory caching abstraction: product list/detail keyed caching + invalidation
- Rate limiting (global + auth specific)
- Audit log sampling & request metrics endpoint
- Admin dashboard: order management, product creation

DevOps / Ops (base)
- Health endpoint `/health`
- Metrics endpoint `/metrics` (requests, memory, uptime)
- Production static serving (frontend build) from backend
- Sampling audit collection (20%) for traceability

---

## 📁 Project Structure
```
root
├─ backend/
│  ├─ main.js                # Express bootstrap & middleware
│  ├─ docker-compose.yml
│  ├─ src/
│  │  ├─ modules/            # Feature modules
│  │  │  ├─ auth/            # Auth + addresses + wishlist
│  │  │  ├─ catalog/         # Products & facets
│  │  │  ├─ cart/
│  │  │  ├─ order/
│  │  │  ├─ review/
│  │  │  ├─ coupon/
│  │  ├─ middleware/
│  │  ├─ utils/              # cache, logger, notify
│  │  ├─ tests/              # Jest + Supertest flows
├─ src/ (frontend)
│  ├─ lib/                   # api client, stores, loader
│  ├─ components/            # UI + layout
│  ├─ pages/                 # Route pages (shop, auth, cart, admin...)
│  ├─ assets/                # Media
│  ├─ App.jsx / main.jsx
└─ public/
```

---

## ⚙️ Environment Variables
Create `.env` in project root (frontend reads `VITE_*`). Backend may also read its own `.env` inside `backend/`.

Minimum local example:
```
MONGO_URI=mongodb://localhost:27017/spoeq
JWT_ACCESS_SECRET=dev_access_secret_change
JWT_REFRESH_SECRET=dev_refresh_secret_change
RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxxxxxxxxx
VITE_API_BASE=http://localhost:5000
CORS_ORIGIN=http://localhost:3000
```

Optional:
```
REDIS_URL=redis://localhost:6379
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL=7d
LOG_LEVEL=info
```

---

## 🚀 Development
Backend (terminal 1):
```powershell
cd backend
npm install
npm start
```
Frontend (terminal 2):
```powershell
npm install
npm run dev
```
Frontend default: http://localhost:3000  
Backend API: http://localhost:5000

### Seeding (admin + sample products)
```powershell
cd backend
node src/scripts/seedAdmin.js
node src/scripts/seedProducts.js
```

### Lint
```powershell
npm run lint
```

---

## 🧪 Testing (Backend)
Jest + Supertest scenario tests live under `backend/src/tests/*`.
Run (from `backend/`):
```powershell
npm test
```
Uses `mongodb-memory-server` for isolated runs.

---

## 🔐 Security Highlights
- Short‑lived access tokens (default 15m) + rotating hashed refresh tokens (allowlist window capped length)
- Rate limits (global + auth endpoints)
- Helmet headers + compression
- Coupon validation & constrained order transitions
- Signature verification for Razorpay payments
- Wishlist & address changes bound to authenticated user
- Audit sampling (20%) with path + status + user id (if available)

Planned (Phase 5+): CSP tightening, refresh reuse detection, password reset flow, admin activity log viewer.

---

## 🧩 API Overview (Selected)
Auth
```
POST /auth/register        { email, password, name }
POST /auth/login           { email, password }
POST /auth/refresh         { refreshToken }
POST /auth/logout          { refreshToken }
GET  /auth/me
POST /auth/me/addresses
PATCH/DELETE /auth/me/addresses/:idx
GET  /auth/me/wishlist
GET  /auth/me/wishlist/populated
```
Products & Search
```
GET /products?search=&category=&brand=&minPrice=&maxPrice=&sort=&page=&limit=
GET /products/facets/all (faceted meta)
GET /products/suggest?q=term
GET /products/:id
POST /products (admin)
PATCH /products/:id (admin)
DELETE /products/:id (admin)
```
Cart / Orders
```
POST /orders                 # create draft from cart
GET  /orders                 # user orders
GET  /orders/:id
POST /orders/:id/create-payment-intent
POST /orders/verify          # signature verification
POST /orders/:id/cancel
POST /orders/:id/advance     (admin)
POST /orders/:id/refund      (admin)
GET  /orders/admin/all       (admin aggregate list)
```
Reviews / Coupons
```
POST /reviews                # create review
GET  /reviews?productId=
POST /coupons/apply (cart)   # used indirectly within cart/order flows
```
System
```
GET /health
GET /metrics
```

---

## 🏗 Architecture Notes
- Feature modules keep model + route logic co‑located.
- Caching layer (`utils/cache`) abstracts Redis vs in‑memory; keys are namespaced.
- Text search leverages MongoDB `$text` index (name + description) for quick suggestions.
- Order verification wraps inventory decrement in a transaction (with fallback for non‑replica set dev environments).
- Facet endpoint uses aggregation pipeline with `$facet` and bucket boundaries for quick filter meta.

---

## 🖥 Admin Console
- `/admin` dashboard: view orders, status counts, advance or refund orders.
- `/admin/products`: create products and browse existing.
Access restricted to users containing `admin` in `roles` array.

---

## 🛠 Tech Stack
| Layer       | Tech |
|-------------|------|
| Frontend    | React 18, Vite, Tailwind, React Router v7, React Query, Zustand |
| Backend     | Node.js, Express, Mongoose |
| Auth        | JWT (access + rotating hashed refresh) |
| Caching     | Redis (optional) / In‑memory fallback |
| Payments    | Razorpay Orders API |
| Testing     | Jest + Supertest + mongodb-memory-server |
| Logging     | Winston JSON + sampled audit collection |

---

## 📦 Building for Production
1. Build frontend:
```powershell
npm run build
```
2. Start backend (serves `dist/` automatically):
```powershell
cd backend
npm start
```
3. Access app via backend host/port.

Suggested (Phase 5): Multi‑stage Dockerfile (builder for frontend, slim runtime for API + static). CI: build + test + push image.

---

## ⚡ Performance Considerations
- Query result caching (products list/detail) w/ invalidation on mutation & review moderation.
- Debounced search suggestions (250ms).
- Pagination & server‑side filtering reduce overfetch.
- Compression + small asset footprint (Vite build tree shaking).

Future: CDN for images, HTTP caching headers, Redis cluster, background pre‑warm tasks.

---

## 🧭 Roadmap (Phase Timeline)
Status legend: ✅ completed • 🚧 in progress • 🗓 planned

| Phase | Status | Focus |
|-------|--------|-------|
| 0 | ✅ | Backend foundation: Auth (JWT), products catalog, cart, basic orders, logging, error handling, seeding, Docker scaffold. |
| 1 | ✅ | Payments & commerce depth: Razorpay intent + verification, coupons, reviews w/ moderation hooks, inventory decrement, extended order model. |
| 2 | ✅ | Performance & hardening: Redis/in-memory cache abstraction, product + review cache invalidation, rate limiting, notification emitter stub, E2E Jest flows, refresh token rotation groundwork. |
| 3 | ✅ | Frontend modernization: Gen‑Z UI (Tailwind neon/glass), React Query, Zustand stores, product list/detail, cart & checkout scaffold, wishlist, reviews UI, coupons, filters, skeleton loaders, toasts, unified buttons. |
| 4 | ✅ | Advanced UX & Admin: Faceted search, suggestions, wishlist batching, account addresses, order timeline & cancel, admin dashboard (orders + actions), product create, hashed refresh tokens, audit sampling, metrics. |
| 5 | 🗓 | Deployment & Ops: Multi‑stage Docker images, CI/CD workflow, Prometheus-style metrics, readiness probe, graceful shutdown, CSP tightening, log aggregation, env hardening. |
| 6 | 🗓 | Intelligence & Engagement: Recommendation engine (collaborative + trending), analytics dashboards (sales funnel, cohort retention), email/push notification service, refund webhook handling, customer segmentation. |
| 7 | 🗓 | Scale & Expansion: Multi-tenant / marketplace (seller onboarding), internationalization (i18n), multi-currency & tax rules, image CDN + media optimization, role-based granular permissions, SaaS billing if needed. |

Future Candidates: Headless API mode, GraphQL gateway, event sourcing for orders, real-time inventory via WebSockets, AI-assisted sizing or product Q&A.

---

Happy shipping! 🏎️
