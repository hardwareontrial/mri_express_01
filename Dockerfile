FROM node:20.19.3-alpine

WORKDIR /usr/app

COPY ./package.json ./

RUN npm install

COPY ./ ./

RUN npm run build

EXPOSE 4000

CMD [ "node", "dist/main.js" ]