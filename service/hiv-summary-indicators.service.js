import {
    BaseMysqlReport
} from '../app/reporting-framework/base-mysql.report';
import {
    PatientlistMysqlReport
} from '../app/reporting-framework/patientlist-mysql.report';

const dao = require('../etl-dao');
const Promise = require("bluebird");
const Moment = require('moment');
const _ = require('lodash');
export class HivSummaryIndicatorsService {

    getAggregateReport(reportParams) {
        let self = this;
        reportParams.groupBy = 'groupByLocation';
        reportParams.countBy = 'num_persons';
        let params = reportParams.requestParams;

        if (params.indicators) {
            let indicators = params.indicators.split(',');
            let columnWhitelist = indicators.concat(['location_id', 'month', 'location', 'encounter_datetime', 'person_id']);
            params.columnWhitelist = columnWhitelist;
        }
        let report = new BaseMysqlReport('hivSummaryBaseAggregate', params)
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
        let report = new PatientlistMysqlReport('hivSummaryBaseAggregate', params)
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