FROM node:lts-slim
ENV NODE_ENV=production

WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY build ./build

CMD ["node", "build/index.js"]
