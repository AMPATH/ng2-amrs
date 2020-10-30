const dao = require('../etl-dao');
const Promise = require('bluebird');
const Moment = require('moment');
const _ = require('lodash');
export class labOrdersService {
  getAggregateReport(reportParams) {
    let self = this;
    return new Promise(function (resolve, reject) {
      reportParams.groupBy = 'groupByOrderId';
      Promise.join(dao.runReport(reportParams), (results) => {
        resolve(results);
        //TODO Do some post processing
      }).catch((errors) => {
        reject(errors);
      });
    });
  }
}
