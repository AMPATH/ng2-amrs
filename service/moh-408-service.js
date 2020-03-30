const Promise = require("bluebird");
const _ = require('lodash');
import {
    MultiDatasetPatientlistReport
} from '../app/reporting-framework/multi-dataset-patientlist.report.js';
import ReportProcessorHelpersService from '../app/reporting-framework/report-processor-helpers.service';

const moh408defs = require('../app/reporting-framework/hei/moh-408');

export class HeiSummaryService extends MultiDatasetPatientlistReport{

    constructor(reportName, params) {
        super(reportName, params)
    }


    generateReport(additionalParams) {
        const that = this;
        return new Promise((resolve, reject) => {
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
                                sectionDefinitions: moh408defs,
                                indicatorDefinitions: []
                            });
                            

                    }
                })
                .catch((error) => {
                    console.error('MOH 408 generation error: ', error);
                    reject(error);
                });
            
        });
    }


    getPatientListReport(reportParams) {
        let self = this;
        return new Promise(function (resolve, reject) {
            Promise.join(dao.getPatientListReport(reportParams),
                self.resolveLocationUuidsToName(reportParams.locationUuids),
                (results, locations) => {
                    results.indicators = self.getIndicatorSectionDefinitions(reportParams.indicator,moh408defs);
                    results.locations = locations;
                    resolve(results);
                }).catch((errors) => {
                reject(errors);
            });
        });
    }


    

}