'use strict';
const _ = require('lodash');
let EIDService = require('../eid.service');
let ObsService = require('../openmrs-rest/obs.service');
let serviceDef = {
  pendingEIDReminders: pendingEIDReminders
};

module.exports = serviceDef;

function pendingEIDReminders(params, config) {
  
  const reflect = (promise) => {
    return promise.then(result => ({ success: true, result })).catch(error => ({ success: false, error }));
  };
  
  return ObsService.getPatientIdentifiers(params.patientUuid).then((identifiers) => {
    let batch = [];
    _.each(config.locations, function(server){
        batch.push(EIDService.getPendingEIDTestResultsByPatientIdentifiers(identifiers.identifiers,
          params.referenceDate, server));
    });
  
    return Promise.all(batch.map(reflect)).then((results) => {
        // merge results from all sites
        let mergedResults = {};
        _.each(results, function(result){
          if(result.success) {
            var currentKey = '';
            let _result = result.result
            _.each(_result, function(value, key){
              currentKey = key;
              if(mergedResults[currentKey]) {
                mergedResults[currentKey]= mergedResults[currentKey].concat(_result[currentKey]);
              } else {
                mergedResults[currentKey] =  _result[currentKey];
              }
            });
          }
        });
  
        return new Promise((resolve, reject)=>{
          resolve(mergedResults);
        });
        
    }).catch((err)=>{
        return new Promise((resolve, reject)=>{
          reject(err);
        });
    });
  
  }).catch((err)=>{
    return new Promise((resolve, reject)=>{
      reject(err);
    });
  });
  
}

