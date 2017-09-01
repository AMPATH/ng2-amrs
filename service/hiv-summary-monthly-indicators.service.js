const dao = require('../etl-dao');
const Promise = require("bluebird");
const Moment = require('moment');
const _ = require('lodash');
export class HivSummaryMonthlyIndicatorsService {

    getAggregateReport(reportParams) {
        let self = this;
        return new Promise(function (resolve, reject) {
            reportParams.groupBy = 'groupByYear,groupByMonth';
            reportParams.countBy = 'num_persons';
            Promise.join(dao.runReport(reportParams),
                (results) => {
                    resolve(results);
                    //TODO Do some post processing
                }).catch((errors) => {
                    reject(errors);
                });
        });
    }
    getPatientListReport(reportParams) {
        let self = this;
        return new Promise(function (resolve, reject) {
            //TODO: Do some pre processing
            Promise.join(dao.getPatientListReport(reportParams),
                (results) => {
                    resolve(results);
                }).catch((errors) => {
                    reject(errors);
                });
        });

    }

}