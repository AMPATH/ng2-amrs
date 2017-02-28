'use strict';
var db = require('../../etl-db');
var eidResultsSchema=require('../../eid-lab-results');
module.exports = {
  getEidSyncLog: getEidSyncLog
}

function getEidSyncLog(request,callback) {
  var queryParts = {
    columns: eidResultsSchema.patientLabResultsSchema.columns,
    table: eidResultsSchema.patientLabResultsSchema.table.schema + '.' + eidResultsSchema.patientLabResultsSchema.table.tableName,
    where: [
      eidResultsSchema.patientLabResultsSchema.filters[0].expression,
      request.query.patientUuId
    ],
    order: [
      {
        column: 'date_updated',
        asc: false
      }
    ],
    limit: 3
  };

  return new Promise(function(resolve, reject) {
    db.queryServer_test(queryParts, function(result) {

      if(callback)
        callback(result);

      resolve(result);
    });
  });

}
