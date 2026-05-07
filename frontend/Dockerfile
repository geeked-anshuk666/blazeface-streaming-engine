# Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copy package lock for deterministic builds
COPY package*.json ./
# Use npm ci instead of npm install for faster, reliable CI builds
RUN npm ci

COPY . .
RUN npm run build

# Production stage - using unprivileged nginx for security
FROM nginxinc/nginx-unprivileged:stable-alpine

COPY --from=build /app/dist /usr/share/nginx/html

USER root
# Add custom nginx config for SPA routing on unprivileged port 8080
RUN echo 'server { \
    listen 8080; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Revert to unprivileged user
USER nginx

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
