# Build stage
FROM node:18-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build ${APP_NAME}

# Production stage
FROM node:18-alpine AS production

ARG APP_NAME
ENV APP_NAME=${APP_NAME}

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --only=production

COPY --from=development /usr/src/app/dist/apps/${APP_NAME} ./dist/apps/${APP_NAME}
# Also copy shared libs if they are external, but Nest build usually bundles them
# Fix: Nest monorepo build typically outputs to dist/apps/APP_NAME

CMD ["sh", "-c", "node dist/apps/${APP_NAME}/main"]
