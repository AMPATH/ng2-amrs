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

        _.each(response.data, function(row) {
          responses.success.push(row);
        });

        _.each(response.errors, function(error) {
          responses.fail.push(error);
          etlLogger.logger(config.logging.eidPath + '/' + config.logging.eidFile).error('sync failure: %s', error.message);
        });

        return response;
      })
      .catch(function(errors) {
         return errors;
      });
  }, 0)
    .then(function(data) {
      reply(responses);
    });
}
