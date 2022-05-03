FROM node:latest

WORKDIR /app
VOLUME [ "/app" ]
COPY package.json .
RUN yarn
COPY . .