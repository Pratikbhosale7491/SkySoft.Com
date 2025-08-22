# -----------------------------
# Stage 1: Build Express backend + static frontend
# -----------------------------
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json & package-lock.json first
COPY package*.json ./

# Install all dependencies (including pg for DB connection)
RUN npm install --production

# Copy source code
COPY . .

# Expose application port
EXPOSE 80

# Set environment variable for Node.js port
ENV PORT=80

# Start the server
CMD ["node", "server.js"]
