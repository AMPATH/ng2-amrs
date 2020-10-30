import { BaseMysqlReport } from './base-mysql.report';
import * as etlProcessors from '../../etl-processors.js';
var _ = require('underscore');
export class PatientFlowReport extends BaseMysqlReport {
  constructor(reportName, params) {
    super('patientFlow', params);
  }
  generateReport() {
    let that = this;
    return super.generateReport().then((results) => {
      try {
        let finalResult = etlProcessors.processPatientFlow(
          that.params.indicators,
          {
            result: results.results.results
          },
          that.params.indicators
        );
        finalResult.schemas = results.schemas;
        finalResult.sqlQuery = results.sqlQuery;
        results = finalResult;
      } catch (error) {
        console.log('Error', error);
        return error;
      }
      return results;
    });
  }
}
