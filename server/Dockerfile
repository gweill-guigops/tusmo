FROM node:24-alpine as build
WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM build as prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --chown=node:node package*.json .
RUN npm install --production
USER node
EXPOSE 3001
CMD ["npm", "run", "start"]