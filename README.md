# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

# SPOEQ

Sports equipment storefront built with React + Vite (frontend) and Express (backend).

## Run Dev

1. Backend
```
cd backend
npm install
npm start
```
2. Frontend (new terminal)
```
npm install
npm run dev
```

Backend runs on :5000, frontend on :3000. API base URL configurable via `.env` key `VITE_API_BASE`.

## Build Frontend
```
npm run build
```
Then serve `dist/` from backend (already configured in `backend/main.js`).

## Environment
Create `.env` at project root:
```
VITE_API_BASE=http://localhost:5000
```

## Lint
```
npm run lint
```

## Notes
- Tailwind configured; currently Bootstrap handles most styling.
- Product data is mock; extend `backend/src/api/product.js` for real data.
