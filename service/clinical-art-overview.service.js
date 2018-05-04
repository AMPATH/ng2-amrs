const dao = require('../etl-dao');
const Promise = require("bluebird");
const Moment = require('moment');
const _ = require('lodash');
export class clinicalArtOverviewService {

    getAggregateReport(reportParams) {
        let self = this;
        let report = new BaseMysqlReport('clinicalArtOverviewAggregeate', reportParams)
        Promise.join(report.generateReport(),
            (results) => {
                let returnedResult = {};
                returnedResult.schemas = result.schemas;
                returnedResult.sqlQuery = result.sqlQuery;
                returnedResult.result = result.results.results;
                resolve(returnedResult);
                //TODO Do some post processing
            }).catch((errors) => {
            reject(errors);
        });
    }
    getPatientListReport(reportParams) {
        let self = this;
        let report = new PatientlistMysqlReport('clinicalArtOverviewAggregeate', params)
        return new Promise(function (resolve, reject) {
            let report = new PatientlistMysqlReport();
            //TODO: Do some pre processing
            Promise.join(report.generatePatientListReport(reportParams),
                (results) => {
                    let returnedResult = {};
                    returnedResult.schemas = result.schemas;
                    returnedResult.sqlQuery = result.sqlQuery;
                    returnedResult.result = result.results.results;
                    resolve(returnedResult);
                }).catch((errors) => {
                reject(errors);
            });
        });

    }
}