const Promise = require('bluebird');
const Moment = require('moment');
const _ = require('lodash');
var processors = require('../../etl-processors.js');
import { BaseMysqlReport } from '../../app/reporting-framework/base-mysql.report';
export class CDMReportingService {
  getPatientSummaryReport(reportParams) {
    let self = this;
    return new Promise(function (resolve, reject) {
      let report = new BaseMysqlReport('cdmPatientSummary', reportParams);
      Promise.join(report.generateReport(), (results) => {
        results.result = results.results.results;
        delete results['results'];
        processors
          .convertCdmConceptIdToName(
            ['dm_meds', 'htn_meds', 'problems', 'dm_status', 'htn_status'],
            results,
            ''
          )
          .then(function (processedResult) {
            resolve(processedResult);
          })
          .catch(function (err) {
            reject(err);
          });
      }).catch((errors) => {
        reject(errors);
      });
    });
  }

  getPatientMedicationHistoryReport(reportParams) {
    let self = this;
    return new Promise(function (resolve, reject) {
      let report = new BaseMysqlReport('cdmPatientSummary', reportParams);
      Promise.join(report.generateReport(), (results) => {
        results.result = results.results.results;
        delete results['results'];
        processors
          .convertCdmConceptIdToName(['dm_meds', 'htn_meds'], results, '')
          .then(function (processedResult) {
            processors
              .cdmMedicationChange(processedResult)
              .then(function (_processedResult) {
                resolve(_processedResult);
              })
              .catch(function (err) {
                reject(err);
              });
          })
          .catch(function (err) {
            reject(err);
          });
      }).catch((errors) => {
        reject(errors);
      });
    });
  }
}
