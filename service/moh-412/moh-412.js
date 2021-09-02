const Promise = require('bluebird');
const _ = require('lodash');
import { MultiDatasetPatientlistReport } from '../../app/reporting-framework/multi-dataset-patientlist.report.js';
import ReportProcessorHelpersService from '../../app/reporting-framework/report-processor-helpers.service';

const moh412defs = require('../../app/reporting-framework/hiv/moh-412.json');
const moh412Indicators = require('../../app/reporting-framework/json-reports/moh-412/moh-412-indicators.json');

export class MOH412Service extends MultiDatasetPatientlistReport {
  constructor(reportName, params) {
    super(reportName, params);
  }

  generateReport(additionalParams) {
    const that = this;
    return new Promise((resolve, reject) => {
      super
        .generateReport(additionalParams)
        .then((results) => {
          if (additionalParams && additionalParams.type === 'patient-list') {
            resolve(results);
          } else {
            let finalResult = [];
            const reportProcessorHelpersService = new ReportProcessorHelpersService();
            for (let result of results) {
              if (
                result.report &&
                result.report.reportSchemas &&
                result.report.reportSchemas.main &&
                result.report.reportSchemas.main.transFormDirectives.joinColumn
              ) {
                finalResult = reportProcessorHelpersService.joinDataSets(
                  that.params[
                    result.report.reportSchemas.main.transFormDirectives
                      .joinColumnParam
                  ] ||
                    result.report.reportSchemas.main.transFormDirectives
                      .joinColumn,
                  finalResult,
                  result.results.results.results
                );
              }
            }

            const totalResultRow = this.generateTotalsColumn(finalResult);

            resolve({
              queriesAndSchemas: results,
              result: finalResult,
              totalResults: totalResultRow,
              sectionDefinitions: moh412defs,
              indicatorDefinitions: []
            });
          }
        })
        .catch((error) => {
          console.error('MOH 412 generation error: ', error);
          reject(error);
        });
    });
  }

  getPatientListReport(requestParams) {
    const indicators = requestParams.indicators.split(',');
    const indicatorCols = this.getIndicatorColName(indicators);
    return new Promise((resolve, reject) => {
      this.generatePatientListReport(indicators)
        .then((results) => {
          results['indicatorData'] = indicatorCols;
          resolve(results);
        })
        .catch((err) => {
          resolve('Error', err);
        });
    });
  }

  getIndicatorColName(indicator) {
    const indicatorCol = moh412Indicators.indicators.filter((i) => {
      return i.indicator == indicator;
    });

    return indicatorCol;
  }
  generateTotalsColumn(results) {
    let totalResults = [];
    let resultRow = {
      location_uuid: [],
      location: 'Total',
      reporting_month: ''
    };
    results.forEach((locationResult) => {
      Object.entries(locationResult).forEach(([key, value]) => {
        if (
          typeof value === 'number' &&
          key !== 'location_id' &&
          key !== 'person_id'
        ) {
          resultRow[key] = value + (resultRow[key] ? resultRow[key] : 0);
        } else if (key === 'location_uuid') {
          resultRow.location_uuid.push(value);
        } else if (key === 'reporting_month') {
          resultRow.reporting_month = value;
        } else {
        }
      });
    });
    totalResults.push(resultRow);
    return totalResults;
  }
}
