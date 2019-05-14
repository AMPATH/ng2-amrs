var Promise = require('bluebird');
var _ = require('underscore');

var patientService = require('../service/openmrs-rest/patient.service.js');
var programService = require('../service/openmrs-rest/program.service');
var etlHivSummary = require('../dao/patient/etl-patient-hiv-summary-dao');

var availableKeys = {
    'patient': getPatient,
    'dummyPatient': getPatient,
    'enrollment': getProgramEnrollment,
    'hivLastTenClinicalEncounters': gethivLastTenClinicalEncounters,
    'hivLastEncounter': getPatientLastEncounter,
    'patientEnrollment': getPatientEnrollement
};

var def = {
    getPatient: getPatient,
    getProgramEnrollment: getProgramEnrollment,
    gethivLastTenClinicalEncounters: gethivLastTenClinicalEncounters,
    getAllDataDependencies: getAllDataDependencies,
    availableKeys: availableKeys,
    getPatientLastEncounter: getPatientLastEncounter
};

module.exports = def;

function getAllDataDependencies(dataDependenciesKeys,
    patientUuid, params) {
    return new Promise(function (success, error) {
        var dataObject = {};
        Promise.reduce(dataDependenciesKeys,
            function (previous, key) {

                return availableKeys[key](patientUuid, params)
                    .then(function (data) {
                        dataObject[key] = data;
                    })
                    .catch(function (err) {
                        dataObject[key] =
                            {
                                error: 'An error occured',
                                detail: err
                            };
                    });

            }, 0)
            .then(function (data) {
                success(dataObject);
            })
            .catch(function (err) {
                error(err);
            });
    });
}

function getPatient(patientUuid, params) {
    return new Promise(
        function (resolve, reject) {
            patientService.getPatientByUuid(patientUuid, { rep: 'full' })
                .then(function (patient) {
                    resolve(patient);
                })
                .catch(function (error) {
                    reject(error);
                });
        }
    );
}

function getProgramEnrollment(patientUuid, params) {

    return new Promise(
        function (resolve, reject) {
            programService.getProgramEnrollmentByUuid(params.programEnrollmentUuid,
                { rep: 'custom:(uuid,display,voided,dateEnrolled,dateCompleted,location,' +
                'program:(uuid),states:(uuid,startDate,endDate,state:(uuid,initial,terminal,' +
                'concept:(uuid,display))))' })
                .then(function (enrollment) {
                    resolve(enrollment);
                })
                .catch(function (error) {
                    reject(error);
                });
        }
    );

}

function gethivLastTenClinicalEncounters(patientUuid, params) {
    return new Promise(
        function (resolve, reject) {
            etlHivSummary.getPatientHivSummary(patientUuid, true, {}, 0, 10)
                .then(function (response) {
                    resolve(response.result);
                })
                .catch(function (error) {
                    reject(error);
                });
        }
    );
}

function getPatientLastEncounter(patientUuid) {
    return new Promise(
        function (resolve, reject) {
            etlHivSummary.getPatientLastEncounter(patientUuid)
                .then(function (response) {
                    resolve(response.result[0]);
                })
                .catch(function (error) {
                    reject(error);
                });
        }
    );
}

function getPatientEnrollement(patientUuid, params) {
    return new Promise(
        function (resolve, reject) {
            programService.getProgramEnrollmentByPatientUuid(patientUuid, params)
                .then(function (response) {
                    resolve(response.results);
                })
                .catch(function (error) {
                    reject(error);
                });
        }
    );
}