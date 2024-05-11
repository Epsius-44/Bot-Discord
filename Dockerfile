FROM node:lts-alpine as builder

WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN apk add --no-cache gcc musl-dev rust cargo openssl-dev
RUN npm ci && npm run build

FROM node:lts-alpine
ENV NODE_ENV production

WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=builder /usr/src/app/modules ./modules
COPY modules/ha-redis/package.docker.json ./modules/ha-redis/package.json
RUN npm ci --omit=dev
COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/index.js"]
