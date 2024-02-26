# Build stage
FROM node:lts as builder
WORKDIR /code
COPY package.json yarn.lock ./src /code/
RUN apt-get update && yarn install && yarn build

FROM nginx:1.25.1-alpine3.17-slim

# nginx의 기본 설정을 제거한다.
RUN rm -rf /etc/nginx/sites-enabled/default
RUN rm -rf /etc/nginx/sites-available/default
RUN rm -rf /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

EXPOSE 3000
STOPSIGNAL SIGTERM
# nginx를 global 설정
# Docker에서는 nginx가 daemon으로 실행되지 않도록 한다.
# daemon으로 실행하지 않으면 container가 바로 종료된다.
CMD ["nginx", "-g", "daemon off;"]
