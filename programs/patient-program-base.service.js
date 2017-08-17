'use strict';
const Promise = require("bluebird");
const Moment = require('moment');
const _ = require('lodash');
const programsConfig = require('./program-visits-config');
const programVisits = require('./program-visit-types.service');

var serviceDefinition = {
    getAllProgramsConfig: getAllProgramsConfig,
    getPatientProgramEnrollmentVisits: getPatientProgramEnrollmentVisits
};

module.exports = serviceDefinition;

function getAllProgramsConfig() {
    return programsConfig;
}

function getPatientProgramEnrollmentVisits(patientUuid, programUuid,
    enrollmentUuid, intendedVisitLocationUuid) {
    return programVisits.getPatientVisitTypes(patientUuid, programUuid,
        enrollmentUuid, intendedVisitLocationUuid || '', programsConfig);
}
