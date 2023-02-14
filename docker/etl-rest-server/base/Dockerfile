FROM keymetrics/pm2:14-alpine

WORKDIR /opt/etl

# copy package package-lock.json
COPY package.json package-lock.json /opt/etl/

# Install babel core & node
RUN npm install -g --save-dev @babel/core @babel/node
RUN apk add --no-cache git
RUN apk add --no-cache tzdata
ENV TZ Africa/Nairobi

# install dependencies
RUN npm install
