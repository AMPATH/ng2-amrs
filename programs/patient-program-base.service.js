'use strict';
const Promise = require("bluebird");
const Moment = require('moment');
const _ = require('lodash');
const programsConfig = require('./program-visits-config');

var serviceDefinition = {
    getAllProgramsConfig: getAllProgramsConfig,
    getPatientPrograms: getPatientPrograms,
    getPatientProgram: getPatientProgram
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

function getPatientProgram(patientUuid, programUuid) {
    return new Promise((resolve, reject) => {
        resolve(programsConfig[programUuid])
    });
}
