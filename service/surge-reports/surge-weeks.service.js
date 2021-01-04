var db = require('../../etl-db');
const Promise = require('bluebird');

const surgeWeeksDao = {
  getSurgeWeeks: () => {
    return new Promise((resolve, reject) => {
      let sql = 'select * from etl.surge_week order by start_date desc';
      let queryParts = {
        sql: sql
      };
      db.queryServer(queryParts, function (result) {
        result.sql = sql;
        resolve(result);
      });
    });
  }
};

module.exports = surgeWeeksDao;
