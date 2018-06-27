/*jshint -W003, -W097, -W117, -W026 */
'use strict';
const NodeCache = require('node-cache');
const concept_cache = new NodeCache();
var Promise    = require('bluebird');
var squel      = require('squel');
var _          = require('lodash');
var connection = require('../../dao/connection/mysql-connection-service.js');

var getConceptName = {
  getConceptNames: getConceptNamesFromCacheSync
};

module.exports = getConceptName;

function getConceptNames () {
  
  return new Promise(function (resolve, reject) {
    connection.getServerConnection()
      .then(function (conn) {
        var query = squel.select()
          .field('cn.concept_id')
          .field('cn.name')
          .field('cn.uuid')
          .from('amrs.concept_name', 'cn')
          .toString();
        conn.query(query + ' where concept_name_type is not null', {}, function (err, rows, fields) {
          if (err) {
            reject('Error querying server');
          }
          else {
            resolve(JSON.parse(JSON.stringify(rows)));
          }
          conn.release();
        });
      })
      .catch(function (err) {
        reject('Error establishing connection to MySql Server');
      });
  });
  
}

function getConceptNamesFromCacheSync () {
  return new Promise(function (resolve, reject) {
    concept_cache.get('concept_names', function (err, reply) {
      if (err) {
        reject(err);
      } else {
        
        if (reply == undefined) {
          getConceptNames().then(function (rows) {
            var tests = {};
            _.each(rows, function(concept) {
              tests[concept.concept_id] = concept.name
            });
            concept_cache.set('concept_names', tests, 86400000);
            resolve(tests);
          }).catch(function(_err) {
            reject(_err);
          });
        } else {
          resolve(reply);
        }
      }
    });
  });
}




