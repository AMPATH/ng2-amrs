const Promise = require("bluebird");
const _ = require('lodash');
var helpers = require('../etl-helpers');
import {
    MultiDatasetPatientlistReport
} from '../app/reporting-framework/multi-dataset-patientlist.report.js';
import ReportProcessorHelpersService from '../app/reporting-framework/report-processor-helpers.service';
import {
    BaseMysqlReport
} from '../app/reporting-framework/base-mysql.report';
import { 
    PatientlistMysqlReport 
} from '../app/reporting-framework/patientlist-mysql.report';
import * as retentionIndicators from '../app/reporting-framework/hiv/retention-adherence-indicators.json';
const retentionSectionDefs = require('../app/reporting-framework/hiv/retention-report.json')
export class RetentionAppointmentTracingService extends MultiDatasetPatientlistReport {

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
                            sectionDefinitions:retentionSectionDefs,
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

    getPatientListReport(reportParams) {
        let self = this;
        return new Promise((resolve, reject) => {
            super.generatePatientListReport(indicators)
                        .then((results) => {
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
                            console.error('MOH patient list generation error', err);
                            reject(err);
                        });
        });
    }

    getIndicatorDefinitions(){
        return new Promise((resolve, reject) => {
           
            if(retentionIndicators['indicators']){
                resolve(retentionIndicators['indicators']);
            }else{
                reject('Error: Retention Indicators not found');
            }

        })

    }

}