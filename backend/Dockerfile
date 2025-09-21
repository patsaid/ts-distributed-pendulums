# Use Node 24
FROM node:24-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Command to run in dev
CMD ["npx", "tsx", "src/index.ts"]