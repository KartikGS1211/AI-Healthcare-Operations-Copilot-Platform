# Base Image
FROM node:20-alpine

# Working Directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Dependencies
RUN npm install

# Copy Project
COPY . .

# Build Next.js
RUN npm run build

# Expose Port
EXPOSE 3000

# Start Application
CMD ["npm", "run", "start"]