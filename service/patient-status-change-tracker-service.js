const dao = require('../etl-dao');
const Promise = require("bluebird");
const Moment = require('moment');
const _ = require('lodash');
export class PatientStatusChangeTrackerService {

    getAggregateReport(reportParams) {
        let self = this;
        return new Promise(function (resolve, reject) {
            reportParams.groupBy = 'groupByEndDate';
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
        // patients_gained= [new_patients]+[transfer_in]+[LTFU_to_active_in_care]
        // patients_lost= [transfer_out_patients]+[deaths]+[active_in_care_to_LTFU]
        reportParams['reportName'] = 'patient-status-change-tracker-report';
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