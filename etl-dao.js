/*jshint -W003, -W097, -W117, -W026 */
'use strict';
var _ = require('underscore');
var analytics = require('./dao/analytics/etl-analytics-dao');
var patientCareStatus = require('./dao/analytics/patient-care-status-analysis-dao');
var clinic = require('./dao/clinic/etl-clinic-dao');
var patient = require('./dao/patient/etl-patient-dao');
var eid = require('./dao/eid/etl-eid-dao');
var session = require('./dao/session/session');
var labCohorts = require('./dao/lab-cohorts/lab-cohorts-dao');
var formErrors = require('./dao/form-entry/errors-dao.js');

module.exports = (function () {
  var dao = {};
  _.extend(dao, analytics);
  _.extend(dao, patientCareStatus);
  _.extend(dao, clinic);
  _.extend(dao, patient);
  _.extend(dao, eid);
  _.extend(dao, session);
  _.extend(dao, labCohorts);
  _.extend(dao, formErrors);
  return dao;
})();
