/*jshint -W003, -W097, -W117, -W026 */
'use strict';
var _ = require('underscore');
var analytics = require('./dao/analytics/etl-analytics-dao');
var clinic = require('./dao/clinic/etl-clinic-dao');
var patient = require('./dao/patient/etl-patient-dao');
var eid = require('./dao/eid/etl-eid-dao');

module.exports = function() {
  var dao ={};
    _.extend(dao,analytics);
    _.extend(dao,clinic);
    _.extend(dao,patient);
    _.extend(dao,eid);
  return dao;
}();
