const dao = require('../etl-dao');
const Promise = require("bluebird");
const Moment = require('moment');
const _ = require('lodash');
import {
    MultiDatasetReport
} from '../app/reporting-framework/multi-dataset.report';
import {
    BaseMysqlReport
} from '../app/reporting-framework/base-mysql.report';
export class HivSummaryMonthlyIndicatorsService {

    getAggregateReport(reportParams) {
        let self = this;
        return new Promise(function (resolve, reject) {
            reportParams.groupBy = 'groupByYear,groupByMonth';
            reportParams.countBy = 'num_persons';
            if (reportParams.requestParams.indicators) {
                let indicators = reportParams.requestParams.indicators.split(',');
                let columnWhitelist = indicators.concat(['location_id','location_uuid', 'month', 'reporting_month', 'location', 'encounter_datetime','person_id',
                'age_range','gender',
                'encounter_month','encounter_year'
            ]);
                reportParams.requestParams.columnWhitelist = columnWhitelist;
            }

                let report = new BaseMysqlReport('hivMonthlySummaryReportAggregate',reportParams.requestParams);


            Promise.join(report.generateReport(),
                (results) => {
                    let result =results.results.results;
                    results.size =result?result.length:0;
                    results.result=result;
                    delete results['results'];
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