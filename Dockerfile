# Use Node 20 for better stability
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
# Use install instead of ci to handle minor dependency shifts
RUN npm install
COPY . .
RUN npm run build

FROM node:20-slim
WORKDIR /app

# Install wget for healthcheck
RUN apt-get update && apt-get install -y wget && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm install --omit=dev

# Copy backend and supporting files
COPY server.js ./
COPY config/ ./config/
COPY constants/ ./constants/
COPY services/ ./services/
COPY middleware/ ./middleware/
COPY routes/ ./routes/
COPY utils/ ./utils/
COPY assets/ ./assets/

# Copy built frontend from build stage
COPY --from=build /app/dist ./dist

ENV PORT=8080
ENV NODE_ENV=production
EXPOSE 8080

# Non-root user for security
USER node

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

CMD ["node", "server.js"]
