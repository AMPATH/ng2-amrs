const Promise = require('bluebird');

const patientService = require('../service/openmrs-rest/patient.service.js');
const programService = require('../service/openmrs-rest/program.service');
const etlHivSummary = require('../dao/patient/etl-patient-hiv-summary-dao');
const encounterService = require('../service/openmrs-rest/encounter');
const dcPatientvisitEvaluator = require('../service/dc-patient-visit-evaluator');
var _ = require('underscore');

const availableKeys = {
  patient: getPatient,
  dummyPatient: getPatient,
  enrollment: getProgramEnrollment,
  hivLastTenClinicalEncounters: gethivLastTenClinicalEncounters,
  hivLastEncounter: getPatientLastEncounter,
  patientEnrollment: getPatientEnrollement,
  patientEncounters: getPatientEncounters,
  isPatientTransferredOut: checkTransferOut,
  dcQualifedVisits: getQualifiedDcVisits
};

const def = {
  getPatient: getPatient,
  getProgramEnrollment: getProgramEnrollment,
  gethivLastTenClinicalEncounters: gethivLastTenClinicalEncounters,
  getAllDataDependencies: getAllDataDependencies,
  availableKeys: availableKeys,
  getPatientLastEncounter: getPatientLastEncounter,
  getPatientEncounters: getPatientEncounters,
  checkTransferOut: checkTransferOut,
  dcQualifedVisits: getQualifiedDcVisits
};

module.exports = def;

function getAllDataDependencies(dataDependenciesKeys, patientUuid, params) {
  return new Promise((success, error) => {
    const dataObject = {};
    Promise.reduce(
      dataDependenciesKeys,
      function (previous, key) {
        return availableKeys[key](patientUuid, params)
          .then(function (data) {
            dataObject[key] = data;
          })
          .catch(function (err) {
            dataObject[key] = {
              error: 'An error occured',
              detail: err
            };
          });
      },
      0
    )
      .then(function (data) {
        success(dataObject);
      })
      .catch(function (err) {
        error(err);
      });
  });
}

function getPatient(patientUuid, params) {
  return new Promise((resolve, reject) => {
    patientService
      .getPatientByUuid(patientUuid, { rep: 'full' })
      .then((patient) => {
        resolve(patient);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getProgramEnrollment(patientUuid, params) {
  return new Promise((resolve, reject) => {
    programService
      .getProgramEnrollmentByUuid(params.programEnrollmentUuid, {
        rep:
          'custom:(uuid,display,voided,dateEnrolled,dateCompleted,location,' +
          'program:(uuid),states:(uuid,startDate,endDate,state:(uuid,initial,terminal,' +
          'concept:(uuid,display))))'
      })
      .then((enrollment) => {
        resolve(enrollment);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function checkTransferOut(patientUuid, params) {
  return new Promise((resolve, reject) => {
    getPatientEncounters(patientUuid)
      .then((encounters) => {
        if (
          _.last(encounters).encounterType.uuid ===
          'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33'
        ) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getPatientEncounters(patientUuid) {
  const patientEncounters = encounterService.getPatientEncounters({
    patientUuid,
    v: 'custom:(encounterDatetime,encounterType:(uuid,display))'
  });

  return new Promise((resolve, reject) => {
    patientEncounters
      .then((encounters) => {
        resolve(encounters);
      })
      .catch((e) => {
        console.error('An error occurred fetching encounters: ', e);
        reject(e);
      });
  });
}

function gethivLastTenClinicalEncounters(patientUuid, params) {
  return new Promise((resolve, reject) => {
    etlHivSummary
      .getPatientHivSummary(patientUuid, true, {}, 0, 10)
      .then((response) => {
        resolve(response.result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getPatientLastEncounter(patientUuid) {
  return new Promise((resolve, reject) => {
    etlHivSummary
      .getPatientLastEncounter(patientUuid)
      .then((response) => {
        resolve(response.result[0]);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getPatientEnrollement(patientUuid, params) {
  return new Promise((resolve, reject) => {
    programService
      .getProgramEnrollmentByPatientUuid(patientUuid, params)
      .then((response) => {
        resolve(response.results);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

function getQualifiedDcVisits(patientUuid) {
  return new Promise((resolve, reject) => {
    dcPatientvisitEvaluator
      .getPatientQualifiedDcVisits(patientUuid)
      .then((result) => {
        resolve(result.result[0]);
      });
  });
}
