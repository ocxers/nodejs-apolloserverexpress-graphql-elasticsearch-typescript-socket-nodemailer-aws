#!/usr/bin/env bash

# Currently, we only needs to run the webserver, ignore es & cerebro
#docker-compose rm webserver
#docker-compose up --build -d webserver

docker-compose rm
docker-compose up --build -d
# #Access ES cerebro in the browser: http://localhost:9000/#/overview?host=http:%2F%2Fedu-web-es:9200
