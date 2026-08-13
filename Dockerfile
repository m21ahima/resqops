FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production
COPY . .

EXPOSE 3000

# Docker will run this command periodically INSIDE the container
# to decide if the app is healthy. If it fails repeatedly, the
# container is marked "unhealthy".
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "index.js"]