/*jshint -W003, -W097, -W117, -W026 */
'use strict';

var Promise = require('bluebird');
var squel = require('squel');
var _ = require('underscore');
var moment = require('moment');
var connection = require('../../dao/connection/mysql-connection-service.js');
var authorizer = require('../../authorization/etl-authorizer');

var encounterType = {
  getEncounterTypes: getEncounterTypes
};

module.exports = encounterType;

function getEncounterTypes() {
  return new Promise(function (resolve, reject) {
    connection
      .getServerConnection()
      .then(function (conn) {
        var query = squel
          .select()
          .field('et.encounter_type_id')
          .field('et.name')
          .field('et.uuid')
          .from('amrs.encounter_type', 'et')
          .toString();
        conn.query(query, {}, function (err, rows, fields) {
          if (err) {
            reject('Error querying server');
          } else {
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
