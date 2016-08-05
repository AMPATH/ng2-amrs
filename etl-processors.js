"use strict";
var _ = require('underscore');
var helpers = require('./etl-helpers');
var patientFlowProcessor = require('./report-post-processors/patient-flow-processor');
var clinicalComparatorProcessor = require('./report-post-processors/clinic-comparator-processor');

module.exports = function() {
  return {
    convertConceptIdToName: convertConceptIdToName,
    processPatientFlow: processPatientFlow,
    processClinicalComparator:processClinicalComparator
  };

  function convertConceptIdToName(indicators, queryResults,requestIndicators) {
    _.each(indicators, function(indicator) {
      _.each(queryResults.result, function(row) {
        row[indicator] = helpers.getARVNames(row[indicator]);
      });
    });
    return queryResults;
  }

  function processPatientFlow(indicators, queryResults, requestIndicators) {
    //use processor helpers here
    queryResults.result = 
    patientFlowProcessor.groupResultsByVisitId(queryResults.result);
    queryResults.averageWaitingTime = 
    patientFlowProcessor.calculateAverageWaitingTime(queryResults.result);
    queryResults.medianWaitingTime = 
    patientFlowProcessor.calculateMedianWaitingTime(queryResults.result);
    queryResults.incompleteVisitsCount = 
    patientFlowProcessor.getIncompleteVisitsCount(queryResults.result);

    return queryResults;
  }

  function processClinicalComparator(indicators, queryResults,requestIndicators) {
    queryResults.result =
        clinicalComparatorProcessor.groupResultsByMonth(queryResults.result,requestIndicators);

    return queryResults;
  }
}();
