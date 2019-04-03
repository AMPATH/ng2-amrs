'use strict';
var Promise = require('bluebird');
var db = require('../../etl-db');
var squel = require('squel');
var connection = require('../../dao/connection/mysql-connection-service.js');

var def = {
    getPatientInitialEncounters: getPatientInitialEncounters
};

module.exports = def;

function getPatientInitialEncounters(patientUuid) {   
    return new Promise(function (resolve, reject) {
        connection.getServerConnection()
        .then(function (conn) {
               var query = squel.select()
                .field('COUNT(*) AS initial_encounters')
                .from('etl.flat_hiv_summary_v15b', 't1')
                .where("t1.uuid = ?", patientUuid)
                .where("t1.encounter_type IN ?", [1,3,105])
                .toString();
            conn.query(query, {}, function (err, rows, fields) {
                if (err) {
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



});

}

