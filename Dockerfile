FROM ubuntu:14.04

COPY . /opt/etl

RUN apt-get update && \
  apt-get install -y git openssl wget rlwrap && \
  wget https://deb.nodesource.com/node_5.x/pool/main/n/nodejs/nodejs_5.9.1-1nodesource1~trusty1_amd64.deb && \
  dpkg -i nodejs_5.9.1-1nodesource1~trusty1_amd64.deb && \
  if [ ! -f /keys/server.crt ]; then \
    mkdir /keys; \
    openssl req -nodes -new -x509 -keyout /keys/server.key -out /keys/server.crt \
      -subj "/C=US/ST=Denial/L=Springfield/O=ACME/CN=*"; \
  fi && \
  cd /opt/etl && \
  npm install

# Delete the conf file if it already exists
RUN echo 'Attempting to delete conf directory contents ha!' && \
  rm -rf /opt/etl/conf/config.*
  
COPY docker-settings.js /opt/etl/conf/config.js

EXPOSE 8002

CMD ["/usr/bin/node", "/opt/etl/etl-server.js"]
