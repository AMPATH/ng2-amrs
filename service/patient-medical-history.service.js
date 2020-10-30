const dao = require('../etl-dao');
const Promise = require('bluebird');
const Moment = require('moment');
const _ = require('lodash');
import { BaseMysqlReport } from '../app/reporting-framework/base-mysql.report';
var processors = require('../etl-processors.js');

export class PatientMedicalHistoryService extends BaseMysqlReport {
  constructor(reportName, params) {
    super(reportName, params);
  }
  generateReport(additionalParams) {
    const that = this;
    let indicators = ['previous_regimen', 'current_regimen'];
    return new Promise((resolve, reject) => {
      super
        .generateReport(additionalParams)
        .then((results) => {
          results.size = results ? results.results.results.length : 0;
          results.result = results ? results.results.results : [];

          delete results['results'];
          var pd = processors.findChanges(indicators, results, '');
          var pd2 = processors.convertConceptIdToName(indicators, results, '');

          resolve(results);
        })
        .catch((error) => {
          console.error(
            'Patient Medical History Report generation error: ',
            error
          );
          reject(error);
        });
    });
  }
}
