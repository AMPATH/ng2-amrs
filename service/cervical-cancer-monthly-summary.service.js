const _ = require('lodash');
const Promise = require('bluebird');
const oncologyReportsService = require('../oncology-reports/oncology-reports-service');
import { BaseMysqlReport } from '../app/reporting-framework/base-mysql.report';
import { PatientlistMysqlReport } from '../app/reporting-framework/patientlist-mysql.report';
import { titleCase } from '../etl-helpers';

export class CervicalCancerMonthlySummaryService {
  getAggregateReport(reportParams) {
    return new Promise(function (resolve, reject) {
      let report;

      if (reportParams.requestParams.period === 'daily') {
        report = new BaseMysqlReport(
          'cervicalCancerDailySummaryAggregate',
          reportParams.requestParams
        );
      } else if (reportParams.requestParams.period === 'monthly') {
        report = new BaseMysqlReport(
          'cervicalCancerMonthlySummaryAggregate',
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
      'cervicalCancerMonthlySummaryAggregate',
      reportParams
    );

    return new Promise(function (resolve, reject) {
      Promise.join(report.generatePatientListReport(indicators), (results) => {
        for (const key in results.results.results) {
          if (results.results.results.hasOwnProperty(key)) {
            if (results.results.results[key].person_name) {
              results.results.results[key].person_name = titleCase(
                results.results.results[key].person_name
              );
            }
            if (
              results.results.results[key]
                .observations_from_positive_via_or_via_vili_test
            ) {
              // convert each observation to sentence case and remove duplicates
              results.results.results[
                key
              ].observations_from_positive_via_or_via_vili_test = Array.from(
                new Set(
                  results.results.results[
                    key
                  ].observations_from_positive_via_or_via_vili_test.split(',')
                )
              )
                .map(
                  (s) =>
                    s.charAt(0).toUpperCase() + s.slice(1).toLowerCase().trim()
                )
                .sort()
                .join(', ');
            }
          }
        }
        oncologyReportsService
          .getPatientListCols(
            reportParams.indicators,
            'cad71628-692c-4d8f-8dac-b2e20bece27f'
          )
          .then((patientListCols) => {
            results['patientListCols'] = patientListCols;
            resolve(results);
          })
          .catch((error) => {
            console.error(
              'Error fetching cervical screening patient list columns: ',
              error
            );
            reject(error);
          });
      }).catch((errors) => {
        console.error(
          'Error generating cervical screening patient list report: ',
          errors
        );
        reject(errors);
      });
    });
  }
}
