'use strict';

const _ = require('lodash');
const Promise = require('bluebird');
const programsConfig = require('./patient-program-config');
const programVisitTypes = require('./program-visit-types.service');
const programValidationService = require('./program-enrollment.service');

const serviceDefinition = {
  getAllProgramsConfig: getAllProgramsConfig,
  getPatientProgramEnrollmentVisits: getPatientProgramEnrollmentVisits,
  validateEnrollmentOptions: validateEnrollmentOptions,
  getPatientProgramVisits: getPatientProgramVisits
};

module.exports = serviceDefinition;

function getAllProgramsConfig() {
  return JSON.parse(JSON.stringify(programsConfig));
}

function getPatientProgramEnrollmentVisits(
  patientUuid, programUuid, enrollmentUuid,
  intendedVisitLocationUuid) {

  const clone = getAllProgramsConfig();

  return programVisitTypes.getPatientVisitTypes(
    patientUuid, programUuid, enrollmentUuid, intendedVisitLocationUuid || '', clone
  );
}

function validateEnrollmentOptions (patient) {
  const clone = getAllProgramsConfig();
  return programValidationService.validateEnrollmentOptions(patient, clone);
}

function getPatientProgramVisits(patientUuid, programUuid, enrollment, locationUuid) {
  return new Promise(function (success, error) {
    getPatientProgramEnrollmentVisits(
      patientUuid, programUuid, enrollment, locationUuid
    ).then((programVisits) => {
      success(programVisits);
    }).catch((err) => {
      console.error('Error fetching program enrollment visits: ', err);
      error(err);
    });
  });
}
