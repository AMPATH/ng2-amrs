import { BaseMysqlReport } from "../app/reporting-framework/base-mysql.report";
import { PatientlistMysqlReport } from "../app/reporting-framework/patientlist-mysql.report";

const _ = require("lodash");
const Promise = require("bluebird");
const helpers = require('../etl-helpers');

export class PatientGainLosesService {

  getAggregateReport(reportParams) {
    return new Promise((resolve, reject) => {
      let report = new BaseMysqlReport("patientGainLoseAggregate", reportParams.requestParams);

      Promise.join(report.generateReport(), results => {
        let result = results.results.results;
        results.size = result ? result.length : 0;
        results.result = result;
        delete results["results"];
        resolve(results);
      }).catch(errors => {
        reject(errors);
      });
    });
  }

  getPatientListReport(reportParams) {
    let indicators = reportParams.indicators
      ? reportParams.indicators.split(",")
      : [];

    let report = new PatientlistMysqlReport(
      "patientGainLoseAggregate",
      reportParams
    );

    return new Promise(function (resolve, reject) {
      Promise.join(report.generatePatientListReport(indicators),
        (results) => {
          results.results.results.forEach((element) => {
            if (element.cur_meds) {
              element.cur_meds = helpers.getARVNames(element.cur_meds);
            }
            if (element.arv_first_regimen) {
              element.arv_first_regimen = helpers.getARVNames(element.arv_first_regimen);
            }
          })
          resolve(results);
        }).catch((errors) => {
          console.error('Error', errors);
          reject(errors);
        });
    });
  }
}
