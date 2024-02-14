FROM node:18.16-bullseye AS builder

WORKDIR /app

COPY ./package.json ./
RUN npm install
RUN npm install --global nx@latest

COPY . .
# COPY ./prisma ./prisma
RUN npm run prisma:generate
RUN npx nx run video:build:production --skip-nx-cache

# Stage 2: Create the final image
FROM node:18.16-bullseye

WORKDIR /app

COPY --from=builder /app .

CMD ["node", "dist/apps/video/main.js"]
