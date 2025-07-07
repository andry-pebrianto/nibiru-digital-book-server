FROM node:22.17-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run compile
EXPOSE 3002
