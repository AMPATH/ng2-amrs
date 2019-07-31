'use strict';

const _ = require('lodash');
const Boom = require('boom');
const Promise = require('bluebird');
const programsConfig = require('./patient-program-config');
const programVisitTypes = require('./program-visit-types.service');
const programValidationService = require('./program-enrollment.service');
const initialEncounters = require('../dao/patient/etl-patient-initial-encounters-dao');

const serviceDefinition = {
  getAllProgramsConfig: getAllProgramsConfig,
  getPatientProgramEnrollmentVisits: getPatientProgramEnrollmentVisits,
  validateEnrollmentOptions: validateEnrollmentOptions,
  getPatientProgramVisits: getPatientProgramVisits
};

module.exports = serviceDefinition;

function getAllProgramsConfig () {
  return JSON.parse(JSON.stringify(programsConfig));
}

function getPatientProgramEnrollmentVisits(
  patientUuid, programUuid, enrollmentUuid,
  intendedVisitLocationUuid, initialVisit
) {
  const clone = getAllProgramsConfig();

  return programVisitTypes.getPatientVisitTypes(
    patientUuid, programUuid,
    enrollmentUuid, intendedVisitLocationUuid || '', clone, initialVisit
  );
}

function validateEnrollmentOptions (patient) {
  const clone = getAllProgramsConfig();
  return programValidationService.validateEnrollmentOptions(patient, clone);
}


function getPatientProgramVisits(patientUuid, programUuid, enrollment, locationUuid) {
  return new Promise(function (success, error) {
    let initialVisit = false;

    if (programUuid === '781d897a-1359-11df-a1f1-0026b9348838') {
      // only count initial visits for PMTCT
      initialEncounters.getPatientInitialEncounters(patientUuid)
        .then((result) => {
          if (result.length > 0) {
            if (result[0].initial_encounters > 0) {
              initialVisit = true;
            } else {
              initialVisit = false;
            }   
          } else {
            initialVisit = false;
          }
          
          getPatientProgramEnrollmentVisits(
            patientUuid, programUuid, enrollment, locationUuid, initialVisit
          )
            .then((programVisits) => {
              success(programVisits);
            })
            .catch((err) => {
              error(Boom.badImplementation('An internal error occurred'));
            });
        })
        .catch((err) => {
          Error('Error fetching initial encounters: ', err);
        });
    } else {
      getPatientProgramEnrollmentVisits(
        patientUuid, programUuid, enrollment, locationUuid, initialVisit
      )
        .then((programVisits) => {
          success(programVisits);
        })
        .catch((err) => {
          console.error('ERROR: ', err);
          error(err);
        })
    }
  });
}
