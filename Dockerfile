FROM node:22.17-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run compile
EXPOSE 3002
