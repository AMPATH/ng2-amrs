'use strict';
var _ = require('underscore');
var __ = require('lodash');
var helpers = require('./etl-helpers');
var patientFlowProcessor = require('./report-post-processors/patient-flow-processor');
var clinicalComparatorProcessor = require('./report-post-processors/clinic-comparator-processor');
var patientReferralProcessor = require('./report-post-processors/patient-referral-processor');
var concept_name_dao = require('./dao/concepts/concept-name-dao.js');

module.exports = (function () {
  return {
    convertConceptIdToName: convertConceptIdToName,
    convertCdmConceptIdToName: convertCdmConceptIdToName,
    cdmMedicationChange: cdmMedicationChange,
    processPatientFlow: processPatientFlow,
    processClinicalComparator: processClinicalComparator,
    findChanges: findChanges,
    processPatientReferral: processPatientReferral
  };

  function convertConceptIdToName(indicators, queryResults, requestIndicators) {
    _.each(indicators, function (indicator) {
      _.each(queryResults.result, function (row) {
        row[indicator] = helpers.getARVNames(row[indicator]);
      });
    });
    return queryResults;
  }

  function convertCdmConceptIdToName(
    indicators,
    queryResults,
    requestIndicators
  ) {
    return new Promise(function (resolve, reject) {
      concept_name_dao
        .getConceptNames()
        .then(function (tests) {
          _.each(indicators, function (indicator) {
            _.each(queryResults.result, function (row) {
              row[indicator + '_name'] = helpers.getCDMNames(
                tests,
                row[indicator]
              );
            });
          });
          resolve(queryResults);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  }

  function findChanges(indicators, queryResults, requestIndicators) {
    var rows = [];
    _.each(queryResults.result, function (row) {
      var current = row.current_regimen
        ? row.current_regimen.split('##')
        : null;
      var previous = row.previous_regimen
        ? row.previous_regimen.split('##').sort()
        : null;
      if (!arraysEqual(current, previous)) {
        rows.push(row);
      }
    });
    return rows;
  }

  function cdmMedicationChange(results) {
    var rows = [];
    var med_results = results.result;
    med_results = __.reverse(med_results);
    _.each(med_results, function (row, index) {
      var row_promise = new Promise(function (resolve, reject) {
        var current = row.prescriptions
          ? row.prescriptions.split('##').sort()
          : null;
        var previous = '';
        if (index > 0) {
          var previousRow = med_results[index - 1];
          previous = previousRow.prescriptions
            ? previousRow.prescriptions.split('##').sort()
            : null;
        }
        var diff = _.difference(previous, current);
        if (diff.length > 0) {
          if (row.prescriptions) {
            addCdmMedicationChangeStatus(row)
              .then(function (presc) {
                resolve({
                  prescriptions: presc,
                  encounter_datetime: row.encounter_datetime
                });
              })
              .catch(function (err) {});
          } else {
            resolve({ prescriptions: null, encounter_datetime: null });
          }
        } else {
          resolve({ prescriptions: null, encounter_datetime: null });
        }
      });
      rows.push(row_promise);
    });
    return Promise.all(rows).then(function (_rows) {
      var fiData = __.uniqBy(_rows, function (e) {
        return e.encounter_datetime;
      });

      results.result = __.reverse(fiData);
      return Promise.resolve(results);
    });
  }

  function addCdmMedicationChangeStatus(dataRow) {
    var prescription = dataRow.prescriptions;
    var DRUG_DOSE = 1899;
    var FREQUENCY = 1896;
    var DIABETES_TREATMENT_PLAN = 7306;
    var HTN_TREATMENT_PLAN = 7333;
    var DIABETES_TREATMENT_STARTED = 7304;
    var HTN_TREATMENT_STARTED = 7332;
    var rows = [];
    var prescriptions = prescription.split('$');

    return new Promise(function (resolve, reject) {
      concept_name_dao
        .getConceptNames()
        .then(function (concepts) {
          _.each(prescriptions, function (row) {
            var prescription_details = row.split('##');
            var result = {
              medication_plan: '',
              meds: '',
              dose: '',
              frequency: '',
              date: ''
            };
            _.each(prescription_details, function (details) {
              var hasStatus = details.includes(DIABETES_TREATMENT_PLAN);
              var hasHtnStatus = details.includes(HTN_TREATMENT_PLAN);
              result['original_prescription'] = dataRow.prescriptions;
              result['dm_meds'] = dataRow.dm_meds;
              result['htn_meds'] = dataRow.htn_meds;

              if (hasStatus || hasHtnStatus) {
                var status = details.split('=')[1].replace('!!', '').trim();
                result['medication_plan'] = helpers.getConceptNames(
                  concepts,
                  status
                )
                  ? helpers.getConceptNames(concepts, status)
                  : status;
              }

              var meds = details.includes(DIABETES_TREATMENT_STARTED);
              var htnMeds = details.includes(HTN_TREATMENT_STARTED);
              if (meds || htnMeds) {
                var med = details.split('=')[1].replace('!!', '').trim();
                result['meds'] = helpers.getConceptNames(concepts, med)
                  ? helpers.getConceptNames(concepts, med)
                  : med;
              }

              var dosed = details.includes(DRUG_DOSE);
              if (dosed) {
                var dose = details.split('=')[1].replace('!!', '').trim();
                result['dose'] = dose ? dose : ' ';
              }

              var drug_frequency = details.includes(FREQUENCY);
              if (drug_frequency) {
                var drugFrequency = details
                  .split('=')[1]
                  .replace('!!', '')
                  .trim();
                result['frequency'] = helpers.getConceptNames(
                  concepts,
                  drugFrequency
                )
                  ? helpers.getConceptNames(concepts, drugFrequency)
                  : drugFrequency;
              }
            });
            rows.push(result);
          });

          resolve(rows);
        })
        .catch(function (err) {
          reject(err);
        });
    });
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
    queryResults.result = patientFlowProcessor.groupResultsByVisitId(
      queryResults.result
    );
    queryResults.averageWaitingTime = patientFlowProcessor.calculateAverageWaitingTime(
      queryResults.result
    );
    queryResults.medianWaitingTime = patientFlowProcessor.calculateMedianWaitingTime(
      queryResults.result
    );
    queryResults.incompleteVisitsCount = patientFlowProcessor.getIncompleteVisitsCount(
      queryResults.result
    );
    queryResults.completeVisitsCount = patientFlowProcessor.getCompleteVisitsCount(
      queryResults.result
    );
    queryResults.totalVisitsCount = patientFlowProcessor.getTotalVisitsCount(
      queryResults.result
    );
    queryResults.resultsByLocation = patientFlowProcessor.splitResultsByLocation(
      queryResults.result
    );
    queryResults.statsByLocation = patientFlowProcessor.calculateStatisticsByLocation(
      queryResults.resultsByLocation
    );
    queryResults.hourlyStats = patientFlowProcessor.calculateHourlyStatistics(
      queryResults.result
    );

    return queryResults;
  }

  function processClinicalComparator(
    indicators,
    queryResults,
    requestIndicators
  ) {
    let result = clinicalComparatorProcessor.groupResultsByMonth(
      queryResults,
      requestIndicators
    );

    return result;
  }

  function processPatientReferral(indicators, queryResults, requestIndicators) {
    queryResults.result = patientReferralProcessor.UngroupResults(
      queryResults.results
    );
    queryResults.groupedResult = patientReferralProcessor.groupResultsByLocation(
      queryResults.result
    );

    return queryResults;
  }
})();
