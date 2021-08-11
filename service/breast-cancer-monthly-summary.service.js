const Promise = require('bluebird');

const _ = require('lodash');
const oncologyReportsService = require('../oncology-reports/oncology-reports-service');
import { BaseMysqlReport } from '../app/reporting-framework/base-mysql.report';
import { PatientlistMysqlReport } from '../app/reporting-framework/patientlist-mysql.report';

export class BreastCancerMonthlySummaryService {
  getAggregateReport(reportParams) {
    return new Promise((resolve, reject) => {
      let report;

      if (reportParams.requestParams.period === 'daily') {
        report = new BaseMysqlReport(
          'breastCancerDailySummaryAggregate',
          reportParams.requestParams
        );
      } else if (reportParams.requestParams.period === 'monthly') {
        report = new BaseMysqlReport(
          'breastCancerMonthlySummaryAggregate',
          reportParams.requestParams
        );
      }

      Promise.join(report.generateReport(), (results) => {
        let result = results.results.results;
        results.size = result ? result.length : 0;
        results.result = result;
        delete results['results'];
        resolve(results);
      }).catch((errors) => {
        reject(errors);
      });
    });
  }

  getPatientListReport(reportParams) {
    let indicators = reportParams.indicators
      ? reportParams.indicators.split(',')
      : [];
    if (reportParams.locationUuids) {
      let locationUuids = reportParams.locationUuids
        ? reportParams.locationUuids.split(',')
        : [];
      reportParams.locationUuids = locationUuids;
    }
    if (reportParams.genders) {
      let genders = reportParams.genders ? reportParams.genders.split(',') : [];
      reportParams.genders = genders;
    }

    let report = new PatientlistMysqlReport(
      'breastCancerMonthlySummaryAggregate',
      reportParams
    );

    return new Promise((resolve, reject) => {
      Promise.join(report.generatePatientListReport(indicators), (results) => {
        oncologyReportsService
          .getPatientListCols(
            reportParams.indicators,
            '142939b0-28a9-4649-baf9-a9d012bf3b3d'
          )
          .then((patientListCols) => {
            results['patientListCols'] = patientListCols;
            resolve(results);
          })
          .catch((error) => {
            console.error(
              'Error fetching breast screening patient list columns',
              error
            );
            reject(error);
          });
      }).catch((errors) => {
        console.error(
          'Error generating breast screening patient list report: ',
          errors
        );
        reject(errors);
      });
    });
  }
}
