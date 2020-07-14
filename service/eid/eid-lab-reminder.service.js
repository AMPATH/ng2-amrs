'use strict';
const _ = require('lodash');
let EIDService = require('../eid.service');
let ObsService = require('../openmrs-rest/obs.service');
import { LabClient } from '../../app/lab-integration/utils/lab-client';
let serviceDef = {
  pendingEIDReminders: pendingEIDReminders
};

module.exports = serviceDef;

function pendingEIDReminders(params, config) {

  const reflect = (promise) => {
    return promise.then(result => ({ success: true, result })).catch(error => ({ success: false, error }));
  };
  console.log('Config', config);
  return ObsService.getPatientIdentifiers(params.patientUuid).then((identifiers) => {
    let batch = [];
    console.log('identifiers', identifiers);
    if (config && identifiers) {
      Object.keys(config).forEach((labLocation) => {
        console.log('labLocation', labLocation);
        let labClient = new LabClient(config[labLocation]);
        let filterOptions = {
          patient_id: identifiers.identifiers.join()
        }
        batch.push(labClient.fetchPendingViralLoad(filterOptions))
      });
    }


    return Promise.all(batch.map(reflect)).then((results) => {
      // merge results from all sites

      let mergedResults = [];
      // console.log('Data',results);
      for (let result of results) {
        mergedResults = mergedResults.concat(result.result.data)
      }
      return new Promise((resolve, reject) => {
        resolve(mergedResults);
      });

    }).catch((err) => {
      return new Promise((resolve, reject) => {
        reject(err);
      });
    });

  }).catch((err) => {
    return new Promise((resolve, reject) => {
      reject(err);
    });
  });

}

