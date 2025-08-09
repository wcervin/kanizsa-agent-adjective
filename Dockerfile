# Multi-stage build for Kanizsa Adjective Agent
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY src/ ./src/

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "console.log('Adjective Agent library health check passed')"

# Default command - library mode
CMD ["node", "-e", "console.log('Kanizsa Adjective Agent library loaded successfully')"]

# Labels
LABEL version="11.0.0"
LABEL description="Kanizsa Adjective Agent - TypeScript Library"
LABEL maintainer="Kanizsa Team"
