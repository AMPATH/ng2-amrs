'use strict';
var eidService=require('./../service/eid.service');
var eidSyncLog=require('../dao/eid/eid-sync-log');
var obs=require('../service/openmrs-rest/obs.service');
module.exports = function(){
  function getPatientLabResults(request,reply){
    eidSyncLog.getEidSyncLog(request,function(result){
      var patientHasEverBeenSynced=false;
      if(result.result.length>0){
        patientHasEverBeenSynced=true;
      }
      if(patientHasEverBeenSynced){
        if(result.result[0]['TIMESTAMPDIFF(HOUR,date_updated,now())']<6){
          obs.getPatientTodaysTestObsByPatientUuId(request.query.patientUuId)
          .then(function(response){
            var server={
              serverStatus:[]
          }
          response.push(server);
          reply({updatedObs:response});
          });
        }
        else{
          eidService.getSynchronizedPatientLabResults(request.query.patientUuId,reply);
        }
      }
     else{
       eidService.getSynchronizedPatientLabResults(request.query.patientUuId,reply);
     }
    });
  }
  return{
    getPatientLabResults:getPatientLabResults
  }
}();
