FROM node:lts as builder

RUN apt-get update && yarn install && yarn build

FROM nginx:1.25.1-alpine3.17-slim

RUN rm -rf /etc/nginx/sites-enabled/default
RUN rm -rf /etc/nginx/sites-available/default
RUN rm -rf /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

COPY package.json yarn.lock ./src /code

WORKDIR /code/build

CMD ["nginx"]
