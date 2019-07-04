if [[ ${DIGITAL_OCEAN_SPACES_DEPLOY_URL} ]]; then
  DEPLOY_URL="${DIGITAL_OCEAN_SPACES_DEPLOY_URL}/$TRAVIS_COMMIT"
else
  DEPLOY_URL="http://localhost:4200"
fi
echo $DEPLOY_URL
node version.js && node --max-old-space-size=4096 ./node_modules/@angular/cli/bin/ng build --prod --stats-json --deploy-url $DEPLOY_URL