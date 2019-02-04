const dao = require('../etl-dao');
const Promise = require("bluebird");
const _ = require('lodash');
const oncologyReportsService = require('../oncology-reports/oncology-reports-service');
import {
    MultiDatasetReport
} from '../app/reporting-framework/multi-dataset.report';
import {
    BaseMysqlReport
} from '../app/reporting-framework/base-mysql.report';
import { 
    PatientlistMysqlReport 
} from '../app/reporting-framework/patientlist-mysql.report';
export class CervicalCancerMonthlySummaryService {

    getAggregateReport(reportParams) {
        return new Promise(function (resolve, reject) {
            let report;

            if (reportParams.requestParams.period === 'daily') {
                report = new BaseMysqlReport('cervicalCancerDailySummaryAggregate', reportParams.requestParams);
            } else if (reportParams.requestParams.period === 'monthly') {
                report = new BaseMysqlReport('cervicalCancerMonthlySummaryAggregate', reportParams.requestParams);
            }

            Promise.join(report.generateReport(),
                (results) => {
                    let result =results.results.results;
                    results.size =result?result.length:0;
                    results.result=result;                    
                    delete results['results'];
                    resolve(results);
                    //TODO Do some post processing
                }).catch((errors) => {
                    reject(errors);
                });
        });
    }
    getPatientListReport(reportParams) {

        let indicators = reportParams.indicators ? reportParams.indicators.split(',') : [];
        if(reportParams.locationUuids){
            let locationUuids = reportParams.locationUuids ? reportParams.locationUuids.split(',') : [];
            reportParams.locationUuids = locationUuids;

        }
        if(reportParams.genders){
            let genders = reportParams.genders ? reportParams.genders.split(',') : [];
            reportParams.genders = genders;

        }
        let report = new  PatientlistMysqlReport('cervicalCancerMonthlySummaryAggregate', reportParams);
        

        return new Promise(function (resolve, reject) {
            //TODO: Do some pre processing
            Promise.join(report.generatePatientListReport(indicators),
                (results) => {
                    oncologyReportsService.getPatientListCols(reportParams.indicators,'cad71628-692c-4d8f-8dac-b2e20bece27f')
                    .then((patientListCols) => {
                        results['patientListCols'] = patientListCols;
                        resolve(results);
                    })
                    .catch((error) => {
                       console.error('ERROR: Error getting patient list cols', error);
                       reject(error);
                    });
                }).catch((errors) => {
                    console.log('Error', errors);
                    reject(errors);
                });
        });

    }

}