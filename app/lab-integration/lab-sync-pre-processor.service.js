'use strict';
var rp = require('../../request-config');
var config = require('../../conf/config');
var moment = require('moment');
var db = require('../../etl-db');

var definition = {
  processLabSyncReqest: processLabSyncReqest,
  getRestResource: getRestResource,
  isBatchMode: isBatchMode,
  getPersonAttributes: getPersonAttributes,
  hasVisitStartedToday: hasVisitStartedToday,
  getPatientVisits: getPatientVisits,
  savePendingLabResults: savePendingLabResults,
  getCachedPendingLabResults: getCachedPendingLabResults,
  processPendingLabResultRequest: processPendingLabResultRequest,
  hasPendingVLOrder: hasPendingVLOrder
};

module.exports = definition;

function processLabSyncReqest(params) {
  const hasVisitStartedEnabled =
    config.eid.filterOptions.hasVisitStartedEnabled;
  return new Promise(function (resolve, reject) {
    determineIfTestPatient(params.patientUuId)
      .then((result) => {
        if (result === false) {
          const isBatch = isBatchMode(params);
          if (isBatch === true) {
            resolve(true);
          } else {
            if (hasVisitStartedEnabled) {
              hasVisitStartedToday(params.patientUuId)
                .then((result) => {
                  if (result === true) {
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                })
                .catch((error) => {
                  reject(error);
                });
            } else {
              resolve(true);
            }
          }
        } else {
          reject('ERROR: is a TestPatient');
        }
      })
      .catch((error) => {
        reject('ERROR: isTestPatient', error);
      });
  });
}

function getRestResource(path) {
  var link = config.openmrs.host + ':' + config.openmrs.port + path;
  if (config.openmrs.https === true) {
    link = 'https://' + link;
  } else {
    link = 'http://' + link;
  }
  return link;
}

function isBatchMode(params) {
  if (params.mode) {
    const mode = params.mode;
    if (mode === 'batch') {
      return true;
    }
  } else {
    return false;
  }
}

function getPersonAttributes(patientUuid) {
  var uri = getRestResource(
    '/' + config.openmrs.applicationName + '/ws/rest/v1/person/' + patientUuid
  );
  var queryString = {
    v: 'custom:(attributes:(uuid,display,value,attributeType:(uuid,display))'
  };
  return new Promise(function (resolve, reject) {
    rp.getRequestPromise(queryString, uri)
      .then(function (response) {
        resolve(response.attributes);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

function hasVisitStartedToday(patientUuId) {
  return new Promise(function (resolve, reject) {
    getPatientVisits(patientUuId)
      .then((visits) => {
        var hastodaysVisits = visits.some((visit) => {
          return (
            moment(visit.startDatetime).format('YYYY-MM-DD') ===
            moment().format('YYYY-MM-DD')
          );
        });
        resolve(hastodaysVisits);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getPatientVisits(patientUuid) {
  var uri = getRestResource(
    '/' + config.openmrs.applicationName + '/ws/rest/v1/visit'
  );
  var queryString = {
    v: 'custom:(uuid,startDatetime,stopDatetime)',
    patient: patientUuid
  };
  return new Promise(function (resolve, reject) {
    rp.getRequestPromise(queryString, uri)
      .then(function (response) {
        resolve(response.results);
      })
      .catch(function (error) {
        reject(error);
      });
  });
}

function savePendingLabResults(eidResults, personUuid) {
  return new Promise((resolve, reject) => {
    let queryParts = {};
    let sql = '';

    sql =
      "replace into etl.eid_pending_results (person_uuid,pending_result) values ('" +
      personUuid +
      "','" +
      eidResults +
      "');";
    queryParts = {
      sql: sql
    };
    db.queryServer(queryParts, function (result) {
      result.sql = sql;
      resolve(result);
    });
  });
}

function getCachedPendingLabResults(personUuid) {
  return new Promise((resolve, reject) => {
    let queryParts = {};
    let sql = '';

    sql =
      "select * from etl.eid_pending_results where person_uuid = '" +
      personUuid +
      "' AND DATE(date_created) = DATE(CURDATE()) order by date_created limit 1;";
    queryParts = {
      sql: sql
    };
    db.queryServer(queryParts, function (result) {
      result.sql = sql;
      resolve(result);
    });
  });
}

function processPendingLabResultRequest(patientUuid) {
  return new Promise((resolve, reject) => {
    determineIfTestPatient(patientUuid)
      .then((result) => {
        if (result === false) {
          getCachedPendingLabResults(patientUuid)
            .then((cachedResults) => {
              let cachedEidResult = [];
              if (cachedResults.size > 0) {
                cachedEidResult = JSON.parse(
                  cachedResults.result[0].pending_result
                );
                resolve(cachedEidResult);
              } else {
                resolve(cachedEidResult);
              }
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject('Is Test Patient');
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function hasPendingVLOrder(personUuid) {
  return new Promise((resolve, reject) => {
    let queryParts = {};
    let sql = '';

    sql =
      "SELECT t3.uuid FROM amrs.orders t1 INNER JOIN amrs.person t3 ON t3.person_id = t1.patient_id LEFT OUTER JOIN amrs.obs t2 ON t1.order_id = t2.order_id where t2.order_id IS NULL AND t1.date_activated >= DATE('2020-01-01') AND t3.uuid = '" +
      personUuid +
      "';";
    queryParts = {
      sql: sql
    };
    db.queryServer(queryParts, function (result) {
      result.sql = sql;
      resolve(result);
    });
  });
}

function determineIfTestPatient(personUuid) {
  var testPatientAttributeTypeUuid = '1e38f1ca-4257-4a03-ad5d-f4d972074e69';
  return new Promise((resolve, reject) => {
    getPersonAttributes(personUuid)
      .then((result) => {
        const isTestPatient = result.some((attribute) => {
          return (
            attribute.attributeType.uuid === testPatientAttributeTypeUuid &&
            attribute.value === true
          );
        });
        resolve(isTestPatient);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
