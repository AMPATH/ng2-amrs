/*jshint -W003, -W097, -W117, -W026 */
'use strict';

var Promise = require('bluebird');
var squel = require('squel');
var _ = require('underscore');
var moment = require('moment');
var connection = require('../../dao/connection/mysql-connection-service.js');
var authorizer = require('../../authorization/etl-authorizer');

var motd = {
  getMotdNotifications: getMotdNotifications
};

module.exports = motd;

function getMotdNotifications() {
  return new Promise(function (resolve, reject) {
    connection
      .getServerConnection()
      .then(function (conn) {
        var query = squel
          .select()
          .field('mo.message_id')
          .field('mo.message')
          .field('mo.title')
          .field('mo.startDate')
          .field('mo.expireTime')
          .field('mo.dateCreated')
          .field('mo.alert_type')
          .field('mo.alert_interval')
          .from('etl.motd_messages', 'mo')
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
