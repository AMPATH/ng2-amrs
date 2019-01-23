#!/bin/bash
echo "Setup cron"
service rsyslog start
service cron start
pm2-docker start /opt/etl/pm2-AUTO-ENROLL.json
