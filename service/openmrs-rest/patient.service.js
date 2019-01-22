(function () {
    var rp = require('request-promise');
    var _ = require('underscore');
    var Promise = require('bluebird');
    var config = require("../../conf/config");
    var requestConfig = require('../../request-config');

    var openmrsProtocal = config.openmrs.https ? 'https' : 'http';
    var appName = config.openmrs.applicationName || 'amrs';
    var openmrsBase = openmrsProtocal + '://' + config.openmrs.host + ':'
        + config.openmrs.port + '/' + appName;

    var serviceDefinition = {
        getPatientByUuid: getPatientByUuid,
        getPatientByIdentifier: getPatientByIdentifier,
        getPatientUuidsByIdentifiers: getPatientUuidsByIdentifiers
    };

    function getPatientByUuid(patientUuid, params) {
        var endPoint = '/ws/rest/v1/patient/' + patientUuid;

        var requestParam = {
            v: params.rep || 'default'
        };

        var url = (params.openmrsBaseUrl || openmrsBase) + endPoint;

        return new Promise(function (resolve, reject) {
            requestConfig.getRequestPromise(requestParam, url)
                .then(function (data) {
                    resolve(data);
                })
                .catch(function (err) {
                    reject(err);
                });
        });

    }

    function getPatientByIdentifier(params) {
        var endPoint = '/ws/rest/v1/patient';

        var requestParam = {
            q: params.q,
            v: params.rep || 'default'
        };

        var url = (params.openmrsBaseUrl || openmrsBase) + endPoint;

        return new Promise(function (resolve, reject) {
            requestConfig.getRequestPromise(requestParam, url)
                .then(function (data) {
                    resolve(data.results);
                })
                .catch(function (err) {
                    reject(err);
                });
        });
    }

    function getPatientUuidsByIdentifiers(identifiersArray, baseUrl) {
        var results = [];
        return Promise.reduce(identifiersArray, function (previous, identifier) {
            return new Promise(function (resolve, reject) {
                _getPatientUuidByIdentifier(identifier, baseUrl)
                    .then(function (value) {
                        console.error(identifier + ' ' + value.patientUuid + ' reduced to', results.length);
                        if(value.patientUuid){
                            results.push(value);
                        }
                        resolve(results);
                    })
                    .catch(function (error) {
                        resolve(results);
                    });
            });
        }, 0);
    }


    function _getPatientUuidByIdentifier(identifier, baseUrl) {
        var param = {
            q: identifier,
            openmrsBaseUrl: baseUrl
        };
        return new Promise(function (resolve, reject) {
            getPatientByIdentifier(param)
                .then(function (response) {
                    if (Array.isArray(response)) {
                        resolve(
                            {
                                identifier: identifier,
                                patientUuid: response.length > 0 ? response[0].uuid : ''
                            }
                        );
                    } else {
                        throw ('Invalid response', response);
                    }
                })
                .catch(function (error) {
                    console.error('getPatientByIdentifier error', error);
                    resolve({
                        identifier: identifier,
                        hasError: true
                    });
                });

        });
    }

    module.exports = serviceDefinition;
})();

