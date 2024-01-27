FROM node:alpine

WORKDIR /Backend

COPY package*.json ./
COPY . .

RUN npm install && \
    npm run build && \
    npm prune --production

EXPOSE 3000

CMD ["npm", "start"]
