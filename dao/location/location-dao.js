/*jshint -W003, -W097, -W117, -W026 */
'use strict';

var Promise = require('bluebird');
var squel = require('squel');
var _ = require('underscore');
var moment = require('moment');
var connection = require('../../dao/connection/mysql-connection-service.js');
var authorizer = require('../../authorization/etl-authorizer');

var locations = {
    getLocations : getLocations
};

module.exports = locations;

function getLocations() {

    return new Promise(function (resolve, reject) {
            connection.getServerConnection()
            .then(function (conn) {
                   var query = squel.select()
                    .field('l.location_id')
                    .field('l.name')
                    .field('l.uuid')
                    .from('amrs.location', 'l')
                    .toString();
                conn.query(query, {}, function (err, rows, fields) {
                    if (err) {
                        reject('Error querying server');
                    }
                    else {
                        // console.log('Location Rows', rows);
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




