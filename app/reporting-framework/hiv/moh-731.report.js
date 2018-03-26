import {
    MultiDatasetPatientlistReport
} from '..//multi-dataset-patientlist.report';
import ReportProcessorHelpersService from '../report-processor-helpers.service';
import {
    Promise
} from 'bluebird';
const moh731defs = require('./moh-731-2017');
export class Moh731Report extends MultiDatasetPatientlistReport {
    constructor(params) {
        super('MOH-731-greencard', params)
    }

    generateReport(additionalParams) {
        const that = this;
        return new Promise((resolve, reject) => {
            super.generateReport(additionalParams)
                .then((results) => {
                    if (additionalParams && additionalParams.type === 'patient-list') {
                        results.indicators = that.getIndicatorSectionDefinitions(that.params.indicator,
                            moh731defs);
                        resolve(results);
                    } else {
                        let finalResult = []
                        const reportProcessorHelpersService = new ReportProcessorHelpersService();
                        for (let result of results) {
                            if (result.report && result.report.reportSchemas && result.report.reportSchemas.main &&
                                result.report.reportSchemas.main.transFormDirectives.joinColumn) {
                                finalResult = reportProcessorHelpersService
                                    .joinDataSets(result.report.reportSchemas.main.transFormDirectives.joinColumn,
                                        finalResult, result.results.results.results);
                            }
                        }
                        resolve({
                            queriesAndSchemas: results,
                            result: finalResult,
                            sectionDefinitions: moh731defs,
                            indicatorDefinitions: []
                        });
                    }
                })
                .catch((error) => {
                    console.error('MOH 731 generation error: ', error);
                    reject(error);
                });
        });
    }

    getIndicatorSectionDefinitions(requestIndicators, sectionDefinitions) {
        let results = [];
        _.each(requestIndicators.split(','), function (requestIndicator) {
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
}