'use strict';

var moment = require('moment');
var _ = require('underscore');
var dao = require('./etl-dao');

var moduleDefinition = {
  resolveLocationIdsToLocationUuids: resolveLocationIdsToLocationUuids
};

module.exports = moduleDefinition;

function resolveLocationIdsToLocationUuids(request, callback) {
  var asyncRequests = 0; //this should be the number of async requests needed before they are triggered
  var onResolvedPromise = function (promise) {
    asyncRequests--;
    if (asyncRequests <= 0) {
      //voting process to ensure all pre-processing of request async operations are complete
      callback();
    }
  };
  if (request.query.locationUuids) {
    asyncRequests++;
  }
  if (asyncRequests === 0) callback();
  if (request.query.locationUuids) {
    dao.getIdsByUuidAsyc(
      'amrs.location',
      'location_id',
      'uuid',
      request.query.locationUuids,
      function (results) {
        request.query.locations = results;
      }
    ).onResolved = onResolvedPromise;
  }
}
