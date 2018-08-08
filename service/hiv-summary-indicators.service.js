import {
    BaseMysqlReport
} from '../app/reporting-framework/base-mysql.report';
import {
    PatientlistMysqlReport
} from '../app/reporting-framework/patientlist-mysql.report';
import {
    IndicatorDefinitionService
} from '../app/reporting-framework/indicator-definition.service';

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
            let columnWhitelist = indicators.concat(['location_id','location_uuid', 'month', 'location', 'encounter_datetime', 'person_id']);
            params.columnWhitelist = columnWhitelist;
        }
        let report = new BaseMysqlReport('hivSummaryBaseAggregate', params)
        return new Promise(function (resolve, reject) {
            Promise.join(report.generateReport(),
                (result) => {
                    let indicatorDefinitionService = new IndicatorDefinitionService();
                    let returnedResult = {};
                    try {
                        returnedResult.indicatorDefinitions = indicatorDefinitionService.getDefinitions(params.indicators)
                    } catch (error) {
                        console.log(error);
                    }

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
        let gender = reportParams.gender.split(',');
        let locations = reportParams.locationUuids.split(',');
        reportParams.locationUuids = locations;
        reportParams.gender = gender;
        reportParams.limitParam = reportParams.limit;
        reportParams.offSetParam = reportParams.startIndex;
        let report = new PatientlistMysqlReport('hivSummaryBaseAggregate', reportParams)
        return new Promise(function (resolve, reject) {
            //TODO: Do some pre processing
            Promise.join(report.generatePatientListReport(reportParams.indicator.split(',')),
                (result) => {
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