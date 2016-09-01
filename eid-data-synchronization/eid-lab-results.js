'use strict';
var eidService=require('./../service/eid.service');
var eidSyncLog=require('../dao/eid/eid-sync-log');
var obs=require('../service/openmrs-rest/obs.service');

module.exports = {
  getPatientLabResults: getPatientLabResults
}

function getPatientLabResults(request,reply) {

  eidSyncLog.getEidSyncLog(request, function(result) {

    var patientHasEverBeenSynced = false;
    if(result.result.length > 0)
      patientHasEverBeenSynced = true;

    if(patientHasEverBeenSynced)
      if(result.result[0]['TIMESTAMPDIFF(HOUR,date_updated,now())'] < 6)
        obs.getPatientTodaysTestObsByPatientUuId(request.query.patientUuId)
        .then(function(response) {

          reply({
            updatedObs:response,
            last_sync_date: result.result[0]['date_updated']
          });
        });
      else
        syncAndGetPatientLabResults(request, reply);
   else
     syncAndGetPatientLabResults(request, reply);
  });
}

function syncAndGetPatientLabResults(request, reply) {

  var patientUuId = request.query.patientUuId;

  eidService.getSynchronizedPatientLabResults(patientUuId)
    .then(function(response) {

      eidSyncLog.getEidSyncLog(request, function(result) {

        var patientHasEverBeenSynced = false;
        if(result.result.length > 0)
          patientHasEverBeenSynced = true;
        if(patientHasEverBeenSynced)
          if(result.result[0]['TIMESTAMPDIFF(HOUR,date_updated,now())'] < 6)
            obs.getPatientTodaysTestObsByPatientUuId(patientUuId)
            .then(function(response) {
              reply({
                updatedObs:response,
                last_sync_date: result.result[0]['date_updated']
               });
            });
          else
            reply({
              updatedObs: []
            })
       else
         reply({
           updatedObs: []
         })
      });
    })
    .catch(function(err) {
      reply({
        updatedObs: []
      })
    });
}
