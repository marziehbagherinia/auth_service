# Dockerfile
FROM node:20-alpine

# (Optional) Keep Alpine packages up-to-date
RUN apk update && apk upgrade

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json/package-lock.json first for better build caching
COPY package*.json ./

# Install Node.js dependencies using legacy-peer-deps to bypass peer dependency conflicts
RUN npm install --legacy-peer-deps

# Copy your source code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the application
CMD [ "node", "app.js" ]
