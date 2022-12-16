FROM node:19.2.0

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --production

COPY . .
