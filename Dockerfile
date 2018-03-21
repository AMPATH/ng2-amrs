# Builds a Docker to deliver dist/
FROM bitnami/node:6 as node
WORKDIR /ng2-amrs
COPY ./ /ng2-amrs
RUN npm install && npm run build

FROM nginx:latest
COPY --from=node /ng2-amrs/dist /usr/share/nginx/html