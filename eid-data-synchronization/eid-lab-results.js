'use strict';
var eidService=require('./../service/eid.service');
var eidSyncLog=require('../dao/eid/eid-sync-log');
var obs=require('../service/openmrs-rest/obs.service');
var eidResultsSchema=require('../eid-lab-results');
var db=require('../etl-db');
module.exports = function(){
  function getPatientLabResults(request,reply){
    eidSyncLog.getEidSyncLog(request,function(result){
      var queryParts = {
        columns:[eidResultsSchema.patientLabResultsSchema.parameters[1].name,
      eidResultsSchema.patientLabResultsSchema.parameters[2].name,
      eidResultsSchema.patientLabResultsSchema.parameters[3].name],
        table: eidResultsSchema.patientLabResultsSchema.table.schema+'.'
        +eidResultsSchema.patientLabResultsSchema.table.tableName +' ',
        values:[request.query.patientUuId]
      };
      var patientHasEverBeenSynced=false;
      if(result.result.length>0){
        patientHasEverBeenSynced=true;
      }
      if(patientHasEverBeenSynced){
        if(result.result[0]['TIMESTAMPDIFF(HOUR,date_updated,now())']<6){
          obs.getPatientTodaysTestObsByPatientUuId(request.query.patientUuId)
          .then(function(response){
            reply({updatedObs:response});
          });
        }
        else{
          eidService.getSynchronizedPatientLabResults(request,reply);
          saveEidSyncLog(queryParts,function(result){
          });
        }
      }
     else{
       eidService.getSynchronizedPatientLabResults(request,reply);
       saveEidSyncLog(queryParts,function(result){
       });
     }
    });
  }
  function saveEidSyncLog(queryParts,callback){
    db.insertQueryServer(queryParts,function(result){
      callback(result);
    });
  }
  function updateEidSyncLog(queryParts,callback){
    db.updateQueryServer(queryParts,function(result){
      callback(result);
    });
  }
  return{
    getPatientLabResults:getPatientLabResults,
    saveEidSyncLog:saveEidSyncLog,
    updateEidSyncLog:updateEidSyncLog
  }
}();
