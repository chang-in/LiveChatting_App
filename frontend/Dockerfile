# Build stage
FROM node:lts as builder

WORKDIR /code
COPY . /code
RUN apt-get update && yarn install && yarn build

FROM nginx:1.25.1-alpine3.17-slim

RUN rm -rf /etc/nginx/sites-enabled/default
RUN rm -rf /etc/nginx/sites-available/default
RUN rm -rf /etc/nginx/conf.d/default.conf

WORKDIR /code/build/
COPY --from=builder /code/build/ .
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 3000
STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]
# # 애플리케이션의 소스를 복사한다.

# # 의존성 패키지 설치
# yarn build

# # Serve stage
# # nginx의 기본 설정을 제거한다.

# # nginx에 serving할 html의 설정파일을 복사한다.

# # 빌드 결과물을 Nginx가 제공할 위치로 복사한다.
# # frontend Port를 설정한다.
# # container가 종료될 때 정상종료를 유도한다.
# # nginx를 global 설정
# # Docker에서는 nginx가 daemon으로 실행되지 않도록 한다.
# # daemon으로 실행하지 않으면 container가 바로 종료된다.