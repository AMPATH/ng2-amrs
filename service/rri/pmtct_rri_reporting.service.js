const Promise = require('bluebird');
const Moment = require('moment');
const _ = require('lodash');
var processors = require('../../etl-processors.js');
import { BaseMysqlReport } from '../../app/reporting-framework/base-mysql.report';
export class PMTCTRRIReportingService {
  getPmtctRriSummaryReport(reportParams) {
    let self = this;
    return new Promise(function (resolve, reject) {
      let report = new BaseMysqlReport('pmtctRriSummary', reportParams);
      console.log(report);
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
}
