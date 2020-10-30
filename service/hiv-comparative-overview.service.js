const dao = require('../etl-dao');
const Promise = require('bluebird');
const Moment = require('moment');
const _ = require('lodash');
import { BaseMysqlReport } from '../app/reporting-framework/base-mysql.report';
import { PatientlistMysqlReport } from '../app/reporting-framework/patientlist-mysql.report';

export class hivComparativeOverviewService {
  getAggregateReport(reportParams) {
    let self = this;
    let report = new BaseMysqlReport(
      'clinicHivComparativeOverviewAggregate',
      reportParams
    );
    return new Promise(function (resolve, reject) {
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
    });
  }
  getPatientListReport(reportParams) {
    let self = this;
    let endDate = reportParams.endDate.split('T')[0];
    let startDate = reportParams.startDate.split('T')[0];
    reportParams.endDate = endDate;
    reportParams.startDate = startDate;
    let locations = reportParams.locations.split(',');
    reportParams.locations = locations;
    return new Promise(function (resolve, reject) {
      //TODO: Do some pre processing
      let report = new PatientlistMysqlReport(
        'clinicHivComparativeOverviewAggregate',
        reportParams
      );
      Promise.join(
        report.generatePatientListReport(reportParams.indicator.split(',')),
        (result) => {
          let returnedResult = {};
          returnedResult.schemas = result.schemas;
          returnedResult.sqlQuery = result.sqlQuery;
          returnedResult.result = result.results.results;
          resolve(returnedResult);
        }
      ).catch((errors) => {
        reject(errors);
      });
    });
  }
}
