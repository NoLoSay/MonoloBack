FROM node:18.16-bullseye AS builder

WORKDIR /app

COPY ./package.json ./
RUN npm install

COPY . .
# COPY ./prisma ./prisma
RUN npm run prisma:generate
RUN npm install --global nx@latest

# Stage 2: Create the final image
FROM node:18.16-bullseye

WORKDIR /app

COPY --from=builder /app .

CMD ["npx", "nx", "run", "api:serve:production", "--skip-nx-cache"]
