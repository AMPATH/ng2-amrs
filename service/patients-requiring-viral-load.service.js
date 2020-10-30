const dao = require('../etl-dao');
const Promise = require('bluebird');
const Moment = require('moment');
const _ = require('lodash');
import { BaseMysqlReport } from '../app/reporting-framework/base-mysql.report';
import { PatientlistMysqlReport } from '../app/reporting-framework/patientlist-mysql.report';
export class patientsRequiringVLService {
  getAggregateReport(reportParams) {
    console.log('Getting agg');
    let self = this;
    let report = new BaseMysqlReport('labsReportAggregate', reportParams);
    return new Promise(function (resolve, reject) {
      try {
        Promise.join(report.generateReport(), (result) => {
          let returnedResult = {};
          returnedResult.schemas = result.schemas;
          returnedResult.sqlQuery = result.sqlQuery;
          returnedResult.result = result.results.results;
          resolve(returnedResult);
          //TODO Do some post processing
        }).catch((errors) => {
          console.error(errors);
          reject(errors);
        });
      } catch (error) {
        console.error(errors);
      }
    });
  }
  getPatientListReport(reportParams) {
    let self = this;
    let locations = reportParams.locationUuids.split(',');
    reportParams.locationUuids = locations;
    return new Promise(function (resolve, reject) {
      let report = new PatientlistMysqlReport(
        'labsReportAggregate',
        reportParams
      );
      //TODO: Do some pre processing
      Promise.join(
        report.generatePatientListReport(['needs_vl_in_period']),
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
