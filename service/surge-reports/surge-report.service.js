import ReportProcessorHelpersService from "../../app/reporting-framework/report-processor-helpers.service";
import { SurgeMultiDatasetPatientlistReport } from "./surge-multi-dataset-patientlist.report";
import { PatientlistMysqlReport } from "../../app/reporting-framework/patientlist-mysql.report";

const helpers = require('../../etl-helpers');
const Promise = require("bluebird");
const _ = require('lodash');
const surgeSectionDefinitions = require('./surge-report.json');
const surgeSchemaReportMap = require('./surge-indicators-config.json');

export class SurgeService extends SurgeMultiDatasetPatientlistReport {

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
                            console.log('result', result);
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
                            sectionDefinitions: surgeSectionDefinitions,
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

    getPatientListReport(reportParams) {
        const that = this;
        let indicators = reportParams.indicators ? reportParams.indicators.split(',') : [];
        if (reportParams.locationUuids) {
            let locationUuids = reportParams.locationUuids ? reportParams.locationUuids.split(',') : [];
            reportParams.locationUuids = locationUuids;

        }
        let report = new PatientlistMysqlReport(that.whichReportSchema(reportParams.indicators), reportParams);
        return new Promise(function (resolve, reject) {
            Promise.join(report.generatePatientListReport(indicators),
                (results) => {
                    results.results.results.forEach((element) => {
                        if (element.cur_meds) {
                            element.cur_meds = helpers.getARVNames(element.cur_meds);
                        }
                        if (element.arv_first_regimen) {
                            element.arv_first_regimen = helpers.getARVNames(element.arv_first_regimen);
                        }
                    })
                    resolve(results);
                }).catch((errors) => {
                    console.error('Error', errors);
                    reject(errors);
                });
        });
    }


    generatePatientListReport(indicators) {
        let self = this;
        return new Promise((resolve, reject) => {
            super.generatePatientListReport(indicators)
                .then((results) => {
                    results.sections = surgeSectionDefinitions;
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

    resolveLocationUuidsToName(uuids) {
        return new Promise((resolve, reject) => {
            dao.resolveLocationUuidsToName(uuids.split(','), (loc) => {
                resolve(loc);
            });
        });
    }

    whichReportSchema(indicator) {
        let report = _.find(surgeSchemaReportMap.reportSchemas, (schema) => {
            return _.includes(schema.indicators, indicator);
        });
        return report ? report.reportName : 'Indicator not found';
    }
}