FROM node:24 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:24 as prod
WORKDIR /app
COPY --from=build /app/.output ./.output
COPY --chown=node:node package*.json .
RUN npm install --production

EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]