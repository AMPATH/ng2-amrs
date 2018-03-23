import { Json2Sql } from 'ampath-json2sql';
import { Promise } from 'bluebird';
import QueryService from '../database-access/query.service';

// TODO: Move to data store

import * as moh_731 from './json-reports/moh-731-bluecard.json';
import * as main_dataset_aggregate from './json-reports/main-dataset-aggregate.json';
import * as main_dataset_base from './json-reports/main-dataset-base.json';
import * as regimen_dataset_aggregate from './json-reports/regimen-dataset-aggregate.json';
import * as regimen_dataset_base from './json-reports/regimen-dataset-base.json';
import * as retention_dataset_aggregate from './json-reports/retention-dataset-aggregate.json';
import * as retention_dataset_base from './json-reports/retention-dataset-base.json';

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
                                .catch((err) => {
                                    error(err);
                                });

                        })
                        .catch((err) => {
                            error(err);
                        });
                })
                .catch((err) => {
                    error(err);
                })
        });
    }

    fetchReportSchema(reportName, version) {
        return new Promise((resolve, error) => {
            switch (reportName) {
                case 'MOH-731-greencard':
                    resolve({
                        main: moh_731
                    });
                    break;
                case 'mainDatasetAggregate':
                    resolve({
                        main: main_dataset_aggregate,
                        mainDataSetBase: main_dataset_base
                    });
                    break;
                case 'regimenDataSetAggregate':
                    resolve({
                        main: regimen_dataset_aggregate,
                        regimenDataSetbase: regimen_dataset_base
                    });
                    break;
                case 'retentionDataSetAggregate':
                    resolve({
                        main: retention_dataset_aggregate,
                        retentionDataSetbase: retention_dataset_base
                    });
                    break;
                default:
                    reject('Unknown report ', reportName);
                    break;
            }

        });
    }

    generateReportQuery(reportSchemas, params) {
        console.log('Passed params', params)
        let jSql = this.getJson2Sql(reportSchemas, params);
        return new Promise((resolve, reject) => {
            try {
                resolve(jSql.generateSQL().toString());
            } catch (error) {
                console.error('Error generating report sql statement', error);
                reject('Encountered an unexpected error', error);
            }          
        });
    }

    getJson2Sql(reportSchemas, params) {
        return new Json2Sql(reportSchemas.main, reportSchemas, params);
    }

    executeReportQuery(sqlQuery) {
        console.log('Executing Query', sqlQuery);
        let runner = this.getSqlRunner();
        return new Promise((resolve, reject) => {
            runner.executeQuery(sqlQuery)
                .then((results) => {
                    resolve({ results: results });
                })
                .catch((error) => {
                    reject(error)
                });
        });
    }

    getSqlRunner() {
        return new QueryService();
    }
}