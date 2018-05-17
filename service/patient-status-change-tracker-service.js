const dao = require('../etl-dao');
const Promise = require("bluebird");
const Moment = require('moment');
const _ = require('lodash');
const underscore = require('underscore');
const indicatorsKeys = ['active_return', 'new_enrollment', 'transfer_in', 'LTFU', 'transfer_out', 'dead', 'HIV_negative',
    'self_disengaged', 'self_transfer_out'];

import { BaseMysqlReport } from '../app/reporting-framework/base-mysql.report';
export class PatientStatusChangeTrackerService {

    getAggregateReport(reportParams) {
        // reportParams.requestParams
        switch (reportParams.requestParams.analysis || 'none') {
            case 'cumulativeAnalysis':
                return this.getCumulativeAggregateAnalysis(reportParams);
                break;
            case 'monthlyAnalysis':
                return this.getMonthlyAggregateAnalysis(reportParams);
                break;
            case 'cohortAnalysis':
                return this.getCohortAggregateAnalysis(reportParams);
                break;
            default:
                return this.getCumulativeAggregateAnalysis(reportParams);
        }
    }

    getCumulativeAggregateAnalysis(reportParams) {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getCumulativeAggregates(reportParams),
            ]).then((data) => {
                data = this.runPostProcessing(data[0]);
                data.analysis = reportParams.requestParams.analysis;
                resolve(data);
            }).catch((e) => {
                console.log('Error, ', e);
                reject(e);

            });
        });
    }


    getMonthlyAggregateAnalysis(reportParams) {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getCumulativeAggregates(reportParams),
                this.getMonthlyChangeAggregates(reportParams.requestParams)
            ]).then((data) => {
                let results = this.groupResultsByReportingMonth(data);
                results.analysis = reportParams.requestParams.analysis;
                results = this.runPostProcessing(results);
                resolve(results);
            }).catch((e) => {
                console.log('Error, ', e);
                reject(e);

            });
        });
    }

    getCohortAggregateAnalysis(reportParams) {
        return new Promise((resolve, reject) => {
            Promise.all([
                this.getMonthlyChangeAggregates(reportParams.requestParams)
            ]).then((data) => {
                resolve(data[0]);
            }).catch((e) => {
                console.log('Error, ', e);
                reject(e);

            });
        });
    }


    groupResultsByReportingMonth(data) {
        let cumulativeAggr = data[0];
        let monthlyChangeAggr = data[1];
        cumulativeAggr.sql2 = monthlyChangeAggr.sql;

        _.each(cumulativeAggr.result, (cumulativeRow, i) => {
            _.each(monthlyChangeAggr.result, (monthlyRow, j) => {
                if (cumulativeRow.reporting_month === monthlyRow.reporting_month) {
                    cumulativeRow[monthlyRow.indicator] = monthlyRow.counts;
                }

            });

            // clean data by adding missing indicators and negations
            _.each(indicatorsKeys, (key, j) => {
                _.each(indicatorsKeys, (key2, i) => {
                    if (!cumulativeRow[key + '_to_' + key2]) cumulativeRow[key + '_to_' + key2] = 0;
                });
            });
        });
        return cumulativeAggr;
    }


    getPatientListReport(reportParams) {
        reportParams['reportName'] = 'patient-status-change-tracker-report';
        let derivedIndicators = this.getDerivedIndicators();
        return new Promise((resolve, reject) => {
            // check if it is a derived indicator
            if (underscore.contains(derivedIndicators, reportParams.indicator)) {
                let start = new Date();
                dao.getPatientCareStatusPatientListQuery(reportParams,
                    (results) => {
                        if (results.error) {
                            console.log(results.error);
                            reject(results);
                        } else {
                            results.duration = (new Date() - start) / 1000;
                            resolve(results);
                        }

                    }
                );
            } else {
                Promise.join(dao.getPatientListReport(reportParams),
                    (results) => {
                        if (results.error) {
                            console.log(results.error);
                            reject(results);
                        } else {
                            resolve(results);
                        }

                    }
                );
            }

        });
    }

    getCumulativeAggregates(reportParams) {
        return new Promise((resolve, reject) => {
            reportParams.groupBy = 'groupByEndDate';
            let start = new Date();
            let report = new BaseMysqlReport("patintChangeStatusTrackerAggregate",reportParams.requestParams);
            report.generateReport()
                .then((results) => {
                        results.duration = (new Date() - start) / 1000;
                        results.size=results?results.results.results.length:0;
                        results.result=results?results.results.results:[];
                        delete results['results'];
                        resolve(results);
                    }
                ).catch((errors) => {
                console.log(errors);
                reject(errors);
            });
        });
    }

    getMonthlyChangeAggregates(reportParams) {
        return new Promise((resolve, reject) => {
            reportParams.whereClause = '';
            let start = new Date();
            dao.getPatientCareStatusAggregatesQuery(reportParams,
                (results) => {
                    if (results.error) {
                        reject(results);
                    } else {
                        results.duration = (new Date() - start) / 1000;
                        resolve(results);
                    }

                }
            );
        });
    }

    getDerivedIndicators() {
        let indicators = [];
        _.each(indicatorsKeys, (key, j) => {
            _.each(indicatorsKeys, (key2, i) => {
                indicators.push(key + '_to_' + key2);
            });
        });
        return indicators;

    }

    runPostProcessing(results) {
        return results;
    }

}
