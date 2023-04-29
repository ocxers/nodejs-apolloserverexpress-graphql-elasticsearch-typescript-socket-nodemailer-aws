FROM node:16-buster

ARG APP_HOME=/usr/src/app

WORKDIR ${APP_HOME}
COPY package*.json ./

# install pages and build server
RUN yarn install
COPY . .
RUN yarn build

## set folder permission
RUN mkdir -p ${APP_HOME}/dist/uploads && \
    chmod 755 ${APP_HOME}/dist/uploads

WORKDIR ${APP_HOME}

CMD [ "yarn", "start" ]


