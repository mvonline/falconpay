# --- Build Stage ---
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# --- Production Stage ---
FROM nginx:stable-alpine

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
# Default Nginx config is usually fine for a basic SPA, 
# but we might need a custom one for client-side routing.
# COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
