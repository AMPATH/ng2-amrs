import {
    MultiDatasetPatientlistReport
} from '../reporting-framework/multi-dataset-patientlist.report';
import ReportProcessorHelpersService from '../reporting-framework/report-processor-helpers.service';
import { Promise } from 'bluebird';
import indicatorDefinitions from './ovc-indicator-definitions.json';
const Moment = require('moment');
const dao = require('../../etl-dao');
export class OvcMonthlySummary extends MultiDatasetPatientlistReport {
    constructor(reportName, params) {
        if (params.isAggregated) {
            params.joinColumnParam = 'join_location';
        }
        params.hivMonthlyDatasetSource = 'etl.hiv_monthly_report_dataset_v1_2';
        super(reportName, params)
    }

    generateAggregateReport(additionalParams) {
        const that = this;
        return new Promise((resolve, reject) => {
            that.determineReportSourceTables()
                .then((res) => {
                    super.generateReport(additionalParams)
                        .then((results) => {
                            if (additionalParams && additionalParams.type === 'patient-list') {
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
                            console.error('OvcReport generation error: ', error);
                            reject(error);
                        });
                })
                .catch((err) => {
                    console.error('OvcReport generation error: ', err);
                    reject(error);
                });
        });
    }

    generatePatientListReport(indicators) {
        let self = this;
        if (self.params.locationUuids) {
            let locations = self.params.locations ? self.params.locations.split(',') : [];
            self.params.locations = locations;
        }
        return new Promise((resolve, reject) => {
            self.determineReportSourceTables()
                .then((res) => {
                    super.generatePatientListReport(indicators)
                        .then((results) => {

                            results.indicators = self.getIndicatorSectionDefinitions(results.indicators,
                                indicatorDefinitions);
                            self.resolveLocationUuidsToName(self.params.locationUuids)
                                .then((locations) => {
                                    results.locations = locations;
                                    delete results['allResults'];
                                    resolve(results);
                                })
                                .catch((err) => {
                                    resolve(results);
                                });

                        })
                        .catch((err) => {
                            console.error('Patient list generation error', err);
                            reject(err);
                        });
                })
                .catch((err) => {
                    console.error('Patient list generation error: ', err);
                    reject(err);
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

    determineReportSourceTables() {
        const self = this;
        return new Promise((resolve, reject) => {
            let query = 'select * from etl.moh_731_last_release_month';
            let runner = self.getSqlRunner();

            runner.executeQuery(query)
                .then(
                    (results) => {
                        let lastReleasedMonth = results[0]['last_released_month'];
                        if (Moment(lastReleasedMonth).isSameOrAfter(Moment(self.params.endDate))) {
                            self.params.hivMonthlyDatasetSource = 'etl.hiv_monthly_report_dataset_frozen';
                        } else {
                            self.params.hivMonthlyDatasetSource = 'etl.hiv_monthly_report_dataset_v1_2';
                        }
                        resolve(self.params.hivMonthlyDatasetSource);
                    })
                .catch((error) => {
                    console.error('Error getting released report month:', error);
                    reject(error);
                });
        });
    }
}