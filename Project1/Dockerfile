FROM node:11

LABEL version="1.0"
LABEL description="GPS Tracking"
LABEL maintainer="Felipe Macias - fmacias1@eafit.edu.co"

ARG PORT=3000
ENV PORT $PORT

WORKDIR /Project1

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000
CMD npm start
