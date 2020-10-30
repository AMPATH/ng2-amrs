/*jshint -W003, -W097, -W117, -W026 */
'use strict';

var db = require('../../etl-db');
var _ = require('underscore');
var reportFactory = require('../../etl-factory');
var helpers = require('../../etl-helpers');
var eidPatientCohortService = require('../../service/eid/eid-patient-cohort.service');
var config = require('../../conf/config');
var etlLogger = require('../../etl-file-logger');

module.exports = {
  loadLabCohorts: loadLabCohorts,
  syncLabCohorts: syncLabCohorts
};

var max_limit = 1000000;

function loadLabCohorts(request, reply) {
  var startDate = request.query.startDate;
  var endDate = request.query.endDate;
  var limit = request.query.limit;
  var offset = request.query.offset;

  load(startDate, endDate, limit, offset)
    .then(function (data) {
      reply(data);
    })
    .catch(function (err) {
      var logger = etlLogger.logger(
        config.logging.eidPath + '/' + config.logging.eidFile
      );
      logger.error('Error Loading lab cohorts: ' + err.stack.split('/n'));
      logger.close();

      reply({
        errorMessage: 'error generating report',
        error: err
      });
    });
}

function syncLabCohorts(request, reply) {
  var startDate = request.query.startDate;
  var endDate = request.query.endDate;
  var locations = request.query.locations;
  var locations_list = [];
  var limit = max_limit;
  var offset = 0;

  var eid_locations = config.eid.locations;

  if (locations && locations.length > 0) {
    var l = locations.trim().split(',');

    for (var i = 0; i < l.length; i++) {
      var has_location = false;
      for (var x = 0; x < eid_locations.length; x++) {
        if (eid_locations[x].name === l[i]) {
          has_location = true;
          break;
        }
      }

      if (has_location) locations_list.push(l[i]);
    }
  }

  var params = {
    startDate: startDate,
    endDate: endDate,
    limit: limit,
    offset: offset,
    locations_list: locations_list
  };

  var responses = {
    success: [],
    fail: []
  };
  var logger = etlLogger.logger(
    config.logging.eidPath + '/' + config.logging.eidFile
  );
  logger.info('starting patient sync..');
  logger.close();
  //load uuids and loop through them
  sync(params, responses, reply);
}

/*
 * Loads records from the db using an encounter date range
 * @params startDate, endDate
 */
function load(startDate, endDate, limit, offset) {
  var qParts = getQueryParts(startDate, endDate, limit, offset);

  return db.queryDb(qParts);
}

function getQueryParts(startDate, endDate, limit, offset) {
  offset = isNaN(offset) ? 0 : offset;
  limit = isNaN(limit) ? max_limit : limit;

  if (!isNaN(limit) && parseInt(limit) > max_limit) limit = max_limit;

  var columns = ['distinct pe.uuid'];

  var qParts = {
    columns: columns,
    table: 'amrs.patient',
    alias: 'p',
    where: ['e.date_created between ? and ?', startDate, endDate],
    leftOuterJoins: [
      ['amrs.person', 'pe', 'pe.person_id = p.patient_id'],
      ['amrs.encounter', 'e', 'e.patient_id = p.patient_id']
    ],
    offset: offset,
    limit: limit
  };

  return qParts;
}

function queuePatientUuids(startDate, endDate, limit, offset) {
  var qParts = getQueryParts(startDate, endDate, limit, offset);

  var selectSql = db.transformQueryPartsToSql(qParts);

  var sql = 'insert into etl.eid_sync_queue (?)';

  sql = sql.replace('?', selectSql.query);
  selectSql.query = sql;

  db.queryReportServer(selectSql, function (result) {});
}

/*
 * Loads records from db and posts them to the sync function.
 * Calls itself until all db records are syncd
 */
function sync(params, responses, reply) {
  var limit = params.limit;

  var logger = etlLogger.logger(
    config.logging.eidPath + '/' + config.logging.eidFile
  );
  logger.info('Loading db data: params: ' + JSON.stringify(params));
  logger.close();

  queuePatientUuids(params.startDate, params.endDate, limit, params.offset);
}

/*
 * Posts an array of uuids to the sync function
 */
function post(locations, data) {
  var arr = [];

  _.each(data.result, function (row) {
    arr.push(row.uuid);
  });

  var logger = etlLogger.logger(
    config.logging.eidPath + '/' + config.logging.eidFile
  );
  logger.info('syncronizing ' + arr.length + ' records');

  return new Promise(function (resolve, reject) {
    eidPatientCohortService.synchronizePatientCohort(arr, locations, function (
      res
    ) {
      logger.info('sync result: %s', JSON.stringify(res));
      logger.close();
      resolve(res);
    });
  });
}
