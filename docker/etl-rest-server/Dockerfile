FROM keymetrics/pm2:14-alpine

COPY . /opt/etl
RUN apk add --no-cache git
RUN npm install -g --save-dev @babel/core @babel/node
RUN rm -rf /opt/etl/conf
RUN ls && pwd
WORKDIR /opt/etl
RUN npm install
RUN apk add --no-cache tzdata
ENV TZ Africa/Nairobi

CMD ["pm2-docker", "start", "/opt/etl/pm2.json" ]
