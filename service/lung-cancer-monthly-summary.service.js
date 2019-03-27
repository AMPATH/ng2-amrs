const dao = require('../etl-dao');
const Promise = require("bluebird");
const _ = require('lodash');
const oncologyReportsService = require('../oncology-reports/oncology-reports-service');
import {
    BaseMysqlReport
} from '../app/reporting-framework/base-mysql.report';
import { 
    PatientlistMysqlReport 
} from '../app/reporting-framework/patientlist-mysql.report';
export class LungCancerMonthlySummaryService {

    getAggregateReport(reportParams) {
        return new Promise(function (resolve, reject) {
            let report;
            
            if (reportParams.requestParams.period === 'daily') {
                report = new BaseMysqlReport('lungCancerDailySummaryAggregate', reportParams.requestParams);                
            } else if (reportParams.requestParams.period === 'monthly') {
                report = new BaseMysqlReport('lungCancerMonthlySummaryAggregate', reportParams.requestParams);                
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
       
        let report = new  PatientlistMysqlReport('lungCancerMonthlySummaryAggregate', reportParams);
        

        return new Promise(function (resolve, reject) {
            //TODO: Do some pre processing
            Promise.join(report.generatePatientListReport(indicators),
                (results) => {
                    oncologyReportsService.getPatientListCols(reportParams.indicators,'b2db2bdf-67e9-42c5-858c-c7e435742ef5')
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