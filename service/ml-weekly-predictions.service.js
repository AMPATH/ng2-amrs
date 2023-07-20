const Promise = require('bluebird');
import { BaseMysqlReport } from '../app/reporting-framework/base-mysql.report';
import { PatientlistMysqlReport } from '../app/reporting-framework/patientlist-mysql.report';

export class MlWeeklyPredictionsService {
  getAggregateReport(reportParams) {
    return new Promise(function (resolve, reject) {
      const report = new BaseMysqlReport(
        'mlWeeklyPredictionsAggregate',
        reportParams.requestParams
      );

      Promise.join(report.generateReport(), (results) => {
        let result = results.results.results;
        results.size = result ? result.length : 0;
        results.result = result;
        delete results['results'];
        resolve(results);
      }).catch((errors) => {
        reject(errors);
      });
    });
  }

  getPatientListReport(reportParams) {
    const indicators = reportParams.indicators
      ? reportParams.indicators.split(',')
      : [];
    delete reportParams['gender'];

    const report = new PatientlistMysqlReport(
      'mlWeeklyPredictionsAggregate',
      reportParams
    );

    return new Promise(function (resolve, reject) {
      Promise.join(report.generatePatientListReport(indicators), (results) => {
        results['result'] = results.results.results;
        delete results['results'];
        resolve(results);
      }).catch((errors) => {
        console.log('Error: ', errors);
        reject(errors);
      });
    });
  }
}
