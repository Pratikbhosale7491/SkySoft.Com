# -----------------------------
# Stage 1: Build static files (if using bundlers later, e.g., React/Next)
# For now, we just use Node.js to serve Express backend + static frontend
# -----------------------------
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json & package-lock.json first (for better caching)
COPY package*.json ./

# Install dependencies
RUN npm install --only=production

# Copy source code (server.js, public, assets, etc.)
COPY . .

# Expose application port
EXPOSE 3000

# Start Node.js server
CMD ["node", "server.js"]
