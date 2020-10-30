var _ = require('underscore');
var moment = require('moment');

var moduleExport = {
  groupResultsByMonth: groupResultsByMonth
};

module.exports = moduleExport;

function getListOfLocationIdsFromResult(results) {
  var locations = [];
  var unique = {};
  for (var i in results) {
    if (typeof unique[results[i].location_id] == 'undefined') {
      locations.push(results[i].location_id);
    }
    unique[results[i].location_id] = 0;
  }
  return locations;
}

function getListOfDistinctMonthFromResult(results) {
  var months = [];
  var unique = {};
  for (var i in results) {
    if (typeof unique[results[i].reporting_month] == 'undefined') {
      months.push(results[i].reporting_month);
    }
    unique[results[i].reporting_month] = 0;
  }
  return months;
}
function groupResultsByMonth(results, indicator) {
  //stringify
  results = JSON.stringify(results);
  results = JSON.parse(results);
  var finalReport = [];
  var locationIds = getListOfLocationIdsFromResult(results);
  var distinctMonth = getListOfDistinctMonthFromResult(results);
  //construct month
  _.each(distinctMonth, function (month) {
    var row = {};
    var data = [];
    _.each(results, function (result) {
      if (month === result.reporting_month) {
        row['month'] = result.reporting_month;
        row[result.location] = result[indicator];
        _.each(locationIds, function (locationId) {
          if (locationId === result.location_id) {
            data.push({
              location_uuid: result.location_uuid,
              location_id: result.location_id,
              indicator: result[indicator],
              location: result.location
            });
          }
        });
      }
    });
    row['data'] = data;
    finalReport.push(row);
  });

  return finalReport;
}
