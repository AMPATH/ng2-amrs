import { PatientlistMysqlReport } from '../app/reporting-framework/patientlist-mysql.report';
const helpers = require('../etl-helpers');

export class ClinicFlowService {
  getAggregateReport(reportParams) {}

  getPatientListReport(reportParams) {
    let indicators = reportParams.indicators
      ? reportParams.indicators.split(',')
      : [];

    let report = new PatientlistMysqlReport(
      'clinicFlowProviderStatisticsAggregate',
      reportParams
    );

    return new Promise(function (resolve, reject) {
      report
        .generatePatientListReport(indicators)
        .then((results) => {
          results.results.results.forEach((element) => {
            if (element.cur_meds) {
              element.cur_meds = helpers.getARVNames(element.cur_meds);
            }
            if (element.arv_first_regimen) {
              element.arv_first_regimen = helpers.getARVNames(
                element.arv_first_regimen
              );
            }
          });

          results['results'] = results.results.results;
          delete [results.results];
          resolve(results);
        })
        .catch((errors) => {
          console.error('Error', errors);
          reject(errors);
        });
    });
  }
}
