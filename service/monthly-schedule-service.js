const dao = require('../etl-dao');
const Promise = require("bluebird");
const Moment = require('moment');
const _ = require('lodash');
export class MonthlyScheduleService {

    getMonthlyScheduled(reportParams) {
        //let attendedParams = Object.assign(reportParams, { reportName: 'attended' });
        // let scheduledParams = Object.assign(reportParams, { reportName: 'scheduled' });
        let self = this;
        return new Promise(function (resolve, reject) {
            Promise.join(self.getAttended(reportParams), self.getScheduled(reportParams), self.getHasNotReturned(reportParams),
                (attended, scheduled, hasNotReturned) => {
                    console.log('Has Not Returned', hasNotReturned)
                    let attendedResponse = self.buildAttendedResponse(attended);
                    let scheduledResponse = self.buildScheduledResponse(scheduled);
                    let hasNotReturnedResponse = self.buildHasnoReturnedResponse(hasNotReturned);
                    let combinedResponse = attendedResponse.concat(scheduledResponse).concat(hasNotReturnedResponse);
                    let grouped = _.groupBy(combinedResponse, (row) => {
                        return row.date;
                    });
                    let results = _.chain(combinedResponse).groupBy("date").map(function (v, i) {
                        return {
                            date: i,
                            count: _.map(v, 'count').reduce(function (acc, x) {
                                for (let key in x) acc[key] = x[key];
                                return acc;
                            }, {})
                        }
                    }).value();
                    resolve({ results: results });
                }).catch((errors) => {
                    reject(errors);
                });
        });
    }

    getAttended(reportParams) {
        reportParams['reportName'] = 'attended';
        return dao.runReport(reportParams);
    }

    getScheduled(reportParams) {
        reportParams['reportName'] = 'scheduled';
        return dao.runReport(reportParams);
    }

    getHasNotReturned(reportParams) {
        reportParams['reportName'] = 'has-not-returned-report';
        return dao.runReport(reportParams);
    }

    buildAttendedResponse(payload) {
        let data = payload.result.map(function (row) {
            let utc = Moment.utc(row.attended_date).utcOffset(+3).toDate();
            return {
                count: {
                    attended: row.attended,
                },
                date: Moment(utc).local().format('YYYY-MM-DD')
            }
        });
        return data;
    }

    buildScheduledResponse(payload) {
        let data = payload.result.map(function (row) {
            return {
                count: {
                    scheduled: row.scheduled
                },
                date: row.scheduled_date
            }
        });
        return data;
    }

    buildHasnoReturnedResponse(payload) {
        let data = payload.result.map(function (row) {
            return {
                count: {
                    has_not_returned: row.has_not_returned
                },
                date: row.d
            }
        });
        return data;
    }
}