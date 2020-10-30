(function () {
  var rp = require('request-promise');
  var _ = require('underscore');
  var Promise = require('bluebird');
  var config = require('../../conf/config');
  var requestConfig = require('../../request-config');

  var openmrsProtocal = config.openmrs.https ? 'https' : 'http';
  var appName = config.openmrs.applicationName || 'amrs';
  var openmrsBase =
    openmrsProtocal +
    '://' +
    config.openmrs.host +
    ':' +
    config.openmrs.port +
    '/' +
    appName;

  function getPatientEncounters(params) {
    if (_.isUndefined(params)) {
      throw new Error('At least one argument should be passed');
    }

    var _customDefaultRep =
      'custom:(uuid,encounterDatetime,' +
      'patient:(uuid,uuid),form:(uuid,name),location:ref,encounterType:ref,' +
      'encounterProviders:(provider:full,encounterRole:ref),' +
      'obs:(uuid,obsDatetime,concept:(uuid,name:(uuid,name)),value:ref,' +
      'groupMembers:(uuid,concept:(uuid,name:(uuid,name)),obsDatetime,value:ref)))';

    var endpoint = '/ws/rest/v1/encounter';

    // Create request param object
    var reqParams = {};

    if (!_.isUndefined(params) && typeof params === 'string') {
      var patientUuid = params;
      reqParams = {
        patient: patientUuid,
        v: _customDefaultRep,
        openmrsBaseUrl: openmrsBase
      };
    } else {
      if (_.isObject(params) && !_.isFunction(params) && !_.isArray(params)) {
        var v = params.rep || params.v;
        reqParams = {
          patient: params.patientUuid,
          v: v || _customDefaultRep,
          openmrsBaseUrl: params.openmrsBaseUrl || openmrsBase
        };
      } else {
        // Invalid object type passed
        throw new Error(
          'Error! function requires a string uuid or a ' +
            'parameter map passed, passed ' +
            params
        );
      }
    }

    return new Promise(function (resolve, reject) {
      requestConfig
        .getRequestPromise(
          {
            patient: reqParams.patient,
            v: reqParams.v
          },
          reqParams.openmrsBaseUrl + endpoint
        )
        .then(function (data) {
          resolve(data.results);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  }

  module.exports = {
    getPatientEncounters: getPatientEncounters
  };
})();
