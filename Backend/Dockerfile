FROM node:slim

WORKDIR /Backend

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start", "--host", "0.0.0.0"]