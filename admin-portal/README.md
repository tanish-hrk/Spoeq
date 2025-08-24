# Spoeq Admin Portal

A lightweight, separate admin app for Spoeq. Built with React 18, Vite, Tailwind, React Router, React Query, framer-motion.

## Dev
- Install: npm install
- Run: npm run dev (opens on http://localhost:5175)
- Configure API: copy `.env.example` to `.env.local` and set `VITE_API_BASE` to your backend like `http://localhost:3000/api`.

## Structure
- src/shell/Root.jsx — header + sidebar + routed content with framer-motion transitions
- src/screens/* — Dashboard, Products, Orders, Login
- src/utils/api.js — Axios instance with bearer token from localStorage `adm-token`

## Notes
- Tailwind uses class-based dark mode; theme toggle is persisted in localStorage (`adm-dark`).
- Auth is a simple bearer token placeholder. Hook into your backend admin login and issue role-bearing JWTs.
