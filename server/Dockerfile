FROM node:20-alpine

WORKDIR /app

# Copy server package.json and install dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install

# Copy the rest of the application (both server and client)
WORKDIR /app
COPY server ./server
COPY client ./client

WORKDIR /app/server
EXPOSE 3000

CMD ["npm", "start"]
