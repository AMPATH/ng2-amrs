'use strict';

var db = require('../../etl-db');
var Promise = require('bluebird');
var _ = require('underscore');
var moment = require('moment');
var connection = require('../../dao/connection/mysql-connection-service.js');
var authorizer = require('../../authorization/etl-authorizer');

var enrollment = {
    getActiveProgramEnrollmentSummary : getActiveProgramEnrollmentSummary,
    getActiveProgramEnrollmentsPatientList: getActiveProgramEnrollmentsPatientList
};

module.exports = enrollment;

function getActiveProgramEnrollmentSummary(params) {

      return new Promise(function (resolve, reject) {
        connection.getServerConnection()
        .then(function (conn) {

       var startDate = params.startDate;
       var endDate = params.endDate;
       var locationIds = params.locations;
       var whereClauses = [];

       var columns = "pp.patient_program_id AS patient_program_id, "+
       "count(DISTINCT pp.patient_program_id) as enrollment_count, "+
       "s1.name AS program_name, "+
       "s1.uuid AS program_uuid ";

       var tables = 
       "amrs.patient_program `pp` "+
           "INNER JOIN "+
       "amrs.person `p1` ON (p1.person_id = pp.patient_id) "+
           "INNER JOIN "+
       "amrs.person_name `p3` ON (p1.person_id = p3.person_id) "+
           "INNER JOIN "+
       "amrs.program `s1` ON (pp.program_id = s1.program_id) "+
           "INNER JOIN "+
       "amrs.patient_identifier `i` ON (i.patient_id = pp.patient_id) "+
           "LEFT OUTER JOIN "+
       "amrs.person_attribute t5 ON p1.person_id = t5.person_id "+
           "AND t5.person_attribute_type_id = 28 AND t5.voided  = 0 ";

    

       var groupBy = "GROUP BY pp.program_id";

       var whereClause = buildWhereClause(params);

       var query = "SELECT "+ columns + "FROM " + tables + "WHERE " + whereClause + groupBy;

       // console.log('SQL', query);

       conn.query(query, {}, function (err, rows, fields) {
        if (err) {
            console.log('Error', err);
            reject('Error querying server');
        }
        else {
            resolve(rows);
        }
        conn.release();
        });

});

});
}

function getActiveProgramEnrollmentsPatientList(params) {

    console.log('getActiveProgramEnrollmentsPatientList', params);


    return new Promise(function (resolve, reject) {
      connection.getServerConnection()
      .then(function (conn) {

     var columns =  "pp.patient_id AS person_id, "+
     "GROUP_CONCAT(DISTINCT i.identifier SEPARATOR ', ') AS patient_identifier, CONCAT(COALESCE(p3.given_name, ''), ' ',  COALESCE(p3.middle_name, ''),  ' ',"+
     "COALESCE(p3.family_name, '')) AS patient_name, "+
     "pp.patient_program_id AS patient_program_id, "+
     "pp.location_id AS location_id, "+
     "pp.date_enrolled AS enrolled_date, "+
     "pp.program_id AS program_id, "+
     "p1.uuid AS person_uuid, "+
     "s1.name AS program_name, "+
     "s1.uuid AS program_uuid, "+
     "p1.death_date AS death_date, "+
     "pp.date_completed ";


     var tables = 
     "amrs.patient_program `pp` "+
         "INNER JOIN "+
     "amrs.person `p1` ON (p1.person_id = pp.patient_id) "+
         "INNER JOIN "+
     "amrs.person_name `p3` ON (p1.person_id = p3.person_id) "+
         "INNER JOIN "+
     "amrs.program `s1` ON (pp.program_id = s1.program_id) "+
         "INNER JOIN "+
     "amrs.patient_identifier `i` ON (i.patient_id = pp.patient_id) "+
         "LEFT OUTER JOIN "+
     "amrs.person_attribute t5 ON p1.person_id = t5.person_id "+
         "AND t5.person_attribute_type_id = 28 AND t5.voided  = 0 ";

  

     var groupBy = "GROUP BY patient_program_id";

     var whereClause = buildWhereClause(params);

     var query = "SELECT "+ columns + "FROM " + tables + "WHERE " + whereClause + groupBy;

     // console.log('SQL', query);

     conn.query(query, {}, function (err, rows, fields) {
      if (err) {
          console.log('Error', err);
          reject('Error querying server');
      }
      else {
          resolve(rows);
      }
      conn.release();
      });

});

});
}

function buildWhereClause(params){

    let whereClause =  [];

    whereClause.push("(date_completed IS NULL || date_completed > '" + params.endDate + "')");
    whereClause.push("AND DATE(date_enrolled) >= '" + params.startDate + "' ");
    whereClause.push("AND date_enrolled <= '" + params.endDate +"' ");
    whereClause.push("AND (p1.death_date IS NULL || p1.death_date < '" + params.endDate + "')");
    whereClause.push("AND (t5.value IS NULL OR t5.value = 'false')");

    if(params.programTypeIds.length > 1 ){
        whereClause.push("AND pp.program_id IN (" + params.programTypeIds + ")");
    }

    if(params.locations.length > 0){
        whereClause.push("AND pp.location_id IN (" + params.locations + " )");
    }

    var where = ' ';

    _.each(whereClause,(whereItem)=>{

         where+=(whereItem+ ' ');

    });

   
  return where;


}
