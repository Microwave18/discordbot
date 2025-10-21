# Backend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
WORKDIR /app/apps/backend
RUN npm install
CMD ["npm", "run", "dev"]
