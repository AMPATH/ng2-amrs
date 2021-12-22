var db = require('../../etl-db');
const Promise = require('bluebird');

const surgeWeeksDao = {
  getSurgeWeeks: () => {
    return new Promise((resolve, reject) => {
      let sql =
        'select date_format(start_date,"%Y-%m-%d") as start_date , date_format(end_date,"%Y-%m-%d") as end_date, week, formatted_week from etl.surge_week_prod order by start_date desc';
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
