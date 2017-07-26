'use strict';
const Promise = require("bluebird");
const Moment = require('moment');
const _ = require('lodash');
const programsConfig = require('./program-visits-config');
const programVisits = require('./program-visit-types.service');

var serviceDefinition = {
    getAllProgramsConfig: getAllProgramsConfig,
    getPatientPrograms: getPatientPrograms,
    getPatientProgram: getPatientProgram,
    getPatientProgramEnrollmentVisits: getPatientProgramEnrollmentVisits
};

module.exports = serviceDefinition;

function getAllProgramsConfig() {
    return programsConfig;
}

function getPatientPrograms(patientUuid) {
    return new Promise((resolve, reject) => {
        resolve(programsConfig)
    });
}

//obsolete! use get patientEnrollmentVisits
function getPatientProgram(patientUuid, programUuid) {
    return new Promise((resolve, reject) => {
        resolve(programsConfig[programUuid])
    });
}

function getPatientProgramEnrollmentVisits(patientUuid, programUuid,
    enrollmentUuid, intendedVisitLocationUuid) {
    return programVisits.getPatientVisitTypes(patientUuid, programUuid,
        enrollmentUuid, intendedVisitLocationUuid || '', programsConfig);
}
