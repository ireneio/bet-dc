#!/bin/bash

# docker build --file $2 -t $1 .
# docker run -it -p 8081:8081 $1

docker build -f Dockerfile -t snkr-crawler .
docker run -it -p 8081:8081 snkr-crawler
