/*jshint -W003, -W097, -W117, -W026 */
'use strict';

var Promise = require('bluebird');
var squel = require('squel');
var _ = require('underscore');
var moment = require('moment');

var apiHivUnenrollCall = {
  unEnrollHivCall: unEnrollHivCall
};

module.exports = apiHivUnenrollCall;

function unEnrollHivCall() {
  return new Promise(function (resolve, reject) {});
}
