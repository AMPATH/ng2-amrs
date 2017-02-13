/*jshint -W003, -W097, -W117, -W026 */
'use strict';

var
  Promise = require('bluebird')
  , _ = require('underscore')
  , http = require('http')
  , https = require('https')
  , Promise = require('bluebird')
  , rp = require('../request-config')
  , config = require('../conf/config')
  , moment = require('moment')
  , comparison = require('../eid-obs-compare')
  , obsService = require('./openmrs-rest/obs.service')
  , patientService = require('./openmrs-rest/patient.service')
  , etlLogger = require('../etl-file-logger')
  , db = require('../etl-db')
  , curl = require('curlrequest')
  , eidResultsSchema = require('../eid-lab-results');

var definition = {
  getSynchronizedPatientLabResults: getSynchronizedPatientLabResults,
  getEIDTestResultsByPatientIdentifier: getEIDTestResultsByPatientIdentifier,
  saveEidSyncLog: saveEidSyncLog,
  updateEidSyncLog: updateEidSyncLog,
  getViralLoadTestResultsByPatientIdentifier: getViralLoadTestResultsByPatientIdentifier,
  getCd4TestResultsByPatientIdentifier: getCd4TestResultsByPatientIdentifier,
  getPcrTestResultsByPatientIdentifier: getPcrTestResultsByPatientIdentifier,
  getResource: getResource,
  getCd4Resource: getCd4Resource,
  getEidViralLoadResults: getEidViralLoadResults,
  getEidDnaPcrResults: getEidDnaPcrResults,
  getEidCD4Results: getEidCD4Results,
  getAllEidResultsByType: getAllEidResultsByType,
  getAllEidResults: getAllEidResults,
  getAllEidResultsFromAllSites: getAllEidResultsFromAllSites,
  getAvailableLabServers: listReachableServers,
  getPatientsWithEidResults: getPatientsWithEidResults,
  getPatientIdentifiersFromEIDResults: getPatientIdentifiersFromEIDResults
};

module.exports = definition;

function getPatientIdentifiersFromEIDResults(startDate, endDate) {
  return new Promise(function (resolve, reject) {

    definition.getAllEidResultsFromAllSites(startDate, endDate)
      .then(function (labResults) {
        var ids = _extractPatientIdentifiersFromResults(labResults);

        resolve(ids);
      })
      .catch(function (error) {
        reject(error);
      });

  });
}

function getPatientsWithEidResults(startDate, endDate) {
  return new Promise(function (resolve, reject) {

    definition.getAllEidResultsFromAllSites(startDate, endDate)
      .then(function (labResults) {
        var ids = _extractPatientIdentifiersFromResults(labResults);

        patientService.getPatientUuidsByIdentifiers(ids)
          .then(function (patientUuids) {
            var uuids = [];
            _.each(patientUuids, function (patient) {
              if (patient.patientUuid) {
                uuids.push(patient.patientUuid);
              }
            });

            resolve(uuids);
          })
          .catch(function (error) {
            reject(error);
          });
      })
      .catch(function (error) {
        reject(error);
      });

  });
}

function _extractPatientIdentifiersFromResults(labResults) {
  var identifiers = [];

  var uniqueIds = {};

  var allResults = [];

  _.each(labResults, function (result) {
    if (result.viralLoad)
      allResults = allResults.concat(result.viralLoad.posts);

    if (result.cd4)
      allResults = allResults.concat(result.cd4.posts);

    if (result.dnaPcr)
      allResults = allResults.concat(result.dnaPcr.posts);

  });

  _.each(allResults, function (result) {
    if (result.SampleStatus === 'Complete') {
      uniqueIds[result.PatientID] = result.PatientID;
    }
  });

  _.each(uniqueIds, function (id) {
    identifiers.push(id);
  });

  return identifiers;
}

