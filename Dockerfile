# FROM node:8-alpine as build-stage

# #Install git
# RUN apk update && apk add git && apk add bash

# WORKDIR /ng2-amrs

# COPY package.json /ng2-amrs
# COPY package-lock.json /ng2-amrs
# COPY src /ng2-amrs
# COPY version.js /ng2-amrs
# COPY nginx.conf /ng2-amrs
# COPY scripts /ng2-amrs

# RUN ls -alh
# RUN apk add --no-cache --virtual .gyp python make g++ \
#     && npm install && npm install -g @angular/cli && npm install -g increase-memory-limit \
#     && apk del .gyp

# #Increase space and build the project
# RUN export NODE_OPTIONS=--max_old_space_size=4096

# #Install dependencies
# RUN npm install

# #Build assets
# RUN npm run build-prod

FROM nginx:1.22-alpine

# clear any default files installed by nginx
RUN rm -rf /usr/share/nginx/html/*

COPY /dist/ngx-amrs /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
