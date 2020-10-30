/*jshint -W003, -W097, -W117, -W026 */
'use strict';

var Promise = require('bluebird');
var squel = require('squel');
var _ = require('underscore');
var moment = require('moment');
var connection = require('../../dao/connection/mysql-connection-service.js');
var authorizer = require('../../authorization/etl-authorizer');

var enrollments = {
  getPatientProgramEnrollment: getPatientProgramEnrollment
};

module.exports = enrollments;

function getPatientProgramEnrollment(patientUuid, incompatibleprograms) {
  return new Promise(function (resolve, reject) {
    connection
      .getServerConnection()
      .then(function (conn) {
        var query = squel
          .select()
          .field('pp.uuid')
          .from('amrs.patient_program', 'pp')
          .join('amrs.person', 'p', 'pp.patient_id = p.person_id')
          .join('amrs.program', 'pr', 'pp.program_id = pr.program_id')
          .where('pr.uuid in ?', incompatibleprograms)
          .where('p.uuid = ?', patientUuid)
          .where('pp.date_completed IS NULL')
          .toString();
        conn.query(query, {}, function (err, rows, fields) {
          if (err) {
            reject('Error querying server');
          } else {
            // console.log('patient programs Rows', rows);
            resolve(rows);
          }
          conn.release();
        });
      })
      .catch(function (err) {
        reject('Error establishing connection to MySql Server');
      });
    //amrs patient
  });
}
