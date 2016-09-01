'use strict';
var
  syncService = require('../eid.service')
  , _ = require('underscore')
  , Promise = require('bluebird')
  , moment = require('moment')
  , config = require('../../conf/config')
  , etlLogger = require('../../etl-file-logger');

module.exports = {
  synchronizePatientCohort: synchronizePatientCohort
};

function synchronizePatientCohort(patientUuIdCohort,reply) {

  var responses = {
    success: [],
    fail:  []
  }

  Promise.reduce(patientUuIdCohort, function(previous, patientUuId) {

    return syncService.getSynchronizedPatientLabResults(patientUuId)
      .then(function(response) {
        etlLogger.logger(config.logging.eidPath + '/' + config.logging.eidFile).info('%s successfully syncd', response.uuid);
        responses.success.push(response);
        return response;
      })
      .catch(function(error) {
        responses.fail.push(error);
        etlLogger.logger(config.logging.eidPath + '/' + config.logging.eidFile).error('sync failure: %s', error.message);
         return error;
      });
  }, 0)
    .then(function(data) {
      reply(responses);
    });
}
