const obsService = require('../../service/openmrs-rest/obs.service');
const async = require('async');
import * as _  from 'lodash';
const config = require('../../conf/config');
const moment = require('moment');
const Boom = require('boom');
const eidResultsSchema = require('../../eid-lab-results');
const db = require('../../etl-db');
const eidService = require('../../service/eid.service');
import { LabClient } from './utils/lab-client';
import { VLAdapter } from './adapters/vl-adapter';
import { DNAPCRAdapter } from './adapters/dnapcr-adpater';
import { CD4Adapter } from './adapters/cd4-adapter';
import { EidCompareOperator } from './utils/eid-compare-operator';

export class LabSyncService {
  syncAllLabsByPatientUuid(patientUuid, reply) {
    let tasks = [];
    Object.keys(config.hivLabSystem).forEach((labLocation) => {
      tasks.push((cb) => {
        // delay alupe for a few ms
        cb(null, this.syncLabsByPatientUuid(patientUuid, labLocation, labLocation === 'alupe' ? 50 : 0).then((result)=>{
          return result;
        }));
      });
    });
    async.parallel(async.reflectAll(tasks), (err, results) => {
     
      // currently we have duplicate data in db. Try to remove here
      Promise.all(results.map((result) => result.value)).then((lab_data) => {
        const _lab_data = _.map(lab_data, (lab) => {
          lab.updatedObs = _.uniqBy(lab.updatedObs, (ob) => {
            return ob.concept.uuid
          });
          return lab;
        });
        reply(_lab_data);
      }).catch((err) => {
        console.log('sync service error', err);
        reply(Boom.notFound('Sorry, sync service temporarily unavailable.'));
      });
      
    });
  }

 
  syncLabsByPatientUuid(patientUuid, labLocation, delay) {
    //obsService.getPatientIdentifiers(patientUuid);
    return this.getLabSyncLog(patientUuid).then((result) => {
      var patientHasEverBeenSynced = false;
      if (result.result.length > 0)
        patientHasEverBeenSynced = true;
      if (patientHasEverBeenSynced) {
        if (result.result[0]['status'] === 0 && (result.result.length === 1 || result.result[1]['status'] === 0) &&
          result.result[0]['TIMESTAMPDIFF(HOUR,date_updated,now())'] < 6) {
          console.log('Patient synced..');
          return obsService.getPatientTodaysTestObsByPatientUuId(patientUuid)
            .then(function (response) {

              return {
                updatedObs: response,
                lab: labLocation,
                last_sync_date: result.result[0]['date_updated']
              }
            }).catch((error)=>{
              console.log('ERROR',error);
            });
        }
        else {
      
            return this.syncAndGetPatientLabResults(patientUuid, labLocation).then((result) => {
              return this.syncLabsByPatientUuid(patientUuid,labLocation);
            }).catch((err)=>{
              console.log('ERROR Getting results',err);
            });
        }
      }
      else {

          return this.syncAndGetPatientLabResults(patientUuid, labLocation).then((result) => {
            return this.syncLabsByPatientUuid(patientUuid,labLocation);
          }).catch((error)=>{
            console.log('ERROR',error);
          });
      }
    }).catch((error) => {
      console.error('getLabSyncLog error', error);
    });
  }

