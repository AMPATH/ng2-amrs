"use strict";
var _ = require('underscore');
var helpers = require('./etl-helpers');
module.exports = function() {
  return {
    convertConceptIdToName: convertConceptIdToName,
  };

  function convertConceptIdToName(indicators, queryResults) {
    _.each(indicators, function(indicator) {
      _.each(queryResults.result, function(row) {
        row[indicator] = helpers.getARVNames(row[indicator]);
      });
    });
    return queryResults;
  }
}();
