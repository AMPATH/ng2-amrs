FROM ampathke/etl-services:base

WORKDIR /opt/etl

# Remove copied configurations
RUN rm -rf /opt/etl/conf
COPY . /opt/etl/

# Install new added dependencies
RUN npm install
CMD ["pm2-docker", "start", "/opt/etl/pm2.json" ]
