import { Promise } from 'bluebird';
import { MultiDatasetPatientlistReport } from '../../app/reporting-framework/multi-dataset-patientlist.report';
import ReportProcessorHelpersService from '../../app/reporting-framework/report-processor-helpers.service';

const surgeDefs = require('./surge-report.json');
const dao = require('../../etl-dao');

export class SurgeReportService extends MultiDatasetPatientlistReport {
    constructor(reportName, params) {
        if (params.isAggregated) {
            params.excludeParam = ['location_id'];
            params.joinColumnParam = 'join_location';
        }
        console.log('creating new surge report service')
        super(reportName, params)
    }

    generateReport(additionalParams) {
        const that = this;
        return new Promise((resolve, reject) => {
            console.log('Params:::', that.params);
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

                        if(this.params && this.params.isAggregated === true) {
                            finalResult[0].location = 'Multiple Locations...';
                        }
                        resolve({
                            queriesAndSchemas: results,
                            result: finalResult,
                            sectionDefinitions: surgeDefs,
                            indicatorDefinitions: []
                        });
                    }
                })
                .catch((error) => {
                    console.error('Surge Report generation error: ', error);
                    reject(error);
                });
        });
    }

    generatePatientListReport(indicators) {
        let self = this;
        let surgeRepDefs = surgeDefs;
        return new Promise((resolve, reject) => {
                    super.generatePatientListReport(indicators)
                        .then((results) => {
                            let indicatorLabels = self.getIndicatorSectionDefinitions(results.indicators,
                                surgeRepDefs);

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
                            console.error('Surge patient list generation error', err);
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
                        // console.log('Found indicator', requestIndicator);
                        results.push(indicator);
                    }
                });
            });
        });
        return results;
    }

    resolveLocationUuidsToName(uuids) {
        return new Promise((resolve, reject) => {
            // resolve location name
            dao.resolveLocationUuidsToName(uuids.split(','), (loc) => {
                resolve(loc);
            });
        });
    }
}