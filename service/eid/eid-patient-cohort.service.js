'use strict';
var syncService=require('../eid.service');
var _ = require('underscore');
var Promise=require('bluebird');
var moment=require('moment');
module.exports = function(){
  function synchronizePatientCohort(patientUuIdCohort,reply){
    Promise.reduce(patientUuIdCohort,function(previous,patientUuId){
      return syncService.getSynchronizedPatientLabResults(patientUuId,function(){})
      .then(function(response){
        return response;
      },function(error){
        return error;
         etlLogger.logRequestError('SynchronizedPatientLabResults request error. Details:' + error,
         config.logging.eidFile, config.logging.eidPath);
      });
      },0).then(function(data){
      reply("patient cohort synchronization completed");
    });
}
  return {
    synchronizePatientCohort:synchronizePatientCohort
  }
}();
