const
  db = require('../etl-db'),
  Promise = require('bluebird'),
  https = require('http'),
  config = require('../conf/config'),
  moment = require('moment'),
  curl = require('curlrequest'),
  _ = require('underscore'),
  program_config = require('../programs/patient-program-config'),
  patient_programs = require('../dao/enrollment/enrollment-patient-program-dao'),
  check_program_enrollment = require('../dao/enrollment/double-enrollment-check');
const cron = require("node-cron");


var App = {

  stateTracker: false,

  start: function() {
    let _this = this;
    this.loadQueueData()
      .then(function(data) {
        if (data.length > 0) {
          App.process(data)
            .then(function() {
              return App.deleteProcessed(data)
            }).then(function(deleted) {

            }).catch(function(err) {
              console.log(err);
            })
        } else {
          console.log('No data in the queue', new Date());
          //process.exit(1);
        }
      });
  },
  process: function(data) {
    let arrayList = [];
    let promise = new Promise(function(resolve, reject) {
      data.forEach((arrayItem) => {
        const key = arrayItem.program_uuid;
        const person_uuid = arrayItem.person_uuid;
        let list = [];
        if (program_config[key].incompatibleWith && program_config[key].incompatibleWith.length > 0) {
          list = program_config[key].incompatibleWith;
          _.each(list, function(item) {
            patient_programs.getPatientProgramEnrollment(person_uuid, list)
              .then(function(rows) {
                if (rows && rows.length !== 0) {
                  _.each(rows, function(row) {
                    App.unEnrollIfIncompatible(row.uuid);
                    resolve()
                  })
                  App.enroll(person_uuid, key);
                } else {
                  App.enroll(person_uuid, key);
                  resolve()
                }
              })
          })
        } else {
          App.enroll(person_uuid, key);
          resolve()
        }
      })
    });
    return promise;
  },
  loadQueueData: function() {
    let limit = 100;

    var sql = 'select * from etl.program_registration_queue limit ?';
    var qObject = {
      query: sql,
      sqlParams: [limit]
    };
    return new Promise(function(resolve, reject) {
      db.queryReportServer(qObject, function(data) {
        resolve(data.result);
      });
    });
  },
  unEnrollIfIncompatible: function(uuid) {

    let protocol = config.etl.tls ? 'https' : 'http';

    let date = moment().format('YYYY-MM-DD');

    let openmrsAppName = config.openmrs.applicationName || 'amrs';
    let payload = {
      dateCompleted: date,
      uuid: uuid
    }

    var url = protocol + '://' + config.openmrs.host + ':' + config.openmrs.port + '/' + openmrsAppName + '/ws/rest/v1/programenrollment/' +
      payload.uuid;

    delete payload['uuid'];
    payload = JSON.stringify(payload);

    var usernamePass = config.eidSyncCredentials.username + ":" + config.eidSyncCredentials.password;
    var auth = "Basic " + Buffer.from(usernamePass).toString('base64');

    var options = {
      url: url,
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth
      },
      method: 'POST'
    };

    return new Promise(function(resolve, reject) {
      curl.request(options, function(err, parts) {
        if (err || (parts && JSON.parse(parts).error)) {
          console.log(parts && JSON.parse(parts).error);
          console.log('error unenrolling to program');
          reject(err)
          //log error to file or db
        } else {
          console.log('unenrolling to  program: ');
          resolve('str')
        }
      });
    })
  },

  enroll: function(person_uuid, program_uuid) {

    let dateEnrolled = moment().format('YYYY-MM-DD');

    var openmrsAppName = config.openmrs.applicationName || 'amrs';
    var payload = {
      program: program_uuid,
      patient: person_uuid,
      dateEnrolled: dateEnrolled

    }
    var protocol = config.openmrs.https ? 'https' : 'http';
    var url = protocol + '://' + config.openmrs.host + ':' + config.openmrs.port + '/' + openmrsAppName + '/ws/rest/v1/programenrollment/';

    var usernamePass = config.eidSyncCredentials.username + ":" + config.eidSyncCredentials.password;
    var auth = "Basic " + Buffer.from(usernamePass).toString('base64');

    payload = JSON.stringify(payload);

    var options = {
      url: url,
      data: payload,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth
      },
      method: 'POST'
    };
    return new Promise(function(resolve, reject) {

      curl.request(options, function(err, parts) {

        if (err || (parts && JSON.parse(parts).error)) {
          console.log((parts && JSON.parse(parts).error));
          console.log('error enrolling patient into program');
          //log to file or database
          reject('error enrolling patient into viremia')
        } else {
          console.log('Enrolled Patient Into Standard HIV Treatment');
          resolve('Enrolled Patient Into Program');
        }

      });
    })
  },
  deleteProcessed: function(data) {
    let lst = [];
    for (var i = 0; i < data.length; i++) {
      var row = data[i];
      lst.push(row.person_uuid);
    }

    var sql = 'delete from etl.program_registration_queue where person_uuid in (?)';

    var qObject = {
      query: sql,
      sqlParams: [lst]
    }
    return new Promise(function(resolve, reject) {
      try {
        db.queryReportServer(qObject, function(result) {
          console.log(result);
          resolve(result);
        });
      } catch (e) {
        //TODO - ignoring delete
        resolve(e);
      }
    });
  },

  init: function() {
      cron.schedule('* * * * *',function(){
        try {
          App.start();
        } catch (e) {
          console.log(`Error occured when starting app ${e}`);
        }
      })
  }
}
App.init();

//module.exports = App;
