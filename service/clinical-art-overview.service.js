const dao = require('../etl-dao');
const Promise = require('bluebird');
const Moment = require('moment');
const _ = require('lodash');
import { BaseMysqlReport } from '../app/reporting-framework/base-mysql.report';
import { PatientlistMysqlReport } from '../app/reporting-framework/patientlist-mysql.report';
export class clinicalArtOverviewService {
  getAggregateReport(reportParams) {
    let self = this;
    let report = new BaseMysqlReport(
      'clinicalArtOverviewAggregeate',
      reportParams
    );
    Promise.join(report.generateReport(), (result) => {
      let returnedResult = {};
      returnedResult.schemas = result.schemas;
      returnedResult.sqlQuery = result.sqlQuery;
      returnedResult.result = result.results.results;
      resolve(returnedResult);
      //TODO Do some post processing
    }).catch((errors) => {
      reject(errors);
    });
  }
  getPatientListReport(reportParams) {
    let self = this;
    let indicators = reportParams.indicator.split(',');
    let report = new PatientlistMysqlReport(
      'clinicalArtOverviewAggregeate',
      reportParams
    );
    return new Promise(function (resolve, reject) {
      //TODO: Do some pre processing
      Promise.join(report.generatePatientListReport(indicators), (result) => {
        let returnedResult = {};
        returnedResult.schemas = result.schemas;
        returnedResult.sqlQuery = result.sqlQuery;
        returnedResult.result = result.results.results;
        resolve(returnedResult);
      }).catch((errors) => {
        reject(errors);
      });
    });
  }
}
