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
        getPatientByIdentifier: getPatientByIdentifier,
        getPatientUuidsByIdentifiers: getPatientUuidsByIdentifiers
    };

    function getPatientByIdentifier(params) {
        var endPoint = '/ws/rest/v1/patient';

        var requestParam = {
            q: params.q,
            v: params.rep || 'ref'
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
        var promises = [];
        _.each(identifiersArray, function(id){
            promises.push(_getPatientUuidByIdentifier(id, baseUrl));
        });
        return Promise.all(promises);
    }

    function _getPatientUuidByIdentifier(identifier, baseUrl) {
        var param = {
            q: identifier,
            openmrsBaseUrl: baseUrl
        };
        return new Promise(function (resolve, reject) {
            getPatientByIdentifier(param)
                .then(function (response) {
                    resolve(
                        {
                            identifier: identifier,
                            patientUuid: response.length > 0 ? response[0].uuid : ''
                        }
                    );
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

