# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the shared library first
RUN npm run build common

# Build the specific service (passed via build arg)
ARG SERVICE_NAME
RUN npx nest build ${SERVICE_NAME}

# --- Production Stage ---
FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

# Copy built assets from builder
ARG SERVICE_NAME
COPY --from=builder /usr/src/app/dist/apps/${SERVICE_NAME} ./dist
COPY --from=builder /usr/src/app/dist/libs ./dist/libs

# Environment variables will be provided via docker-compose
CMD ["node", "dist/main"]
