'use strict';
var db = require('../../etl-db');
var eidResultsSchema=require('../../eid-lab-results');
module.exports=function(){
  function getEidSyncLog(request,callback){
    var queryParts = {
      columns:[eidResultsSchema.patientLabResultsSchema.parameters[0].name,
    eidResultsSchema.patientLabResultsSchema.parameters[2].name],
      table: eidResultsSchema.patientLabResultsSchema.table.schema+'.'
      +eidResultsSchema.patientLabResultsSchema.table.tableName +' ',
      where: [eidResultsSchema.patientLabResultsSchema.filters[0].expression,
    request.query.patientUuId],
    order:[{
      column: 'date_updated',
      asc: false
    }],
    limit:1
    };
    db.queryServer_test(queryParts, function(result){
      callback(result);
    });
  }
  return{
    getEidSyncLog:getEidSyncLog
  }
}();
