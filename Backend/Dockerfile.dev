FROM node:alpine

WORKDIR /Backend

COPY package*.json ./
COPY . .

RUN npm install && \
    npm run build && \
    npm prune --production

ENV NODE_ENV=production
ENV MONGO_URL="mongodb://mongo:27017/hypnobuddy"

EXPOSE 3000

CMD ["npm", "start"]
