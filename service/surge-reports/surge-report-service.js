const Promise = require('bluebird');
var helpers = require('../../etl-helpers');
import {
    BaseMysqlReport
} from '../../app/reporting-framework/base-mysql.report';
import {
    PatientlistMysqlReport
} from '../../app/reporting-framework/patientlist-mysql.report';
const reportSections = require('../../service/surge-reports/surge-report.json');


export class SurgeReportService {

    getAggregateReport(reportParams) {
        if (reportParams.locationUuids) {
            let locationUuids = reportParams.locationUuids ? reportParams.locationUuids.split(',') : [];
            reportParams.locationUuids = locationUuids;

        }
        return new Promise(function (resolve, reject) {
            let report = new BaseMysqlReport('surgeReport', reportParams);
            Promise.join(report.generateReport(),
                (results) => {
                    let result = results.results.results;
                    results.size = result ? result.length : 0;
                    results.result = result;
                    results.sectionDefinitions = reportSections;
                    delete results['results'];
                    resolve(results);
                }).catch((errors) => {
                    console.error('Error', errors);
                    reject(errors);
                });
        });
    }

    getPatientListReport(reportParams) {
        let indicators = reportParams.indicators ? reportParams.indicators.split(',') : [];
        if (reportParams.locationUuids) {
            let locationUuids = reportParams.locationUuids ? reportParams.locationUuids.split(',') : [];
            reportParams.locationUuids = locationUuids;

        }
        let report = new PatientlistMysqlReport('surgeReport', reportParams);
        return new Promise(function (resolve, reject) {
            Promise.join(report.generatePatientListReport(indicators),
                (results) => {
                    results.results.results.forEach((element) => {
                        if (element.cur_meds) {
                            element.cur_meds = helpers.getARVNames(element.cur_meds);
                        }
                        if (element.arv_first_regimen) {
                            element.arv_first_regimen = helpers.getARVNames(element.arv_first_regimen);
                        }
                    })
                    resolve(results);
                }).catch((errors) => {
                    console.error('Error', errors);
                    reject(errors);
                });
        });
    }
}