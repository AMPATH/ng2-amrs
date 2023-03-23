var db = require('../../etl-db');

var defs = {
  getParentLocations: (params) => {
    return new Promise((resolve, reject) => {
      let queryParts = {};
      let sql =
        'select location_id,name,description,uuid from amrs.location where location_id in (select parent_location from amrs.location where location_id in (select location_id from amrs.location_attribute where attribute_type_id = 1 and voided = 0) and parent_location is not null and retired != 1 group by parent_location having count(parent_location) > 1) ';
      queryParts = {
        sql: sql
      };
      return db.queryServer(queryParts, function (result) {
        result.sql = sql;
        resolve(result.result);
      });
    });
  },
  getChildLocations: (params) => {
    return new Promise((resolve, reject) => {
      let queryParts = {};
      let sql =
        'select location_id,name,description,uuid from amrs.location where parent_location = ' +
        params.parentId +
        '';
      queryParts = {
        sql: sql
      };
      return db.queryServer(queryParts, function (result) {
        result.sql = sql;
        resolve(result.result);
      });
    });
  }
};

module.exports = defs;
