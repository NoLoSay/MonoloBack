# Stage 1: Build the application
FROM node:18.16-bullseye AS builder

WORKDIR /app

COPY package.json ./
RUN yarn install

FROM builder as ApiBuilder
COPY apps/api .
RUN nx run api:serve

FROM builder as VideoBuilder
COPY apps/video .
RUN nx run video:serve
