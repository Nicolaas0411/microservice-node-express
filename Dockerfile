FROM node:alpine

# Create work directory
WORKDIR /usr/src/app

COPY . /usr/src/app

RUN apk --no-cache --virtual build-dependencies add \
    python \
    make \
    g++ \
    && npm i \
    && apk del build-dependencies \
    && npm i -g cross-env \
    && npm i reflect-metadata \
    && npm i microframework-w3tec \
    && npm i tslib \
    && npm i dotenv

# Build and run the app
CMD cross-env NODE_ENV=production node dist/app.js