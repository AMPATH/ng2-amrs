const Promise = require('bluebird');
const _ = require('lodash');
import { MultiDatasetPatientlistReport } from '../../app/reporting-framework/multi-dataset-patientlist.report.js';
import ReportProcessorHelpersService from '../../app/reporting-framework/report-processor-helpers.service';
const gainsLossesIndicatorDefs = require('../../app/reporting-framework/hiv/gains-and-losses-indicators.json');
const etlHelpers = require('../../etl-helpers.js');
const patientListCols = require('../../app/reporting-framework/json-reports/gains-and-losses/gains-and-losses-patient-list-cols.json');

export class HIVGainsAndLossesService extends MultiDatasetPatientlistReport {
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

            const proxyRetention = this.calculateProxiRetention(finalResult);

            resolve({
              queriesAndSchemas: results,
              result: finalResult,
              proxyRetention: proxyRetention,
              sectionDefinitions: gainsLossesIndicatorDefs,
              indicatorDefinitions: []
            });
          }
        })
        .catch((error) => {
          console.error('Retention generation error: ', error);
          reject(error);
        });
    });
  }

  generatePatientListReport(indicators) {
    let self = this;
    return new Promise((resolve, reject) => {
      super
        .generatePatientListReport(indicators)
        .then((results) => {
          const patientListCols = this.getIndicatorPatientList(indicators);
          let result = results.result;
          results['results'] = {
            results: result,
            patientListCols: patientListCols
          };
          delete results['result'];
          _.each(results.results.results, (row) => {
            row.cur_meds = etlHelpers.getARVNames(row.cur_meds);
          });
          resolve(results);
        })
        .catch((err) => {
          console.error('Gains and Losses patient list generation error', err);
          reject(err);
        });
    });
  }

  getIndicatorPatientList(indicator) {
    let patientList = [];
    if (patientListCols.hasOwnProperty(indicator)) {
      patientList = patientListCols[indicator].patientListCols;
    } else {
      patientList = patientListCols['general'].patientListCols;
    }

    return patientList;
  }

  calculateProxiRetention(results) {
    let curr_tx = 0;
    let curr_tx_expected = 0;
    let proxi_retention = 0;
    if (results.length > 0) {
      const result = results[0];
      curr_tx = result.on_art_starting;
      curr_tx_expected =
        result.on_art_starting +
        result.ending_new_on_art +
        result.return_to_care +
        result.transferred_in -
        result.transfer_out;
    }
    proxi_retention = ((curr_tx / curr_tx_expected) * 100).toFixed(2);

    return proxi_retention;
  }
}
