# Multi-stage build for Backend
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/frontend/package*.json ./packages/frontend/

# Install dependencies
RUN npm ci

# Generate Prisma Client
FROM deps AS prisma
WORKDIR /app/packages/backend
COPY packages/backend/prisma ./prisma
RUN npx prisma generate

# Build application
FROM prisma AS builder
WORKDIR /app/packages/backend
COPY packages/backend/tsconfig.json ./
COPY packages/backend/src ./src
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy built application
COPY --from=builder /app/packages/backend/dist ./dist
COPY --from=builder /app/packages/backend/package*.json ./
COPY --from=builder /app/packages/backend/node_modules ./node_modules
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Expose port
EXPOSE 4000

# Start application
CMD ["node", "dist/index.js"]





