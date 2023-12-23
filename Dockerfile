FROM node:lts as builder

WORKDIR /usr/src/app
COPY package*.json ./
COPY . .
RUN npm ci && npm run build

FROM node:lts-slim
ENV NODE_ENV production

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /usr/src/app/dist ./dist

CMD ["node", "dist/index.js"]
