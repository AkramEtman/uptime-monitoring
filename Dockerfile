FROM node:14-alpine

WORKDIR /uptime

COPY package*.json  /uptime/

RUN  npm install

EXPOSE 3000

COPY . .

RUN npm build

CMD ["npm", "start"]