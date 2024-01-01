# Stage 1: Build the application dependencies
FROM node:18.16-bullseye AS dependencies

WORKDIR /app

COPY ./package.json ./
RUN npm install

# Stage 2: Copy application files
FROM dependencies AS app

WORKDIR /app

COPY ./. .
# COPY ./prisma ./prisma

# Stage 3: Final image with runtime configuration
FROM node:18.16-bullseye

WORKDIR /app

COPY --from=app /app .

CMD ["npx", "prisma", "migrate", "deploy", "--schema", "libs/prisma/schema/base/prisma/schema.prisma"]
