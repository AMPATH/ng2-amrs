import {
    Promise
} from 'bluebird';
import {
    BaseMysqlReport
} from './base-mysql.report';
import ReportProcessorHelpersService from './report-processor-helpers.service';
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

    transFormResults(currentReport, result) {
        return new Promise((resolve, reject) => {
            try {
                if (currentReport.reportSchemas && currentReport.reportSchemas.main &&
                    currentReport.reportSchemas.main.transFormDirectives.disaggregationColumns &&
                    currentReport.reportSchemas.main.transFormDirectives.joinColumn) {
                    const reportProcessorHelpersService = new ReportProcessorHelpersService();
                    let final = reportProcessorHelpersService.tranform(result.results.results, {
                        use: currentReport.reportSchemas.main.transFormDirectives.disaggregationColumns,
                        skip: currentReport.reportSchemas.main.transFormDirectives.skipColumns || [],
                        joinColumn: currentReport.reportSchemas.main.transFormDirectives.joinColumn
                    });
                    result.results.results = final;
                }
                resolve(result);
            } catch (error) {
                console.error(error);
                reject(error);
                // expected output: SyntaxError: unterminated string literal
                // Note - error messages will vary depending on browser
            }
        });
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
                                return that.transFormResults(currentReport, result);
                            })
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