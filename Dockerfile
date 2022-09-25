FROM node:16.17-alpine
RUN mkdir -p /node/imageApi
WORKDIR /node/imageApi
COPY . .
RUN npm install
CMD npm start