/**
 * Created by Jonathan on 5/1/2015.
 */
'use strict';
var _ = require('underscore');

var pool = mysql.createPool(config.mysql);

function queryServer(query, values) {
  pool.getConnection(function (err, connection) {
    if (err) {
      result.errorMessage = 'Database Connection Error';
      result.error = err;
      console.log('Database Connection Error');
      callback(result);
      return;
    }
    connection.query(query, values, function (err, rows, fields) {
      connection.release();
      if (err) {
        result.errorMessage = 'Error querying server';
        result.error = err;
      } else {
        result.startIndex = queryParts.offset || queryOffset;
        result.size = rows.length;
        result.result = rows;
      }
      callback(result);
    });
  });
}
function dateDiff(d1, d2, interval) {
  if (typeof d1 === 'string') d1 = new Date(d1);
  if (typeof d2 === 'string') d2 = new Date(d2);
  if (interval === undefined || interval.toLowerCase() === 'day')
    return (d1 - d2) / (24 * 60 * 60 * 1000);
  if (interval.toLowerCase() === 'week')
    return (d1 - d2) / (7 * 24 * 60 * 60 * 1000);
  if (interval.toLowerCase() === 'year')
    return (d1 - d2) / (52 * 7 * 24 * 60 * 60 * 1000);
}

var hivSummary = function (uuid) {
  var that = this;
  this.data = [];
  this.uuid = uuid;
  this.functions = ['getFirstEvidencePatientPregnant'];

  this.document = {
    patient: uuid,
    name: 'hivSummary',
    dateCreated: new Date()
  };

  this.getData = function () {
    var q =
      "select * from etl.flat_obs where uuid='" +
      uuid +
      "' order by encounter_datetime";
    queryServer(query, null, function (data) {
      that.data = data;
    });
  };

  this.toJson = function () {
    return '';
  };

  this.calculate = function () {
    var calculations = [];
    var prev, cur, result, key;
    _.each(data, function (row) {
      cur = [];
      _.each(that.functions, function (f) {
        result = f(row, prev);
        key = result.key;
        cur.push({ key: result.value });
      });
      calculations.push(cur);
      prev = cur;
    });
    this.document.calculations = calculations;
  };

  this.functions.getFirstEvidencePatientPregnant = function (curRow, prevCalc) {
    var value = prevCalc['firstEvidencePatientPregnant'];
    var edd = prevCalc.edd;
    if (
      value === undefined &&
      ([32, 33, 44, 10].indexOf(curEncounter.encounter_type) !== -1 ||
        /\b1279=|\b5596=/.test(curRow.obs))
    )
      value = curRow.encounter_datetime;
    else if (
      value &&
      ([11, 47, 34].indexOf(curRow.encounter_type) !== -1 ||
        dateDiff(value, curRow.encounter_datetime, 'week') > 40 ||
        datediff(value, curRow.encounter_datetime, 'week') > 40 ||
        '/b5599=|/b1156=1065'.test(curRow.obs))
    ) {
      value = null;
    }

    return { key: firstEvidencePatientPregnant, value: value };
  };
};

var schema = {
  personUuid: '',
  encounterDatetime: '',
  hivSummary: {
    lastCD4: { result: 1, date: '' },
    lastVL: { result: 1, date: '' },
    edd: '',
    arv_regimen: {}
  },
  vitals: {
    systolic: '',
    diastolic: '',
    pulse: '',
    oxygenSat: '',
    height: '',
    weight: ''
  },
  labData: [
    { obsUuid: '', obsDatetime: '', value: '', name: '', conceptUuid: '' }
  ],
  imagingData: {},
  medications: {}
};
