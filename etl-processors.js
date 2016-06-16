"use strict";
var _ = require('underscore');
var helpers = require('./etl-helpers');
var patientFlowProcessor = require('./report-post-processors/patient-flow-processor');

module.exports = function() {
  return {
    convertConceptIdToName: convertConceptIdToName,
    processPatientFlow: processPatientFlow
  };

  function convertConceptIdToName(indicators, queryResults) {
    _.each(indicators, function(indicator) {
      _.each(queryResults.result, function(row) {
        row[indicator] = helpers.getARVNames(row[indicator]);
      });
    });
    return queryResults;
  }

  function processPatientFlow(indicators, queryResults) {
    //use processor helpers here
    queryResults.result = 
    patientFlowProcessor.groupResultsByVisitId(queryResults.result);
    
    return queryResults;
  }
}();
