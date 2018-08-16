"use strict";
var _ = require('underscore');
var helpers = require('./etl-helpers');
var patientFlowProcessor = require('./report-post-processors/patient-flow-processor');
var clinicalComparatorProcessor = require('./report-post-processors/clinic-comparator-processor');
var patientReferralProcessor = require('./report-post-processors/patient-referral-processor');

module.exports = function () {
  return {
    convertConceptIdToName: convertConceptIdToName,
    processPatientFlow: processPatientFlow,
    processClinicalComparator: processClinicalComparator,
    findChanges: findChanges,
    processPatientReferral: processPatientReferral,
  };

  function convertConceptIdToName(indicators, queryResults, requestIndicators) {
    
    _.each(indicators, function (indicator) {
      _.each(queryResults.result, function (row) {
        row[indicator] = helpers.getARVNames(row[indicator]);
      });
    });
    return queryResults;
  }

  function findChanges(indicators, queryResults, requestIndicators) {
    var rows = [];
    _.each(queryResults.result, function (row) {
      var current =  row.current_regimen?row.current_regimen.split('##'):null;
      var previous = row.previous_regimen?row.previous_regimen.split('##'):null;
      if (!arraysEqual(current, previous)) {
        rows.push(row);
      }
    });
    return rows;
  }

  function arraysEqual(a, b) {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length != b.length) return false;

    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.

    for (var i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
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
    queryResults.completeVisitsCount =
      patientFlowProcessor.getCompleteVisitsCount(queryResults.result);
    queryResults.totalVisitsCount =
      patientFlowProcessor.getTotalVisitsCount(queryResults.result);
    queryResults.resultsByLocation = patientFlowProcessor.splitResultsByLocation(queryResults.result);
    queryResults.statsByLocation = patientFlowProcessor.calculateStatisticsByLocation(queryResults.resultsByLocation);
    queryResults.hourlyStats = patientFlowProcessor.calculateHourlyStatistics(queryResults.result);

    return queryResults;

  }

  function processClinicalComparator(indicators, queryResults, requestIndicators) {
   let result =
      clinicalComparatorProcessor.groupResultsByMonth(queryResults, requestIndicators);

    return result;
  }

    function processPatientReferral(indicators, queryResults, requestIndicators) {
        queryResults.result =
            patientReferralProcessor.UngroupResults(queryResults.results);
        queryResults.groupedResult =
            patientReferralProcessor.groupResultsByLocation(queryResults.result);
        queryResults.stateNames =
            patientReferralProcessor.getListOfDistinctStatesFromResult(queryResults.result);

        return queryResults;
    }
} ();
