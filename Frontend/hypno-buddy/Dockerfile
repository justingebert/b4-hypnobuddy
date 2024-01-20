FROM node:latest

WORKDIR /Frontend/hypno-buddy

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run vite-build

EXPOSE 5173

CMD ["npm", "start"]
