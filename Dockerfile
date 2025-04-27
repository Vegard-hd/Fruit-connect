# Dockerfile for Bun app
FROM oven/bun:1.2.10-alpine

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json first for better caching
COPY package*.json ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# build the script and CSS files
RUN bun run build.js

# Expose the port the app runs on
EXPOSE 3007

# Command to run the app
CMD ["bun", "run", "app"]

