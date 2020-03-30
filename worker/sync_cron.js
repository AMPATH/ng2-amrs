var
  db = require('../etl-db'),
  Promise = require('bluebird'),
  http = require('http'),
  config = require('../conf/config'),
  curl = require('curlrequest'),
  _ = require('underscore'),
  format = require('date-format'),
  etlLogger = require('../etl-file-logger');

var App = {

  start: function () {

    var _this = this;
    var logger = etlLogger.logger(config.logging.eidPath + '/sync-cron-info.log');
    this.getPatientsWithResults()
      .then(function (results) {
        return _this.savePatientsWithResults(results);
      })
      .then(function (result) {

        logger.info('sync success: %s', JSON.stringify(result));
        logger.close();
        process.exit(1);
      })
      .catch(function (err) {
        logger.error('sync error: %s', err.message);
        logger.close();
        console.log(err);
        process.exit(1);
      });
  },

  buildUrl: function () {

    var startDate = this.getProcessArg('--start-date');
    var endDate = this.getProcessArg('--end-date');

    if (!startDate) {

      startDate = new Date();
      startDate.setDate(startDate.getDate() - 1);
      startDate = format('yyyy-MM-dd', startDate);

      endDate = new Date();
      endDate = format('yyyy-MM-dd', endDate);
    }

    var protocol = config.etl.tls ? 'https' : 'http';

    var url = protocol + '://' + config.etl.host + ':' + config.etl.port +
      '/etl/eid/patients-with-results?startDate=' + startDate + '&endDate=' + endDate;
    return url;
  },

  getPatientsWithResults: function () {

    var url = this.buildUrl();

    var usernamePass = config.eidSyncCredentials.username + ":" + config.eidSyncCredentials.password;
    var auth = "Basic " + new Buffer(usernamePass).toString('base64');

    var options = {
      url: url,
      headers: {
        'Authorization': auth
      }
    }

    return new Promise(function (resolve, reject) {

      curl.request(options, function (err, parts) {

        if (!err) {
          resolve(parts);
        } else {
          reject(err);
        }
      });
    });
  },

  savePatientsWithResults(results) {

    results = results.replace('[', "").replace(']', ""); // TODO - use regex

    console.log('Results...', results);

    var sql = 'replace into etl.eid_sync_queue(person_uuid) select distinct p.uuid from amrs.person p left join amrs.patient_identifier i on p.person_id = i.patient_id where identifier in (?)';
    sql = sql.replace('?', results);

    var queryObject = {
      query: sql,
      sqlParams: []
    }

    return new Promise(function (resolve, reject) {
      db.queryReportServer(queryObject, function (result) {
        console.log(result);
        resolve(result);
      });
    });
  },

  getProcessArg(arg) {

    var val = null;

    var args = process.argv;
    _.each(args, function (row) {
      if (row.indexOf(arg) != -1) {
        val = row.split('=')[1];
      }
    });
    return val;
  }
};

App.start();