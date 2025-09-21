FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# In dev mode, we mount source code via docker-compose volumes
