FROM node:lts-alpine as builder

WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN apk add --no-cache gcc musl-dev rust cargo openssl-dev
RUN npm ci && npm run build

FROM node:lts-alpine
ENV NODE_ENV production

WORKDIR /app
COPY package*.json ./
COPY --from=builder /usr/src/app/modules ./modules
COPY modules/ha-redis/package.docker.json ./modules/ha-redis/package.json
COPY modules/epsi-edt/package.docker.json ./modules/epsi-edt/package.json
RUN npm ci --omit=dev --ignore-scripts
COPY --from=builder /usr/src/app/dist ./dist
WORKDIR /app/dist

CMD ["node", "."]
