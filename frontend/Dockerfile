FROM node:lts as builder

WORKDIR /code
COPY . .
RUN apt-get update && yarn install && yarn build

FROM nginx:1.25.1-alpine3.17-slim

RUN rm -rf /etc/nginx/sites-enabled/default
RUN rm -rf /etc/nginx/sites-available/default
RUN rm -rf /etc/nginx/conf.d/default.conf

WORKDIR /code/build
COPY --from=builder /code/build .
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 3000
STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]