  syncAndGetPatientLabResults(patientUuid, labLocation) {
    const that = this;
    var table = eidResultsSchema.patientLabResultsSchema.table.schema + '.' + eidResultsSchema.patientLabResultsSchema.table.tableName;
    var fields = [
      {
        person_uuid: patientUuid,
        date_updated: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
        date_created: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
        site: JSON.stringify(labLocation),
        conflicts: null
      }
    ];
    return obsService.getPatientIdentifiers(patientUuid).then(function (response) {
      if (response.identifiers.length === 0) {
        throw new Error('Patient without identifiers!');
      }
      let configObj = config.hivLabSystem[labLocation];
      let client = new LabClient(configObj);
      return Promise.all([
        client.fetchViralLoad({ patient_id: response.identifiers.join() }),
        client.fetchDNAPCR({ patient_id: response.identifiers.join() }),
        client.fetchCD4({ patient_id: response.identifiers.join() })
      ]).then((allResults) => {
        let viralLoadResults = allResults[0];
        let dnaPCR = allResults[1];
        let cd4Results = allResults[2];
        let labResultsPromises = [];
        labResultsPromises.push(that.processViralLoadResults(viralLoadResults.data || [], patientUuid).then((processedObs) => {
          const eidCompareOperator = new EidCompareOperator();
          let labVLObs = processedObs[0];
          let amrsObs = [];
          if (processedObs[1]) {
            amrsObs = processedObs[1].map((obs) => {
              return {
                person: obs.person.uuid,
                obsDatetime: obs.obsDatetime,
                concept: obs.concept.uuid,
                value: obs.value
              }
            });
          }
          return eidCompareOperator.getAllResults(labVLObs, amrsObs);
        }).catch((error) => {
          console.error('ERROR : processViralLoadResults', error);
        }));

        labResultsPromises.push(that.processDNAPCRResults(dnaPCR.data || [], patientUuid).then((processedObs) => {
          const eidCompareOperator = new EidCompareOperator();
          let labDNAPCRObs = processedObs[0];
          let amrsObs = [];
          if (processedObs[1]) {
            amrsObs = processedObs[1].map((obs) => {
              return {
                person: obs.person.uuid,
                obsDatetime: obs.obsDatetime,
                concept: obs.concept.uuid,
                value: obs.value
              }
            });
          }
          return eidCompareOperator.getAllResults(labDNAPCRObs, amrsObs);
        }).catch((error) => {
          console.error('ERROR : processDNAPCRResults', error);
        })
        );

        labResultsPromises.push(that.processCD4Results(cd4Results.data || [], patientUuid).then((processedObs) => {
          const eidCompareOperator = new EidCompareOperator();
          let labCD4Obs = processedObs[0];
          let amrsObs = [];
          if (processedObs[1]) {
            amrsObs = processedObs[1].map((obs) => {
              return {
                person: obs.person.uuid,
                obsDatetime: obs.obsDatetime,
                concept: obs.concept.uuid,
                value: obs.value
              }
            });
          }

          return eidCompareOperator.getAllResults(labCD4Obs, amrsObs);
        }).catch((error) => {
          console.error('ERROR: processCD4Results', error);
        })
        );

        return Promise.all(labResultsPromises).then((obs) => {
          const flatten = arr => arr.reduce(
            (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
          );
          //return obsService.postObsToAMRS(obs[0].missingResults[0]);
          let flattenResult = flatten(obs);
          let combinedMissing = that.combineObs('missingResults', flattenResult);
          let combinedconflicting = that.combineObs('conflictingResults', flattenResult);

         console.log('Conflicting', combinedconflicting);
         console.log('Missing', combinedMissing);

          fields[0].conflicts = JSON.stringify(combinedconflicting);
          return Promise.all(that.combineObsPostPromises(combinedMissing)).then((savedObs) => {
            fields[0].status = 0;
            console.log('Saving EID logs');
            return eidService.saveEidSyncLog(table, fields, savedObs).catch((error)=>{
              console.log('ERROR saving logs',error);
            });
          }).catch((error) => {
            console.error('ERROR : combineObsPostPromises', error);
          });
        }).catch((error) => {
          console.error('ERROR : labResultsPromises', error);
        });
      }).catch((error) => {
        console.error('ERROR : Fetching results', error);
      });
    });

  }

  combineObsPostPromises(payload) {
    const promises = [];
    const labExceptions = this.getLabExceptions();
    for (let obs of payload) {
      promises.push(obsService.postObsToAMRS(obs));
    }
    return promises;
  }

  combineObs(key, obs) {
    let combined = [];
    for (let o of obs) {
      if(o){
        combined = combined.concat(o[key]);
      }
    }
    return combined;
  }

  getLabExceptions() {
    return {
      "POOR SAMPLE QUALITY": "a89c3f1e-1350-11df-a1f1-0026b9348838",
      "NOT DONE": "a899ea48-1350-11df-a1f1-0026b9348838",
      "INDETERMINATE": "a89a7ae4-1350-11df-a1f1-0026b9348838",
      "BELOW DETECTABLE LIMIT": "a89c3f1e-1350-11df-a1f1-0026b9348838",
      "UNABLE TO COLLECT SAMPLE": "a8afcec6-1350-11df-a1f1-0026b9348838",
      "SPECIMEN NOT RECEIVED": "0271c15e-4f7f-4a18-9b45-2d7e5b6f7057",
      "ORDERED FOR WRONG PATIENT": "3366412a-e279-4428-a671-37221804c6e6",
      "COLLECT NEW SAMPLE": "a89c3f1e-1350-11df-a1f1-0026b9348838"
    }
  }

  processViralLoadResults(result, patientUuid) {
    let vlAdapter = new VLAdapter(result, patientUuid);
    return Promise.all([vlAdapter.getLabResults(), obsService.getPatientAllTestObsByPatientUuId(patientUuid)]);
  }

  processDNAPCRResults(result, patientUuid) {
    let dnaPCRAdapter = new DNAPCRAdapter(result, patientUuid);
    return Promise.all([dnaPCRAdapter.getLabResults(), obsService.getPatientAllTestObsByPatientUuId(patientUuid)]);
  }

  processCD4Results(result, patientUuid) {
    let cd4Adapter = new CD4Adapter(result, patientUuid);
    return Promise.all([cd4Adapter.getLabResults(), obsService.getPatientAllTestObsByPatientUuId(patientUuid)]);
  }

  handleLabRequestError(error) {
    throw Error(error.message)
  }

  getLabSyncLog(patientUuid) {
    var queryParts = {
      columns: eidResultsSchema.patientLabResultsSchema.columns,
      table: eidResultsSchema.patientLabResultsSchema.table.schema + '.' + eidResultsSchema.patientLabResultsSchema.table.tableName,
      where: [
        eidResultsSchema.patientLabResultsSchema.filters[0].expression,
        patientUuid
      ],
      order: [
        {
          column: 'date_updated',
          asc: false
        }
      ],
      limit: 3
    };
    return new Promise(function (resolve, reject) {
      db.queryServer_test(queryParts, function (result) {
        resolve(result);
      });
    });
  }
}