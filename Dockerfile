FROM node:10

ARG NODE_ENV=production
RUN mkdir -p /usr/app
WORKDIR /usr/app

COPY package.json /usr/app/
RUN npm install

COPY . /usr/app
RUN npm run build

COPY . .
EXPOSE 3005

CMD ["npm", "start"]
