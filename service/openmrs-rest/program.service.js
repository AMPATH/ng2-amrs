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
    getProgramEnrollmentByUuid: getProgramEnrollmentByUuid
};

module.exports = serviceDefinition;

function getProgramEnrollmentByUuid(enrollmentUuid, params) {
    var endPoint = '/ws/rest/v1/programenrollment/' + enrollmentUuid;

    var requestParam = {
        v: params.rep || undefined
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
