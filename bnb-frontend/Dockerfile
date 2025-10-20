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

# Build the Next.js application
RUN npm run build

# The frontend server will run on port 8080
EXPOSE 8080

# Command to run the application
CMD [ "npm", "run", "start" ]
