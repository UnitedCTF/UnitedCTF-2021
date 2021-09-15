FROM node:latest
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 9002
USER node
CMD [ "npm", "start" ]