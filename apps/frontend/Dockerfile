# Frontend Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
WORKDIR /app/apps/frontend
RUN npm install
CMD ["npm", "run", "dev"]
