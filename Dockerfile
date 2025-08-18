# Multi-stage build: frontend -> backend runtime
# 1. Frontend build
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json* ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY index.html ./
COPY src ./src
COPY public ./public
RUN npm ci && npm run build

# 2. Backend dependencies
FROM node:20-alpine AS backend_deps
WORKDIR /app
COPY backend/package.json backend/package-lock.json* ./backend/
RUN cd backend && npm ci --only=production

# 3. Runtime image
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
# Copy backend code
COPY backend ./backend
# Copy frontend build into backend/dist so backend can serve it
COPY --from=frontend /app/dist ./dist
# Copy production deps
COPY --from=backend_deps /app/backend/node_modules ./backend/node_modules
EXPOSE 5000
WORKDIR /app/backend
CMD ["node","main.js"]
