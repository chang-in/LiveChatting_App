# Build stage
FROM node:lts as builder
RUN apt-get update
# 작업영역을 선택한다. mkdir, cd를 동시에 진행한다 생각하면 된다.
WORKDIR /code
# 애플리케이션의 소스를 복사한다.
COPY . /code
# 의존성 패키지 설치
RUN yarn install
RUN /bin/sh -c yarn build

# Serve stage
FROM nginx:1.25.1-alpine3.17-slim
# nginx의 기본 설정을 제거한다.
RUN rm -rf /etc/nginx/sites-enabled/default
RUN rm -rf /etc/nginx/sites-available/default
RUN rm -rf /etc/nginx/conf.d/default.conf

# nginx에 serving할 html의 설정파일을 복사한다.
COPY nginx.conf /etc/nginx/conf.d

WORKDIR /code/build/
# 빌드 결과물을 Nginx가 제공할 위치로 복사한다.
COPY --from=builder /code/build/ .
# frontend Port를 설정한다.
EXPOSE 3000
# container가 종료될 때 정상종료를 유도한다.
STOPSIGNAL SIGTERM
# nginx를 global 설정
# Docker에서는 nginx가 daemon으로 실행되지 않도록 한다.
# daemon으로 실행하지 않으면 container가 바로 종료된다.
CMD ["nginx", "-g", "daemon off;"]