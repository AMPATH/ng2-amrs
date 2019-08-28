import {
    Promise
} from 'bluebird';
import {
    BaseMysqlReport
} from './base-mysql.report';
export class MultiDatasetReport extends BaseMysqlReport {
    constructor(reportName, params) {
        super(reportName, params);
    }

    generateReport(additionalParams) {
        const that = this;
        return new Promise((resolve, reject) => {
            that._fetchAndInitReports()
                .then((handlers) => {
                    that.executeReportHandlers(that.reportHandlers, additionalParams)
                        .then((results) => {
                            resolve(results);
                        })
                        .catch((err) => {
                            reject(err);
                        })
                })
                .catch((err) => {
                    reject(err);
                })
        });
    }

    _fetchAndInitReports() {
        const that = this;
        return new Promise((resolve, reject) => {
            that.fetchReportSchema(that.reportName)
                .then((reportSchemas) => {
                    that.reportSchemas = reportSchemas;
                    that._intializeReportHandlers();
                    resolve(that.reportHandlers);
                })
                .catch((err) => {
                    reject(err);
                });
        });

    }

    _intializeReportHandlers() {
        let that = this;
        let handlers = [];
        this.reportSchemas.main.reports.forEach(report => {
            handlers.push(this.getReportHandler(report, that.params));
        });
        that.reportHandlers = handlers;
    }



    runSingleReport(reportObject, additionalParams) {
        return reportObject.generateReport();
    }

    executeReportHandlers(reportHandlers, additionalParams) {
        let that = this;

        return new Promise((resolve, reject) => {
            let results = [];

            Promise.reduce(reportHandlers, (previous, currentReport) => {
                return new Promise((res, rej) => {
                    that.runSingleReport(currentReport, additionalParams)
                        .then((result) => {
                            let toAdd = results.push({
                                report: currentReport,
                                results: result
                            });
                            res(toAdd);
                        }).
                        catch((err) => {
                            console.error('Error occured while fetching report', err);
                            let toAdd = results.push({
                                report: currentReport,
                                error: err
                            });
                            res(toAdd);
                        });
                })
            }, 0)
                .then((res) => {
                    resolve(results);
                })
                .catch((err) => {
                    reject(err);
                });

        })
    }

    getReportHandler(reportName, params) {
        return new BaseMysqlReport(reportName, params);
    }

}