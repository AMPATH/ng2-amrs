/*jshint -W003, -W097, -W117, -W026 */
'use strict';

var Promise = require('bluebird');
var squel = require('squel');
var _ = require('underscore');
var moment = require('moment');
var connection = require('../../dao/connection/mysql-connection-service.js');
var authorizer = require('../../authorization/etl-authorizer');

var double_enrollment_check = {
    getDoubleEnrollment : getDoubleEnrollment
};

module.exports = double_enrollment_check;

//check if patient is enrolled to a program before autoenrolling to prevent double enrollment
function getDoubleEnrollment(patientUuid,programUuid) {

    return new Promise(function (resolve, reject) {

            connection.getServerConnection()
            .then(function (conn) {
                   var query = squel.select()
                    .field('count(*) as count')
                    .from('amrs.patient_program', 'pp')
                    .join('amrs.person','p','pp.patient_id = p.person_id')
                    .join('amrs.program','pr','pp.program_id = pr.program_id')
                    .where('p.uuid = ?',patientUuid)
                    .where('pr.uuid = ?', programUuid)
                    .where('pp.date_completed IS NULL')
                    .toString();
                conn.query(query, {}, function (err, rows, fields) {
                    if (err) {
                      console.log(err);
                        reject('Error querying server');
                    }
                    else {
                    
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

};
