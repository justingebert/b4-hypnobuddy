FROM node:16-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Create a smaller image for the runtime environment
FROM node:16-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --only=production

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 8080

CMD ["node", "dist/server.js"]
