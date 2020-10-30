'use strict';
var syncService = require('../eid.service'),
  _ = require('underscore'),
  Promise = require('bluebird'),
  moment = require('moment'),
  config = require('../../conf/config'),
  etlLogger = require('../../etl-file-logger');

module.exports = {
  synchronizePatientCohort: synchronizePatientCohort
};

function synchronizePatientCohort(patientUuIdCohort, locations, reply) {
  var responses = {
    success: [],
    fail: []
  };

  var logger = getLogger();

  Promise.reduce(
    patientUuIdCohort,
    function (previous, patientUuId) {
      return syncService
        .getSynchronizedPatientLabResults(patientUuId, locations)
        .then(function (response) {
          logger.info('%s successfully syncd', response.uuid);
          _.each(response.data, function (row) {
            responses.success.push(row);
          });

          _.each(response.errors, function (error) {
            responses.fail.push(error);
            logger.error('sync failure: %s', error.message);
          });

          return response;
        })
        .catch(function (errors) {
          return errors;
        });
    },
    0
  ).then(function (data) {
    reply(responses);
    logger.close();
  });
}

function getLogger() {
  return etlLogger.logger(
    config.logging.eidPath + '/' + config.logging.eidFile
  );
}
