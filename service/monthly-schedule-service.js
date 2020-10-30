const dao = require('../etl-dao');
const Promise = require('bluebird');
const Moment = require('moment');
const _ = require('lodash');
import { BaseMysqlReport } from '../app/reporting-framework/base-mysql.report';
import { throws } from 'assert';

export class MonthlyScheduleService {
  getMonthlyScheduled(reportParams) {
    //let attendedParams = Object.assign(reportParams, { reportName: 'attended' });
    // let scheduledParams = Object.assign(reportParams, { reportName: 'scheduled' });
    let self = this;
    return new Promise(function (resolve, reject) {
      Promise.join(
        self.getAttended(reportParams),
        self.getScheduled(reportParams),
        self.getHasNotReturned(reportParams),
        (attended, scheduled, hasNotReturned) => {
          let attendedResponse = self.buildAttendedResponse(
            attended.results.results
          );
          let scheduledResponse = self.buildScheduledResponse(
            scheduled.results.results
          );
          let hasNotReturnedResponse = self.buildHasnoReturnedResponse(
            hasNotReturned.results.results
          );
          let combinedResponse = attendedResponse
            .concat(scheduledResponse)
            .concat(hasNotReturnedResponse);
          let grouped = _.groupBy(combinedResponse, (row) => {
            return row.date;
          });
          let results = _.chain(combinedResponse)
            .groupBy('date')
            .map(function (v, i) {
              return {
                date: i,
                count: _.map(v, 'count').reduce(function (acc, x) {
                  for (let key in x) acc[key] = x[key];
                  return acc;
                }, {})
              };
            })
            .value();
          resolve({
            reports: {
              attended: attended,
              scheduled: scheduled,
              hasNotReturned: hasNotReturned
            },
            results: results
          });
        }
      ).catch((errors) => {
        reject(errors);
      });
    });
  }

  getAttended(reportParams) {
    let report = new BaseMysqlReport('dailyAttendanceAggregate', reportParams);
    return report.generateReport();
  }

  getScheduled(reportParams) {
    let report = new BaseMysqlReport(
      'dailyAppointmentsAggregate',
      reportParams
    );
    return report.generateReport();
  }

  getHasNotReturned(reportParams) {
    let report = new BaseMysqlReport(
      'dailyHasNotReturnedAggregate',
      reportParams
    );
    return report.generateReport();
  }

  buildAttendedResponse(payload) {
    try {
      let data = payload.map(function (row) {
        let utc = Moment.utc(row.attended_date)
          .utcOffset(+3)
          .toDate();
        return {
          count: {
            attended: row.attended
          },
          date: Moment(utc).local().format('YYYY-MM-DD')
        };
      });
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  buildScheduledResponse(payload) {
    try {
      let data = payload.map(function (row) {
        return {
          count: {
            scheduled: row.scheduled
          },
          date: row.scheduled_date
        };
      });
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  buildHasnoReturnedResponse(payload) {
    try {
      let data = payload.map(function (row) {
        return {
          count: {
            has_not_returned: row.has_not_returned
          },
          date: row.d
        };
      });
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}
