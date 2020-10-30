import { BaseMysqlReport } from './base-mysql.report';
import * as etlProcessors from '../../etl-processors.js';
export class ClinicComparatorReport extends BaseMysqlReport {
  constructor(reportName, params) {
    super(reportName, params);
  }
  generateReport() {
    let that = this;
    return super.generateReport().then((results) => {
      try {
        let finalResult = etlProcessors.processClinicalComparator(
          that.params.indicators,
          results.results.results,
          that.params.indicators
        );
        let returneResult = {};
        returneResult.schemas = results.schemas;
        returneResult.sqlQuery = results.sqlQuery;
        returneResult.result = finalResult;
        results = returneResult;
      } catch (error) {
        console.log('Error', error);
        return error;
      }
      return results;
    });
  }
}
