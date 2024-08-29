FROM node:lts as builder

WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:lts-slim
ENV NODE_ENV production

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/build ./build

CMD ["node", "build/index.js"]
