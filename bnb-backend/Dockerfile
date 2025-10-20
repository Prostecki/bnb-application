# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

# Run tests
RUN npm test

# Build the TypeScript code
RUN npm run build

# The backend server runs on port 3000
EXPOSE 3000

# Command to run the application
CMD [ "npm", "run", "start" ]
