const dao = require('../etl-dao');
const Promise = require("bluebird");
const Moment = require('moment');
const _ = require('lodash');
import {
    BaseMysqlReport
} from '../app/reporting-framework/base-mysql.report';

export class hivComparativeOverviewService {

    getAggregateReport(reportParams) {
        let self = this;
        let report = new BaseMysqlReport('clinicHivComparativeOverviewAggregate', reportParams);
        return new Promise(function (resolve, reject) {
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
        });
    }
    getPatientListReport(reportParams) {
        let self = this;
        let report = new PatientlistMysqlReport('clinicHivComparativeOverviewAggregate', reportParams)
        return new Promise(function (resolve, reject) {
            let report = new PatientlistMysqlReport(reportParams);
            //TODO: Do some pre processing
            Promise.join(report.generatePatientListReport(),
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