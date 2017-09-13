FROM keymetrics/pm2-docker-alpine:7

COPY . /opt/etl

RUN npm install -g babel-cli
RUN  cd /opt/etl && npm install 

CMD ["pm2-docker", "start", "/opt/etl/pm2.json" ]
