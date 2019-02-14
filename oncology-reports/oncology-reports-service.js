'use strict';
const _ = require('lodash');

const oncologyReportsConfig = require('./oncology-reports-config.json');
const oncologyPatientListCols = require('./oncology-patient-list-cols.json');

var serviceDefinition = {
    getOncologyReports: getOncologyReports,
    getSpecificOncologyReport: getSpecificOncologyReport,
    getPatientListCols: getPatientListCols
};

module.exports = serviceDefinition;

function getOncologyReports() {
    return new Promise(function (resolve, reject) {
        resolve(JSON.parse(JSON.stringify(oncologyReportsConfig)));
    });
}
function getSpecificOncologyReport(reportUuid){

    let specificReport = [];

    return new Promise(function (resolve, reject) {

        _.each(oncologyReportsConfig, (report) => {
            let programUuid = report.uuid;
            if (programUuid === reportUuid) {
                specificReport = report;
            }
        });

        resolve(specificReport);

    });
}

function getPatientListCols(indicator,programUuid){

    let patientCols = [];
    let specificReport  = oncologyPatientListCols[programUuid];
    return new Promise((resolve, reject) => {

    _.each(specificReport, (report) => {
            _.each(report,(programReport) => {
                let reportIndicator = programReport.indicator;
                if(reportIndicator === indicator){
                   let patientListCols = programReport.patientListCols
                   patientCols = patientListCols;
                   
                }
          });
         
    });

    resolve(patientCols);

    });

}
