# Build stage — compile React/Vite frontend
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --include=dev
COPY . .
RUN npm run build

# Production stage — Express backend serves built frontend
FROM node:18-alpine
WORKDIR /app

# Security: run as non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S naagrik -u 1001

COPY package*.json ./
RUN npm ci --omit=dev

# Copy backend files
COPY server.js ./
COPY data/ ./data/
COPY services/ ./services/
COPY middleware/ ./middleware/
COPY routes/ ./routes/

# Copy built frontend
COPY --from=build /app/dist ./dist

USER naagrik

ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

CMD ["node", "server.js"]
