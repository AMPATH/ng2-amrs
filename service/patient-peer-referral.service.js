const dao = require('../etl-dao');
const Promise = require("bluebird");
const Moment = require('moment');
const _ = require('lodash');
import {
    BaseMysqlReport
} from '../app/reporting-framework/base-mysql.report'
import {
    PatientlistMysqlReport
} from '../app/reporting-framework/patientlist-mysql.report'
import {
    PatientReferralAggregateService
} from './patient-referral-aggregate.service'
export class PatientReferralService {


    getAggregateReport(reportParams) {
        reportParams.locationUuids = reportParams.locationUuids ? reportParams.locationUuids.replace(/,/g, "','") : null;
        reportParams.programUuids = reportParams.programUuids ? reportParams.programUuids.replace(/,/g, "','") : null;
        // notificationStatus param can either be ALL or null
        // notificationStatus param with ALL is used to get all patients irrespective of notification status
        // if notificationStatus is not provided : only  patients notification with null notification status are included
        reportParams.notificationStatus = reportParams.notificationStatus ? null : 'null';
        let self = this;
        return new Promise(function (resolve, reject) {
            reportParams.groupBy = 'groupByLocation,groupByProgram';
            reportParams.countBy = 'num_persons';
            let report = new PatientReferralAggregateService('referralAggregate', reportParams);
            Promise.join(report.generateReport(reportParams),
                (results) => {
                    // TODO Do some post processing
                    results = results.results;
                    resolve(results);
                }).catch((errors) => {
                reject(errors);
            });
        });
    }

    getPatientListReport(reportParams) {
        let self = this;
        return new Promise(function (resolve, reject) {
            reportParams.groupBy = 'groupByPerson';
            //TODO: Do some pre processing
            Promise.join(dao.runReport(reportParams),
                (results) => {
                    resolve(results);
                }).catch((errors) => {
                reject(errors);
            });
        });
    }

    getPatientListReport2(reportParams) {
        // let self = this;
        return new Promise(function (resolve, reject) {
            reportParams.groupBy = 'groupByPerson';
            reportParams.notificationStatus = reportParams.notificationStatus ? null : 'null';
            let report = new PatientlistMysqlReport('referralAggregate', reportParams);
            Promise.join(report.generatePatientListReport([]),
                (results) => {
                    // results.result = results.results.results;
                    let data = results;
                    data.result = results.results.results;
                    // let data = results.results.results;
                    resolve(data);
                })
                .catch((errors) => {
                    reject(errors);
                });
        });
    }
}
