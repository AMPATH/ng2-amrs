/*jshint -W003, -W097, -W117, -W026 */
'use strict';
var Promise = require('bluebird');
var encounterService = require('../../service/openmrs-rest/encounter.js')
var db = require('../../etl-db');
var _ = require('underscore');
var reportFactory = require('../../etl-factory');
var Boom = require('boom'); //extends Hapi Error Reporting. Returns HTTP-friendly error objects: github.com/hapijs/boom
var helpers = require('../../etl-helpers');
var http = require('http');
var https = require('https');
var Promise = require('bluebird');
var rp = require('../../request-config');
var config = require('../../conf/config');
var moment = require('moment');
var eidRestFormatter = require('../../eid-rest-formatter');
module.exports = function () {
  function getRestResource(path) {
    var protocol = config.openmrs.https ? 'https' :'http';
    var link = protocol + '://' + config.openmrs.host + ':' + config.openmrs.port + path;
    return link;
  }
  function getPatientIdentifiers(patientUuId) {
    var uri = getRestResource('/' + config.openmrs.applicationName + '/ws/rest/v1/patient/' + patientUuId);
    var queryString = {
      v: 'full'
    };
    // return new Promise(function (resolve, reject) {
    //   var patientIdentifiers = {
    //     identifiers: ['9886WB-5', '717662760-7', '277850056-7', '1463MP-0', '14607-00093']
    //   };

    //   resolve(patientIdentifiers)
    // });
    return new Promise(function (resolve, reject) {
      rp.getRequestPromise(queryString, uri)
        .then(function (response) {
          var patientIdentifiers = {
            identifiers: []
          }
          _.each(response.identifiers, function (identifier) {
            //exclude Old AMPATH Medical Record Number identifierType
            // if (identifier.identifierType.uuid != "58a46a32-1359-11df-a1f1-0026b9348838") {
              patientIdentifiers.identifiers.push(identifier.identifier);
              var hasALetterRegEx = /[a-z]/i;
              if (hasALetterRegEx.test(identifier.identifier)) {
                var indexOfFirstLetter = identifier.identifier.match(/[a-z]/i).index;
                var identifierWithSpace = identifier.identifier.substr(0, indexOfFirstLetter) +
                  ' ' + identifier.identifier.substr(indexOfFirstLetter);
                patientIdentifiers.identifiers.push(identifierWithSpace);
              }
            // }
          })
          resolve(patientIdentifiers);
        })
        .catch(function (error) {
          //console.error("error getPatientIdentifiers++++++++++++++++++++++++++++++++++++++",error);
          reject(error);
        });
    });
  }
  function getPatientTestObsByConceptUuId(conceptUuId, patientUuId) {
    var patientObs = [];
    var uri = getRestResource('/' + config.openmrs.applicationName + '/ws/rest/v1/obs');
    var queryString = {
      patient: patientUuId,
      concept: conceptUuId,
      v: 'full'
    }
    return new Promise(function (resolve, reject) {
      rp.getRequestPromise(queryString, uri)
        .then(function (response) {
          _.each(response.results, function (data) {
            patientObs.push(data);
          });
          resolve(patientObs);
        })
        .catch(function (error) {
          reject(error);
        })
    })
  }
  function getAmrsPatientObsByDate(conceptUuId, patientUuId) {
    var todaysDate = moment(new Date()).format('YYYY-MM-DD');
    var patientObs = [];
    var uri = getRestResource('/' + config.openmrs.applicationName + '/ws/rest/v1/obs');
    var queryString = {
      patient: patientUuId,
      concept: conceptUuId,
      v: 'full'
    }
    return new Promise(function (resolve, reject) {
      rp.getRequestPromise(queryString, uri)
        .then(function (response) {
          _.each(response.results, function (data) {
            var obsDateCreated = moment(new Date(data.auditInfo.dateCreated)).format('YYYY-MM-DD');
            if (obsDateCreated == todaysDate) {
              patientObs.push(data);
            }
          });
          resolve(patientObs);
        })
        .catch(function (error) {
          reject(error);
          console.error("error getAmrsPatientObsByDate++++++++++++++++++++++++++++++++++++++", error);
        })
    })
  }
  function getPatientAllTestObsByPatientUuId(patientUuId) {
    var allPatientObs = {
      obs: []
    }

    var labConcepts = {
      concepts: [
        { "conceptId": 657, "uuid": "a896cce6-1350-11df-a1f1-0026b9348838" },
        { "conceptId": 9238, "uuid": "457c741d-8f71-4829-b59d-594e0a618892" },
        { "conceptId": 1238, "uuid": "a89b5856-1350-11df-a1f1-0026b9348838" },
        { "conceptId": 856, "uuid": "a8982474-1350-11df-a1f1-0026b9348838" },
        { "conceptId": 1030, "uuid": "a898fe80-1350-11df-a1f1-0026b9348838" },
        { "conceptId": 730, "uuid": "a8970a26-1350-11df-a1f1-0026b9348838" },
        { "conceptId": 5497, "uuid": "a8a8bb18-1350-11df-a1f1-0026b9348838" }
      ]
    }
    var promiseArray = [];
    return new Promise(function (resolve, reject) {
      _.each(labConcepts.concepts, function (testObject) {
        var labConceptUuId = testObject.uuid;
        var result = getPatientTestObsByConceptUuId(labConceptUuId, patientUuId);
        promiseArray.push(result);
      });

      Promise.all(promiseArray).then(function (response) {
        var concatenatedArray = [].concat.apply([], response);
        resolve(concatenatedArray);
      })
        .catch(function (error) {
          reject(error);
        })
    });
  }
  function getPatientTodaysTestObsByPatientUuId(patientUuId) {
    var allPatientObs = {
      obs: []
    }

    var labConcepts = {
      concepts: [
        { "conceptId": 657, "uuid": "a896cce6-1350-11df-a1f1-0026b9348838" },
        { "conceptId": 9238, "uuid": "457c741d-8f71-4829-b59d-594e0a618892" },
        { "conceptId": 1238, "uuid": "a89b5856-1350-11df-a1f1-0026b9348838" },
        { "conceptId": 856, "uuid": "a8982474-1350-11df-a1f1-0026b9348838" },
        { "conceptId": 1030, "uuid": "a898fe80-1350-11df-a1f1-0026b9348838" },
        { "conceptId": 730, "uuid": "a8970a26-1350-11df-a1f1-0026b9348838" },
        { "conceptId": 5497, "uuid": "a8a8bb18-1350-11df-a1f1-0026b9348838" }
      ]
    }
    var promiseArray = [];
    return new Promise(function (resolve, reject) {
      _.each(labConcepts.concepts, function (testObject) {
        var labConceptUuId = testObject.uuid;
        var result = getAmrsPatientObsByDate(labConceptUuId, patientUuId);
        promiseArray.push(result);
      });

      Promise.all(promiseArray).then(function (response) {
        var concatenatedArray = [].concat.apply([], response);
        resolve(concatenatedArray);
      })
        .catch(function (error) {
          reject(error);
        })
    });
  }
  function postObsToAMRS(payload, patientUuId) {
    var uri = getRestResource('/' + config.openmrs.applicationName + '/ws/rest/v1/obs');
    return new Promise(function (resolve, reject) {
      rp.postRequestPromise(payload, uri)
        .then(function (response) {
          resolve(response);
        })
        .catch(function (error) {
          reject(error);
        })
    });
  }
  function postAllObsToAMRS(payload, patientUuId) {
    var hasNumbersOnly = /^[0-9]*(?:\.\d{1,2})?$/;
    var hasLessThanSymbol = /</g;
    var promisesViralLoadlAll = [];
    var promisesCd4All = [];
    var promisesDnaPcrAll = [];
    if (payload.viralLoad.length > 0) {
      _.each(payload.viralLoad, function (viralLoadPayload) {
        if (viralLoadPayload != undefined) {
          var valid = eidRestFormatter.checkStatusOfViralLoad(viralLoadPayload);
          if (valid == 1) {
            promisesViralLoadlAll.push(generateAndPostLabObsPayload(viralLoadPayload,
              patientUuId, eidRestFormatter.convertViralLoadPayloadToRestConsumableObs));

          }
          else if (valid == 0) {
            promisesViralLoadlAll.push(generateAndPostLabObsPayload(viralLoadPayload,
              patientUuId, eidRestFormatter.convertViralLoadWithLessThanToRestConsumableObs));

          }
          else if (valid == 2) {
            promisesViralLoadlAll.push(generateAndPostLabObsPayload(viralLoadPayload,
              patientUuId, eidRestFormatter.convertViralLoadExceptionToRestConsumableObs));
          }
        }
      });
    }
    if (payload.cd4Panel.length > 0) {
      _.each(payload.cd4Panel, function (cd4Payload) {
        if (cd4Payload != undefined) {
          var cd4PanelHasValidData = eidRestFormatter.cd4PanelHasValidData(cd4Payload);
          var cd4PanelHasErrors = eidRestFormatter.cd4PanelHasErrors(cd4Payload);
          if (cd4PanelHasValidData) {
            var cd4Data = eidRestFormatter.generateCd4ValidData(cd4Payload);
            promisesCd4All.push(generateAndPostLabObsPayload(cd4Data,
              patientUuId, eidRestFormatter.convertCD4PayloadTORestConsumableObs));
          }
          if (cd4PanelHasErrors) {
            var cd4Exceptions = eidRestFormatter.generateCd4Exceptions(cd4Payload);
            promisesCd4All.push(generateAndPostLabObsPayload(cd4Exceptions,
              patientUuId, eidRestFormatter.convertCD4ExceptionTORestConsumableObs));
          }
        }
      });
    }
    if (payload.pcr.length > 0) {
      _.each(payload.pcr, function (pcrPayload) {
        if (pcrPayload != undefined) {
          promisesDnaPcrAll.push(
            generateAndPostLabObsPayload(pcrPayload,
              patientUuId, eidRestFormatter.convertDNAPCRPayloadTORestConsumableObs)
          );
        }
      });
    }
    return new Promise(function (resolve, reject) {
      Promise.all(promisesViralLoadlAll, promisesCd4All, promisesDnaPcrAll)
        .then(function (response) {
          resolve(response)
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }

  function generateAndPostLabObsPayload(eidData, patientUuid, payloadGenFunc) {
    return new Promise(function (resolve, reject) {
      payloadGenFunc(eidData, patientUuid)
        .then(function (payload) {
          postObsToAMRS(payload, patientUuid)
            .then(function (response) {
              resolve(response);
            })
            .catch(function (error) {
              reject(error);
            });
        })
        .catch(function (error) {
          reject(error);
        })
    });
  }

  return {
    getPatientIdentifiers: getPatientIdentifiers,
    getPatientAllTestObsByPatientUuId: getPatientAllTestObsByPatientUuId,
    getRestResource: getRestResource,
    getPatientTestObsByConceptUuId: getPatientTestObsByConceptUuId,
    postAllObsToAMRS: postAllObsToAMRS,
    postObsToAMRS: postObsToAMRS,
    getAmrsPatientObsByDate: getAmrsPatientObsByDate,
    getPatientTodaysTestObsByPatientUuId: getPatientTodaysTestObsByPatientUuId
  }
} ();
