import { Json2Sql } from 'ampath-json2sql';
import { Promise } from 'bluebird';
import { QueryService } from '../app/database-access/query.service.js'

export class BaseMysqlReport {
    constructor(reportName, params) {
        this.reportName = reportName;
        this.params = params;
    }

    generateReport() {
        // 1. Fetch report schema
        // 2. Generate report sql using json2sql
        // 3. Execute sql statement using sql generator
        const that = this;
        return new Promise((resolve, error) => {
            // fetch reports
            that.fetchReportSchema(that.reportName)
                .then((reportSchemas) => {
                    that.reportSchemas = reportSchemas;

                    // generate query
                    that.generateReportQuery(that.reportSchemas, that.params)
                        .then((sqlQuery) => {
                            that.reportQuery = sqlQuery;

                            // run query
                            that.executeReportQuery(that.reportQuery)
                                .then((results) => {
                                    that.queryResults = results;

                                    resolve({
                                        schemas: that.reportSchemas,
                                        sqlQuery: that.reportQuery,
                                        results: that.queryResults
                                    });
                                })
                                .error((err) => {
                                    error(err);
                                });

                        })
                        .error((err) => {
                            error(err);
                        });

                })
                .error((err) => {
                    error(err);
                })
        });
    }

    fetchReportSchema(reportName, version) {
        return new Promise((resolve, error) => {
            resolve({});
        });
    }

    generateReportQuery(reportSchemas, params) {
        let jSql = this.getJson2Sql(reportSchemas, params);
        return new Promise((resolve, error) => {
            resolve(jSql.generateSQL().toString());
        });
    }

    getJson2Sql(reportSchemas, params) {
        return new Json2Sql(reportSchemas.main, reportSchemas, params);
    }

    executeReportQuery(sqlQuery) {
        let runner = this.getSqlRunner();
        return new Promise((resolve, reject) => {
            runner.executeQuery(sqlQuery)
            .then((results)=>{
                resolve({ results: results });
            })
            .catch((error)=>{
                reject(error)
            });
        });
    }

    getSqlRunner() {
        return new QueryService();
    }


}