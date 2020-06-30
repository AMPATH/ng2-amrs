const Promise = require("bluebird");
const _ = require('lodash');
import {
    MultiDatasetPatientlistReport
} from '../app/reporting-framework/multi-dataset-patientlist.report.js';
import ReportProcessorHelpersService from '../app/reporting-framework/report-processor-helpers.service';
const indicatorDefinitions = require('./prep-indicator-definitions.json');
export class PrepMonthlySummaryService extends MultiDatasetPatientlistReport {

    constructor(reportName, params) {
        super(reportName, params)
    }

    getAggregateReport(reportParams) {
        const that = this;
        return new Promise((resolve, reject) => {
            super.generateReport(reportParams)
                .then((results) => {
                    if (reportParams && reportParams.type === 'patient-list') {
                        resolve(results);
                    } else {
                        let finalResult = []
                        const reportProcessorHelpersService = new ReportProcessorHelpersService();
                        for (let result of results) {
                            if (result.report && result.report.reportSchemas && result.report.reportSchemas.main &&
                                result.report.reportSchemas.main.transFormDirectives.joinColumn) {
                                finalResult = reportProcessorHelpersService
                                    .joinDataSets(that.params[result.report.reportSchemas.main.transFormDirectives.joinColumnParam] ||
                                        result.report.reportSchemas.main.transFormDirectives.joinColumn,
                                        finalResult, result.results.results.results);

                            }
                        }
                        resolve({
                            queriesAndSchemas: results,
                            result: finalResult,
                            sectionDefinitions: indicatorDefinitions,
                            indicatorDefinitions: []
                        });


                    }
                })
                .catch((error) => {
                    console.error('prep monthly report generation error: ', error);
                    reject(error);
                });
        });
    }

    generatePatientList(indicators) {
        let self = this;
        return new Promise((resolve, reject) => {
            super.generatePatientListReport(indicators)
                .then((results) => {
                    let indicatorLabels = self.getIndicatorSectionDefinitions(results.indicators,
                        indicatorDefinitions);

                    results.indicators = indicatorLabels;

                    self.resolveLocationUuidsToName(self.params.locationUuids)
                        .then((locations) => {
                            results.locations = locations;
                            resolve(results);
                        })
                        .catch((err) => {
                            resolve(results);
                        });

                })
                .catch((err) => {
                    reject(results);
                });

        });
    }

    getIndicatorSectionDefinitions(requestIndicators, sectionDefinitions) {
        let results = [];
        _.each(requestIndicators, function (requestIndicator) {
            _.each(sectionDefinitions, function (sectionDefinition) {
                _.each(sectionDefinition.indicators, function (indicator) {
                    if (indicator.indicator === requestIndicator) {
                        results.push(indicator);
                    }
                });
            });
        });
        return results;
    }

    resolveLocationUuidsToName(uuids) {
        return new Promise((resolve, reject) => {
            dao.resolveLocationUuidsToName(uuids.split(','), (loc) => {
                resolve(loc);
            });
        });
    }
}