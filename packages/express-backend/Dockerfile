# 1. Use an official Node.js runtime as the base image
FROM node:16

# 2. Set the working directory
WORKDIR /app

# 3. Copy dependency definitions
COPY package*.json ./

# 4. Install dependencies
RUN npm install --production

# 5. Copy the rest of your application's code
COPY . .

# 6. Expose the port your app runs on
EXPOSE 8080

# 7. Define the command to run your app
CMD ["npm", "start"]
