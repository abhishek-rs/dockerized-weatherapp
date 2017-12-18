FROM node:latest

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD . /usr/src/app/
RUN npm install

EXPOSE 8000

CMD [ "npm", "run", "start" ]