function getAllEidResultsFromAllSites(startDate, endDate) {
  return new Promise(function (resolve, reject) {
    definition.getAvailableLabServers()
      .then(function (servers) {
        var resultsByLab = [];
        Promise.reduce(servers, function (previousServer, server) {
          return new Promise(function (resolve, reject) {

            definition.getAllEidResults(server, startDate, endDate)
              .then(function (response) {
                response.lab = server.name;
                resultsByLab.push(response);
                resolve(resultsByLab);
              })
              .catch(function (error) {
                // catch errors and continue
                var response = {
                  lab: server.name,
                  error: error
                };

                resultsByLab.push(response);
                resolve(resultsByLab);
              });
          });

        }, 0)
          .then(function (results) {
            resolve(results);
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

function getAllEidResults(server, startDate, endDate) {
  var results = {
    viralLoad: { posts: [] },
    cd4: { posts: [] },
    dnaPcr: { posts: [] }
  };

  return new Promise(function (resolve, reject) {
    _getEidResultsPerTypeDisregardingErrors(server.host, server.generalApiKey, startDate, endDate,
      definition.getEidViralLoadResults)
      .then(function (viralLoad) {
        results.viralLoad = viralLoad;
        return _getEidResultsPerTypeDisregardingErrors(server.host, server.cd4ApiKey, startDate, endDate,
          definition.getEidCD4Results);
      })
      .then(function (cd4) {
        results.cd4 = cd4;
        return _getEidResultsPerTypeDisregardingErrors(server.host, server.generalApiKey, startDate, endDate,
          definition.getEidDnaPcrResults);
      })
      .then(function (dnaPcr) {
        results.dnaPcr = dnaPcr;
        resolve(results);
      });
  });
}

function _getEidResultsPerTypeDisregardingErrors(host, apikey, startDate, endDate,
  fetchingFunc) {
  return new Promise(function (resolve, reject) {
    getAllEidResultsByType(host, apikey, startDate, endDate, fetchingFunc)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        resolve({ posts: [], error: error });
      });
  });
}

function getAllEidResultsByType(host, apikey, startDate, endDate, fetchingFunc) {
  var page = 0;
  var results = {
    posts: []
  };
  return new Promise(function (resolve, reject) {
    _increamentPageAndGetAllEidResultsByType(host, apikey, startDate, endDate, fetchingFunc,
      page, results, resolve, reject);
  });
}

function _getAllEidResultsByType(host, apiKey, startDate, endDate, fetchingFunc,
  page, results, finalResolve, reject) {
  fetchingFunc(host, apiKey, startDate, endDate, page)
    .then(function (response) {
      if (response.posts.length > 0 && page <= 100) {
        results.posts = results.posts.concat(response.posts);
        _increamentPageAndGetAllEidResultsByType(host, apiKey, startDate, endDate, fetchingFunc,
          page, results, finalResolve, reject);
      } else {
        finalResolve(results);
      }
    })
    .catch(function (error) {
      reject(error);
    });
}

function _increamentPageAndGetAllEidResultsByType(host, apiKey, startDate, endDate,
  fetchingFunc, page, results, finalResolve, reject) {
  page = page + 1;
  _getAllEidResultsByType(host, apiKey, startDate, endDate,
    fetchingFunc, page, results, finalResolve, reject);
}

function getEidViralLoadResults(host, apiKey, startDate, endDate, page) {
  return new Promise(function (resolve, reject) {
    var resource = definition.getResource(host, apiKey);
    resource.query.page = page;
    resource.query.test = 2;

    if (!moment(startDate).isValid()) {
      reject('Invalid start date supplied', startDate);
    }

    if (!moment(endDate).isValid()) {
      reject('Invalid end date supplied', endDate);
    }

    if (resource.query.patientID) {
      delete resource.query.patientID;
    }

    resource.query.startDate = moment(startDate).format('YYYY-MM-DD');
    resource.query.endDate = moment(endDate).format('YYYY-MM-DD');
    rp.getRequestPromise(resource.query, resource.uri)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });

  });
}

function getEidDnaPcrResults(host, apiKey, startDate, endDate, page) {
  return new Promise(function (resolve, reject) {
    var resource = definition.getResource(host, apiKey);
    resource.query.page = page;
    resource.query.test = 1;

    if (!moment(startDate).isValid()) {
      reject('Invalid start date supplied', startDate);
    }

    if (!moment(endDate).isValid()) {
      reject('Invalid end date supplied', endDate);
    }

    if (resource.query.patientID) {
      delete resource.query.patientID;
    }

    resource.query.startDate = moment(startDate).format('YYYY-MM-DD');
    resource.query.endDate = moment(endDate).format('YYYY-MM-DD');

    rp.getRequestPromise(resource.query, resource.uri)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });

  });
}

function getEidCD4Results(host, apiKey, startDate, endDate, page) {
  return new Promise(function (resolve, reject) {
    var resource = definition.getCd4Resource(host, apiKey);
    resource.query.page = page;

    if (!moment(startDate).isValid()) {
      reject('Invalid start date supplied', startDate);
    }

    if (!moment(endDate).isValid()) {
      reject('Invalid end date supplied', endDate);
    }

    if (resource.query.patientID) {
      delete resource.query.patientID;
    }

    if (resource.query.test) {
      delete resource.query.test;
    }

    resource.query.startDate = moment(startDate).format('YYYY-MM-DD');
    resource.query.endDate = moment(endDate).format('YYYY-MM-DD');

    rp.getRequestPromise(resource.query, resource.uri)
      .then(function (response) {
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
      });

  });
}

function listReachableServers(filter_locations) {

  var locations = config.eid.locations;

  var reachable_servers = [];

  var port = config.eid.port;

  return Promise.reduce(locations, function (previous, row) {

    return new Promise(function (resolve, reject) {

      var url = row.host + '/' + port + '/eid/orders/api.php'

      curl.request({ url: url, pretend: true }, function (err, stdout, meta) {

        if (err) {
          resolve(reachable_servers);
        } else {

          if (filter_locations && filter_locations.length > 0) {

            if (_.indexOf(filter_locations, row.name) > -1)
              reachable_servers.push(row);
          } else {
            reachable_servers.push(row);
          }

          resolve(reachable_servers);
        }
      });
    });
  }, 0);
}

function getSynchronizedPatientLabResults(patientUuId, locations) {

  var results = {
    data: [],
    errors: []
  }

  return listReachableServers(locations)
    .then(function (reachable) {

      return new Promise(function (resolve, reject) {

        Promise.reduce(reachable, function (previous, row) {

          return _getSynchronizedPatientLabResults(row, patientUuId)
            .then(function (obj) {
              results.data.push(obj);

              return new Promise(function (resolve, reject) {
                resolve(results);
              })
            })
            .catch(function (error) {

              //catch errors and continue
              results.errors.push(error);
              return new Promise(function (resolve, reject) {
                resolve(results);
              })
            });
        }, 0)
          .then(function (data) {
            resolve(results);
          }).catch(function (error) {
            reject(error);
          });
      })
    });
}

function _getSynchronizedPatientLabResults(server, patientUuId) {

  var mergedEidResults = [];

  var table = eidResultsSchema.patientLabResultsSchema.table.schema + '.' + eidResultsSchema.patientLabResultsSchema.table.tableName;
  var fields = [
    {
      person_uuid: patientUuId,
      date_updated: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
      date_created: moment(new Date()).format('YYYY-MM-DDTHH:mm:ss.SSSZZ'),
      site: server.name,
      conflicts: null
    }
  ];

  return obsService.getPatientIdentifiers(patientUuId)
    .then(function (response) {
      return getEIDTestResultsByPatientIdentifier(response.identifiers, server);
    })
    .then(function (testResultsResponse) {

      mergedEidResults = testResultsResponse;
      return obsService.getPatientAllTestObsByPatientUuId(patientUuId);
    })
    .then(function (obsResponse) {
      var missingResult = comparison.findAllMissingEidResults(mergedEidResults, obsResponse);
      var conflicts =
        comparison.findConflictingEidAmrsViralLoadResults(mergedEidResults.viralLoad, obsResponse);
      if (conflicts.length > 0) {
        // console.log('conflicts', JSON.stringify(conflicts));
        fields[0].conflicts = JSON.stringify(conflicts);
      }

      return obsService.postAllObsToAMRS(missingResult, patientUuId);
    })
    .then(function (postResponse) {

      fields[0].status = 0;

      return saveEidSyncLog(table, fields);
    })
    .then(function () {

      return new Promise(function (resolve, reject) {
        resolve({
          uuid: patientUuId,
          site: server.name
        });
      });
    }).catch(function (err) {

      return new Promise(function (resolve, reject) {

        var err_msg = err.message;

        if (err_msg.indexOf("Object with given uuid doesn't exist") != -1)
          err_msg = "Object with given uuid doesn't exist";
        else if (err_msg.indexOf('Unable to convert object into response content') != -1)
          err_msg = 'Unable to convert object into response content';

        //log error
        etlLogger.logger(config.logging.eidPath + '/' + config.logging.eidFile).error('sync failure: %s', err.message);

        fields[0].status = 1;
        fields[0].message = err_msg.substring(0, 100);

        //save error to eid_sync_log
        saveEidSyncLog(table, fields)
          .then(function (resp) {
            reject({
              uuid: patientUuId,
              message: err_msg,
              site: server.name
            });
          })
          .catch(function (err) {
            reject({
              uuid: patientUuId,
              message: err_msg,
              site: server.name
            });
          });
      });
    });
}

function getEIDTestResultsByPatientIdentifier(patientIdentifier, server) {

  var results = {
    viralLoad: [],
    pcr: [],
    cd4Panel: []
  }

  var conf = server;

  results[server.name] = {};
  var location_name = server.name;

  return new Promise(function (resolve, reject) {

    getViralLoadTestResultsByPatientIdentifier(patientIdentifier, conf.host, conf.generalApiKey)
      .then(function (response) {

        if (response.posts instanceof Array) {
          _.each(response.posts, function (row) {

            etlLogger.logger(config.logging.eidPath + '/' + config.logging.eidFile).info('viral load result: %s', JSON.stringify(row));

            if (row && row.SampleStatus && ['Completed', 'Rejected', 'Complete'].indexOf(row.SampleStatus) != -1) {
              results.viralLoad.push(row);
            }
          });
        } else
          results[location_name].viralLoadErrorMsg = response;

        return getPcrTestResultsByPatientIdentifier(patientIdentifier, conf.host, conf.generalApiKey);
      }).then(function (response) {

        if (response.posts instanceof Array) {

          _.each(response.posts, function (row) {
            if (row && row.SampleStatus && ['Completed', 'Rejected', 'Complete'].indexOf(row.SampleStatus) != -1) {
              results.pcr.push(row);
            }
          });
        } else
          results[location_name].pcrErrorMsg = response;

        if (conf.loadCd4)
          return getCd4TestResultsByPatientIdentifier(patientIdentifier, conf.host, conf.cd4ApiKey);
        else {
          return new Promise(function (resolve, reject) {
            resolve({
              fetched: false,
              posts: []
            });
          });
        }
      })
      .then(function (response) {
        if (response.posts instanceof Array) {
          _.each(response.posts, function (row) {
            if (row && row.SampleStatus && ['Completed', 'Rejected', 'Complete'].indexOf(row.SampleStatus) != -1) {
              results.cd4Panel.push(row);
            }
          });

        } else
          results[location_name].cd4ErrorMsg = response;

        resolve(results);
      })
      .catch(function (err) {

        reject({
          message: err.message,
          results: results,
          uuid: patientIdentifier
        });
      });
  });
}

function getViralLoadTestResultsByPatientIdentifier(patientIdentifier, host, key) {

  var resource = definition.getResource(host, key);
  var queryString = resource.query;
  queryString.patientID = patientIdentifier;
  queryString.test = 2;

  return rp.getRequestPromise(queryString, resource.uri);
}

function getPcrTestResultsByPatientIdentifier(patientIdentifier, host, key) {
  var resource = definition.getResource(host, key);
  var queryString = resource.query;
  queryString.patientID = patientIdentifier;
  queryString.test = 1;
  return rp.getRequestPromise(queryString, resource.uri);
}

function getCd4TestResultsByPatientIdentifier(patientIdentifier, host, key) {

  var startDate = moment(new Date('2004-01-01')).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
  var endDate = moment(new Date()).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');

  var resource = definition.getCd4Resource(host, key);
  var queryString = resource.query;
  queryString.patientID = patientIdentifier;
  queryString.startDate = startDate;
  queryString.endDate = endDate;
  return rp.getRequestPromise(queryString, resource.uri);
}

function saveEidSyncLog(table, fields) {

  return db.saveRecord(table, fields);
}

function updateEidSyncLog(queryParts, callback) {
  db.updateQueryServer(queryParts, function (result) {
    callback(result);
  });
}

function getResource(host, apiKey) {

  var link = host + ':' + config.eid.port + config.eid.generalPath;

  var queryString = {
    apikey: apiKey
  }

  var resource = {
    uri: link,
    query: queryString
  }
  return resource;
};

function getCd4Resource(host, apiKey) {

  var link = host + ':' + config.eid.port + config.eid.cd4PanelPath;

  var queryString = {
    apikey: apiKey
  }

  var resource = {
    uri: link,
    query: queryString
  }
  return resource;
}
