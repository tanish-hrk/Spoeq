# Backend-only production Dockerfile (use root Dockerfile for full stack multi-stage)
FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["node","main.js"]
