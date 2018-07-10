'use strict';
const Promise                  = require("bluebird");
const Moment                   = require('moment');
const _                        = require('lodash');
const programsConfig           = require('./patient-program-config');
const programVisits            = require('./program-visit-types.service');
const programValidationService = require('./program-enrollment.service');


var serviceDefinition = {
  getAllProgramsConfig             : getAllProgramsConfig,
  getPatientProgramEnrollmentVisits: getPatientProgramEnrollmentVisits,
  validateEnrollmentOptions        : validateEnrollmentOptions
};

module.exports = serviceDefinition;

function getAllProgramsConfig () {
  return JSON.parse(JSON.stringify(programsConfig));
}

function getPatientProgramEnrollmentVisits (patientUuid, programUuid,
                                            enrollmentUuid, intendedVisitLocationUuid) {
  var clone = getAllProgramsConfig();
  return programVisits.getPatientVisitTypes(patientUuid, programUuid,
    enrollmentUuid, intendedVisitLocationUuid || '', clone);
}

function validateEnrollmentOptions (patient) {
  var clone = getAllProgramsConfig();
  return programValidationService.validateEnrollmentOptions(patient, clone);
}
