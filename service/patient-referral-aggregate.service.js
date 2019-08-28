const dao = require('../etl-dao');
const Promise = require("bluebird");
const Moment = require('moment');
const _ = require('lodash');
import {
    BaseMysqlReport
} from '../app/reporting-framework/base-mysql.report'
var processors = require('../etl-processors.js');

export class PatientReferralAggregateService extends BaseMysqlReport{

    constructor(reportName, params) {
        super(reportName, params)
    }
    generateReport(additionalParams) {
        const that = this;
        return new Promise((resolve, reject) => {
            super.generateReport(additionalParams)
                .then((results) => {
                  var pd= processors.processPatientReferral([],results.results,'')  ;

                    resolve(results);
                })
                .catch((error) => {
                    console.error('Patient Referral Aggregate Report generation error: ', error);
                    reject(error);
                });
        });
    }

}
