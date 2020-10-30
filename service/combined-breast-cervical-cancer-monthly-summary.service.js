const Promise = require('bluebird');
const _ = require('lodash');
const oncologyReportsService = require('../oncology-reports/oncology-reports-service');
import { BaseMysqlReport } from '../app/reporting-framework/base-mysql.report';
import { PatientlistMysqlReport } from '../app/reporting-framework/patientlist-mysql.report';
import { titleCase } from '../etl-helpers';

export class CombinedBreastCervicalCancerMonthlySummary {
  getAggregateReport(reportParams) {
    return new Promise(function (resolve, reject) {
      let report;

      if (reportParams.requestParams.period === 'daily') {
        report = new BaseMysqlReport(
          'combinedBreastCervicalCancerDailySummaryAggregate',
          reportParams.requestParams
        );
      } else if (reportParams.requestParams.period === 'monthly') {
        report = new BaseMysqlReport(
          'combinedBreastCervicalCancerMonthlySummaryAggregate',
          reportParams.requestParams
        );
      }

      Promise.join(report.generateReport(), (results) => {
        let result = results.results.results;
        results.size = result ? result.length : 0;
        results.result = result;
        delete results['results'];
        resolve(results);
        // TODO Do some post processing
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
      'combinedBreastCervicalCancerMonthlySummaryAggregate',
      reportParams
    );

    return new Promise(function (resolve, reject) {
      // TODO: Do some pre processing
      Promise.join(report.generatePatientListReport(indicators), (results) => {
        for (const key in results.results.results) {
          if (results.results.results.hasOwnProperty(key)) {
            if (results.results.results[key].person_name) {
              results.results.results[key].person_name = titleCase(
                results.results.results[key].person_name
              );
            }
          }
        }
        oncologyReportsService
          .getPatientListCols(
            reportParams.indicators,
            'b2837614-e144-4bec-abc2-e9f5e3116bb9'
          )
          .then((patientListCols) => {
            if (
              reportParams.indicators === 'total_breast_and_cervical_screened'
            ) {
              let data = results.results.results;
              _.remove(data, (element) => {
                return (
                  element.fbcs_person_id === null ||
                  element.fccs_person_id === null
                );
              });
            }
            results['patientListCols'] = patientListCols;
            resolve(results);
          })
          .catch((error) => {
            console.error('ERROR: Error getting patient list cols', error);
            reject(error);
          });
      }).catch((errors) => {
        console.error('Error', errors);
        reject(errors);
      });
    });
  }
}
