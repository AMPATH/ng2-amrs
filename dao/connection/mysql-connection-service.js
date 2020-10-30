/*jshint -W003, -W097, -W117, -W026 */
'use strict';

var mysql = require('mysql');
var Promise = require('bluebird');
var config = require('../../conf/config');

var pool = mysql.createPool(config.mysql);

var def = {
  getServerConnection: getServerConnection
};

module.exports = def;

function getServerConnection() {
  return new Promise(function (resolve, reject) {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err);
      } else {
        resolve(connection);
      }
    });
  });
}
