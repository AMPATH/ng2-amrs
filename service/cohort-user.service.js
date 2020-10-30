const dao = require('../etl-dao');
const Promise = require('bluebird');
const Moment = require('moment');
const _ = require('lodash');
import { BaseMysqlReport } from '../app/reporting-framework/base-mysql.report';

export class cohortUserService {
  getAggregateReport(reportParams) {
    let report = new BaseMysqlReport(
      'cohortReport',
      reportParams.requestParams
    );
    let self = this;
    return new Promise(function (resolve, reject) {
      Promise.join(report.generateReport(), (results) => {
        results.result = results.results.results;
        delete results['results'];
        resolve(results);
        //TODO Do some post processing
      }).catch((errors) => {
        reject(errors);
      });
    });
  }
}
