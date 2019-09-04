#!/bin/bash
echo "$DOCKER_PASSWORD" | docker login -u "$DOCKER_USERNAME" --password-stdin
docker push  ampathke/etl-services:"$TRAVIS_BRANCH"
curl https://ngx.ampath.or.ke/deploy-etl-test/?branch="$TRAVIS_BRANCH"&git_hash="$TRAVIS_COMMIT"