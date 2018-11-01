'use strict';
const Promise                  = require("bluebird");
const Moment                   = require('moment');
const _                        = require('lodash');
const programsConfig           = require('./patient-program-config');
const programVisits            = require('./program-visit-types.service');
const programValidationService = require('./program-enrollment.service');
const initialEncounters = require('../dao/patient/etl-patient-initial-encounters-dao');


var serviceDefinition = {
  getAllProgramsConfig             : getAllProgramsConfig,
  getPatientProgramEnrollmentVisits: getPatientProgramEnrollmentVisits,
  validateEnrollmentOptions        : validateEnrollmentOptions,
  getPatientProgramVisits : getPatientProgramVisits
};

module.exports = serviceDefinition;

function getAllProgramsConfig () {
  return JSON.parse(JSON.stringify(programsConfig));
}

function getPatientProgramEnrollmentVisits (patientUuid, programUuid,
                                            enrollmentUuid, intendedVisitLocationUuid, initialVisit) {
  var clone = getAllProgramsConfig();

    return programVisits.getPatientVisitTypes(patientUuid, programUuid,
      enrollmentUuid, intendedVisitLocationUuid || '', clone , initialVisit);


 
}

function validateEnrollmentOptions (patient) {
  var clone = getAllProgramsConfig();
  return programValidationService.validateEnrollmentOptions(patient, clone);
}

function getPatientProgramVisits(patientUuid, programUuid, enrollment, locationUuid){

  return new Promise(function (success, error) {

     let initialVisit = false;

      if (programUuid === '781d897a-1359-11df-a1f1-0026b9348838') {
        // only count initial visits for PMTC
        initialEncounters.getPatientInitialEncounters(patientUuid)
        .then(function (result) {

          console.log('getPatientInitialEncounters', result);

          let initialVisits

          if(result.length > 0){
            if(result[0].initial_encounters > 0){
              initialVisit = true;
            }else{
              initialVisit = false;
            }

          }else{
            initialVisit = false;
          }

            getPatientProgramEnrollmentVisits(patientUuid, programUuid, enrollment, locationUuid, 
                initialVisit)
            .then(function (programVisits) {
                success(programVisits);
            })
            .catch(function (error) {
                error(Boom.badImplementation('An internal error occurred'));
            })

        });

      } else {

        getPatientProgramEnrollmentVisits(patientUuid, programUuid, enrollment, locationUuid, 
          initialVisit)
          .then((programVisits) => {
              success(programVisits);
          })
          .catch((error) => {
              console.error('ERROR',error);
          })



      }

});

}
