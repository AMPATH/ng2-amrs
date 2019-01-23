FROM node:6
RUN apt-get update \
 && DEBIAN_FRONTEND=noninteractive apt-get install -y \
      cron rsyslog \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*
RUN npm install pm2 -g
COPY . /opt/etl
COPY worker/eid-crontab-sample /etc/cron.d/eid-schedule-task
RUN rm -rf /opt/etl/conf
RUN chmod 0644 /etc/cron.d/eid-schedule-task
RUN npm install -g babel-cli
RUN  cd /opt/etl && npm install
ENV TZ=Africa/Nairobi
RUN ln -fs /usr/share/zoneinfo/$TZ /etc/localtime && dpkg-reconfigure -f noninteractive tzdata
RUN echo "cron.* /var/log/cron.log" >> /etc/rsyslog.conf
RUN chmod +x /opt/etl/run1.sh
CMD /opt/etl/run1.sh
