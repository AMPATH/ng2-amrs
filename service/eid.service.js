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
  , etlLogger = require('../etl-file-logger')
  , db = require('../etl-db')
  , isReachable = require('is-reachable')
  , eidResultsSchema = require('../eid-lab-results');

module.exports = {

  getSynchronizedPatientLabResults: getSynchronizedPatientLabResults,
  getEIDTestResultsByPatientIdentifier: getEIDTestResultsByPatientIdentifier,
  saveEidSyncLog: saveEidSyncLog,
  updateEidSyncLog: updateEidSyncLog,
  getViralLoadTestResultsByPatientIdentifier: getViralLoadTestResultsByPatientIdentifier,
  getCd4TestResultsByPatientIdentifier: getCd4TestResultsByPatientIdentifier,
  getPcrTestResultsByPatientIdentifier: getPcrTestResultsByPatientIdentifier,
  getResource: getResource,
  getCd4Resource: getCd4Resource
}

function listReachableServers() {

  var protomatch = /^(https?):\/\//;

  var locations = config.eid.locations;

  _.each(locations, function(location) {
    location.ip = location.host.replace(protomatch, '');
  });

  var reachable_servers = [];

  return Promise.reduce(locations, function(previous, row) {

    return new Promise(function(resolve, reject) {
      isReachable(row.ip, function(err, reachable) {
        if(reachable) reachable_servers.push(row); //[row.name] = true;
        resolve(reachable_servers);
      });
    });
  }, 0);
}

function getSynchronizedPatientLabResults(patientUuId) {

  var results = {
    data: [],
    errors: []
  }

  return listReachableServers()
    .then(function(reachable) {
      return Promise.reduce(reachable, function(previous, row) {

        return _getSynchronizedPatientLabResults(row, patientUuId)
          .then(function(obj) {
            results.data.push(obj);

            return new Promise(function(resolve, reject) {
              resolve(results);
            })
          })
          .catch(function(error) {

            //catch errors and continue
            results.errors.push(error);
            return new Promise(function(resolve, reject) {
              resolve(results);
            })
          });
      }, 0)
        .then(function(data) {
          return new Promise(function(resolve, reject) {
            resolve(results);
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
      site: server.name
    }
  ];

  return obsService.getPatientIdentifiers(patientUuId)
    .then(function(response) {
      return getEIDTestResultsByPatientIdentifier(response.identifiers, server);
    })
    .then(function(testResultsResponse) {

      mergedEidResults = testResultsResponse;

      return obsService.getPatientAllTestObsByPatientUuId(patientUuId);
    })
    .then(function(obsResponse) {

      var missingResult = comparison.findAllMissingEidResults(mergedEidResults, obsResponse);
      return obsService.postAllObsToAMRS(missingResult, patientUuId);
    })
    .then(function(postResponse) {

      fields[0].status = 0;

      return saveEidSyncLog(table, fields);
    })
    .then(function() {

      return new Promise(function(resolve, reject) {
        resolve({
          uuid: patientUuId,
          site: server.name
        });
      });
    }).catch(function(err) {

      return new Promise(function(resolve, reject) {

        var err_msg = err.message;

        if(err_msg.indexOf("Object with given uuid doesn't exist") != -1)
          err_msg = "Object with given uuid doesn't exist";
        else if(err_msg.indexOf('Unable to convert object into response content') != -1)
          err_msg = 'Unable to convert object into response content';

        //log error
        etlLogger.logger(config.logging.eidPath + '/' + config.logging.eidFile).error('sync failure: %s', err.message);

        fields[0].status = 1;
        fields[0].message = err_msg.substring( 0, 100 );

        //save error to eid_sync_log
        saveEidSyncLog(table, fields)
          .then(function(resp) {
            reject({
              uuid: patientUuId,
              message: err_msg,
              site: server.name
            });
          })
          .catch(function(err) {
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

  return new Promise(function(resolve, reject) {

    getViralLoadTestResultsByPatientIdentifier(patientIdentifier, conf.host, conf.generalApiKey)
      .then(function(response) {

        if(response.posts instanceof Array) {
          _.each(response.posts, function(row) {
            results.viralLoad.push(row);
          });
        } else
          results[location_name].viralLoadErrorMsg = response;

        return getPcrTestResultsByPatientIdentifier(patientIdentifier, conf.host, conf.generalApiKey);
      }).then(function(response) {

        if(response.posts instanceof Array) {

          _.each(response.posts, function(row) {
            results.pcr.push(row);
          });
        } else
          results[location_name].pcrErrorMsg = response;

        if(conf.loadCd4)
          return getCd4TestResultsByPatientIdentifier(patientIdentifier, conf.host, conf.cd4ApiKey);
        else {

          resolve(results);
        }
      })
      .then(function(response) {
        if(response.posts instanceof Array) {

          _.each(response.posts, function(row) {
            results.cd4Panel.push(row);
          });

        } else
          results[location_name].cd4ErrorMsg = response;

          resolve(results);
      })
      .catch(function(err) {

        reject({
          message: err.message,
          results: results,
          uuid: patientIdentifier
        });
      });
  });
}

function getViralLoadTestResultsByPatientIdentifier(patientIdentifier,host,key) {

  var resource = getResource(host,key);
  var queryString = resource.query;
  queryString.patientID = patientIdentifier;
  queryString.test = 2;

  return rp.getRequestPromise(queryString, resource.uri);
}

function getPcrTestResultsByPatientIdentifier(patientIdentifier, host, key) {

  var resource = getResource(host, key);
  var queryString = resource.query;
  queryString.patientID = patientIdentifier;
  queryString.test = 1;
  return rp.getRequestPromise(queryString, resource.uri);
}

function getCd4TestResultsByPatientIdentifier(patientIdentifier, host, key) {

  var startDate = moment(new Date('2004-01-01')).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
  var endDate = moment(new Date()).startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSSZZ');
  var resource = getCd4Resource(host,key);
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
  db.updateQueryServer(queryParts, function(result) {
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
