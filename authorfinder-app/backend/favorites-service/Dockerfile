# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Compile the TypeScript code
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine AS production

# Set the working directory for the production container
WORKDIR /app

# Copy only necessary files from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# Expose the port the app runs on
EXPOSE 3001

# Start the application
CMD ["node", "dist/main"]
