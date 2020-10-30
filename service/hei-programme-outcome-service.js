const dao = require('../etl-dao');
const Promise = require('bluebird');
const _ = require('lodash');
import { BaseMysqlReport } from '../app/reporting-framework/base-mysql.report';
import { PatientlistMysqlReport } from '../app/reporting-framework/patientlist-mysql.report';

const unknownOutcomedefs = require('../app/reporting-framework/hei/hei-unknown-programme-outcome.json');

export class HeiProgrammeOutcomeService {
  getAggregateReport(reportParams) {
    return new Promise(function (resolve, reject) {
      let report;

      report = new BaseMysqlReport(
        'heiUknownProgramOutcomeAggregate',
        reportParams.requestParams
      );

      Promise.join(report.generateReport(), (results) => {
        let result = results.results.results;
        results.size = result ? result.length : 0;
        results.result = result;
        results['indicatorDefinitions'] = unknownOutcomedefs;
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
    delete reportParams['gender'];

    let report = new PatientlistMysqlReport(
      'heiUknownProgramOutcomeAggregate',
      reportParams
    );

    return new Promise(function (resolve, reject) {
      Promise.join(report.generatePatientListReport(indicators), (results) => {
        results['result'] = results.results.results;
        resolve(results);
      }).catch((errors) => {
        console.log('Error', errors);
        reject(errors);
      });
    });
  }
}
