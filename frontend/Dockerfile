# Builder stage
FROM node:lts as builder
WORKDIR /code

# Install dependencies
COPY package.json .
COPY yarn.lock .
RUN yarn install --silent

# Copy source files and build
COPY . .
RUN yarn build

# Final stage
FROM nginx:1.25.1-alpine3.17-slim

# Remove default nginx configuration files and copy built assets
RUN rm -rf /etc/nginx/sites-enabled/default \
    && rm -rf /etc/nginx/sites-available/default \
    && rm -rf /etc/nginx/conf.d/default.conf

WORKDIR /code/
COPY --from=builder /code .
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 3000
STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]
