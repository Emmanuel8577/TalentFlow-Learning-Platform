# Use the official Node.js Alpine image for a small footprint
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies by copying package.json AND package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Bundle app source
COPY . .

# Your app binds to port 5000 (as defined in your .env)
EXPOSE 5000

# Command to run the app
CMD [ "npm", "start" ]