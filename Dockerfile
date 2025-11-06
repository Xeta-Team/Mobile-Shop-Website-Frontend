# --- Stage 1: Build the React App ---
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy all source code
COPY . .

# Build the application (this creates a 'dist' folder)
RUN npm run build

# --- Stage 2: Serve the Static Files ---
FROM nginx:1.25-alpine

# Copy the built files from the 'builder' stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Tell Docker that the container listens on port 80
EXPOSE 80

# Command to start Nginx
CMD [ "nginx", "-g", "daemon off;" ]