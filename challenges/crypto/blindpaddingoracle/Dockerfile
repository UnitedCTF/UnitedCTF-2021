FROM node:fermium-alpine AS build

RUN mkdir /app
WORKDIR /app

COPY ./*.json /app/
RUN npm install

COPY ./src /app/src
RUN npm run build

FROM node:fermium-alpine

RUN mkdir /app
WORKDIR /app

ENV NODE_ENV production

COPY --from=build /app/package* /app/
COPY --from=build /app/node_modules /app/node_modules

COPY --from=build /app/out /app

RUN npm prune

EXPOSE 5000
USER node
CMD [ "npm", "run", "start:docker" ]
