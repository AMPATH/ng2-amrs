/*jshint -W003, -W097, -W117, -W026 */
'use strict';
import { BaseMysqlReport } from '../../app/reporting-framework/base-mysql.report';

var Promise = require('bluebird');
var noteService = require('../../service/notes.service');
var encounterService = require('../../service/openmrs-rest/encounter.js');
var db = require('../../etl-db');
var _ = require('lodash');
var Boom = require('boom'); //extends Hapi Error Reporting. Returns HTTP-friendly error objects: github.com/hapijs/boom
var helpers = require('../../etl-helpers');
var patientReminderService = require('../../service/patient-reminder.service.js');

module.exports = (function () {
  function getPatientHivSummary(request, callback) {
    var uuid = request.params.uuid;
    var order = helpers.getSortOrder(request.query.order);
    var includeNonClinicalEncounter = Boolean(true || false);
    var whereClause =
      includeNonClinicalEncounter === true
        ? ['uuid = ?', uuid]
        : [
            'uuid = ?  and t1.encounter_type in (1,2,3,4,17,21,110,117,99999)',
            uuid
          ];
    var queryParts = {
      columns: request.query.fields || '*',
      table: 'etl.flat_hiv_summary_v15b',
      where: whereClause,
      order: order || [
        {
          column: 'encounter_datetime',
          asc: false
        }
      ],
      offset: request.query.startIndex,
      limit: request.query.limit
    };

    var qParts = {
      columns: '*',
      table: 'amrs.encounter_type',
      where: ['retired = ?', 0],
      offset: request.query.startIndex,
      limit: 1000
    };

    var encounterTypeNames = {};
    //get encounter type Name
    var encounterNamesPromise = db.queryDb(qParts);
    var summaryDataPromise = db.queryDb(queryParts);

    var promise = Promise.all([encounterNamesPromise, summaryDataPromise])
      .then(function (data) {
        var encTypeNames = data[0];
        var summaryData = data[1];

        // Map encounter type ids to names.
        _.each(encTypeNames.result, function (row) {
          encounterTypeNames[row.encounter_type_id] = row.name;
        });

        // Format & Clean up raw summaries
        _.each(summaryData.result, function (summary) {
          summary.cur_arv_meds_id = summary.cur_arv_meds;
          summary.arv_first_regimen_id = summary.arv_first_regimen;
          summary.cur_arv_meds = helpers.getARVNames(summary.cur_arv_meds);
          summary.arv_first_regimen = helpers.getARVNames(
            summary.arv_first_regimen
          );
          summary.contraceptive_method = helpers.getContraceptiveMethod(
            summary.contraceptive_method
          );
          summary['encounter_type_name'] =
            encounterTypeNames[summary.encounter_type];
          summary['prev_encounter_type_name'] =
            encounterTypeNames[summary.prev_encounter_type_hiv];
          // console.log("menstruaction status", summary.menstruation_status, summary.encounter_datetime);
        });

        // Return when done.
        return summaryData;
      })
      .catch((error) => {
        console.error('EROR : GetPatientHivSummary', error);
      });

    if (_.isFunction(callback)) {
      promise
        .then(function (result) {
          callback(result);
        })
        .catch(function (err) {
          callback(err);
        });
    }

    return promise;
  }

  function getPatientOncologySummary(request, callback) {
    let queryParts = {
      columns: request.query.fields || '*',
      order: [
        {
          column: 'encounter_datetime',
          asc: false
        }
      ]
    };

    getOncologyPatientReport(request, queryParts)
      .then((data) => {
        let oncSummary = data;

        _.each(oncSummary.result, (summary) => {
          summary.diagnosis =
            summary.cancer_type && summary.cancer_subtype
              ? helpers.titleCase(helpers.getConceptName(summary.cancer_type)) +
                ' - ' +
                helpers.titleCase(
                  helpers.getConceptName(summary.cancer_subtype)
                )
              : helpers.titleCase(helpers.getConceptName(summary.cancer_type));
          summary.diagnosis_method = helpers.getConceptName(
            summary.diagnosis_method
          );
          summary.cancer_stage = helpers.getConceptName(summary.cancer_stage);
          summary.overall_cancer_stage_group = helpers.getConceptName(
            summary.overall_cancer_stage_group
          );
          summary.oncology_treatment_plan = helpers.getConceptName(
            summary.oncology_treatment_plan
          );
          summary.chemotherapy_plan = helpers.getConceptName(
            summary.chemotherapy_plan
          );
          summary.cancer_type = helpers.titleCase(
            helpers.getConceptName(summary.cancer_type)
          );
          summary.cancer_subtype = helpers.titleCase(
            helpers.getConceptName(summary.cancer_subtype)
          );
          summary.cancer_diagnosis_status = helpers.titleCase(
            helpers.getConceptName(summary.cancer_diagnosis_status)
          );
          summary.chemotherapy = helpers.titleCase(
            helpers.getConceptName(summary.chemotherapy)
          );
          summary.total_chemo_cycles_planned =
            summary.total_chemo_cycles_planned;
          summary.current_chemo_cycle = summary.current_chemo_cycle;
          summary.chemotherapy_regimen = summary.chemotherapy_regimen;
          summary.chemotherapy_intent = helpers.getConceptName(
            summary.chemotherapy_intent
          );
          summary.drug_route = helpers.getConceptName(summary.drug_route);
          summary.medication_history = helpers.getConceptName(
            summary.medication_history
          );
          summary.other_meds_added = helpers.getConceptName(
            summary.other_meds_addeds
          );
          summary.breast_exam_findings = helpers.getConceptName(
            summary.breast_exam_findings
          );
          summary.via_test_result = helpers.getConceptName(
            summary.via_test_result
          );
          summary.encounter_datetime = helpers.filterDate(
            summary.encounter_datetime
          );
          summary.visit_start_datetime = helpers.filterDate(
            summary.visit_start_datetime
          );
          summary.enrollment_date = helpers.filterDate(summary.enrollment_date);
          summary.rtc_date = helpers.filterDate(summary.rtc_date);
          summary.prev_rtc_date = helpers.filterDate(summary.prev_rtc_date);
          summary.diagnosis_date = helpers.filterDate(summary.diagnosis_date);
          summary.cur_onc_meds_start_date = helpers.filterDate(
            summary.cur_onc_meds_start_date
          );
        });
        callback(oncSummary);
      })
      .catch((error) => {
        console.error('Error fetching oncSummary: ', error);
        callback(error);
      });
  }

  function getOncologyPatientReport(request, query) {
    let patientUuid = request.params.uuid;
    let programUuid = request.query.programUuid;
    let whereClause = [
      'uuid = ? AND programuuid = ? ',
      patientUuid,
      programUuid
    ];

    _.merge(query, {
      table: 'etl.flat_onc_patient_history',
      where: whereClause,
      leftOuterJoins: [
        [
          '(SELECT program_id, uuid as `programuuid` FROM amrs.program ) `t5` ON (t1.program_id = t5.program_id)'
        ],
        [
          '(SELECT uuid as `location_uuid`, location_id FROM amrs.location) `loc` ON (loc.location_id = t1.location_id)'
        ]
      ],
      offset: request.query.startIndex,
      limit: request.query.limit
    });
    return db.queryDb(query);
  }

  function getPatientVitals(request, callback) {
    var uuid = request.params.uuid;
    var order = helpers.getSortOrder(request.query.order);
    // request.query.page;
    // request.query.pageSize;

    var queryParts = {
      columns: request.query.fields || '*',
      table: 'etl.flat_vitals',
      where: ['uuid = ?', uuid],
      order: order || [
        {
          column: 'encounter_datetime',
          asc: false
        }
      ],
      offset: request.query.startIndex,
      limit: request.query.limit
    };

    // Use promisified function instead
    var promise = db.queryDb(queryParts);

    if (_.isFunction(callback)) {
      promise
        .then(function (result) {
          callback(result);
        })
        .catch(function (err) {
          callback(err);
        });
    }

    // return the promise
    return promise;
  }

  function getHivPatientClinicalSummary(request, callback) {
    var patientUuid = request.params.uuid;
    var patientEncounters = encounterService.getPatientEncounters(patientUuid);
    var patientHivSummary = getPatientHivSummary(request);
    var patientVitals = getPatientVitals(request);
    var patientLabData = new Promise(function (resolve) {
      var extendedRequest = request;
      extendedRequest.query.limit = 300;
      getPatientLabData(extendedRequest, function (result) {
        resolve(result);
      });
    });
    var patientReminders = new Promise(function (resolve, reject) {
      var extendedRequest = request;
      extendedRequest.query.limit = 1;
      extendedRequest.params[
        'referenceDate'
      ] = new Date().toISOString().substring(0, 10);
      extendedRequest.params.patientUuid = patientUuid;

      getPatientReminders(
        extendedRequest,
        function (result) {
          resolve(result);
        },
        function (error) {
          reject(error);
        }
      );
    });

    Promise.all([
      patientEncounters,
      patientHivSummary,
      patientVitals,
      patientLabData,
      patientReminders
    ])
      .then(function (data) {
        var encounters = data[0];
        var hivSummaries = data[1].result;
        var vitals = data[2].result;
        var labDataSummary = data[3].result;
        var reminders = data[4].result;
        var notes = noteService.generateNotes(encounters, hivSummaries, vitals);
        callback({
          patientUuid: patientUuid,
          notes: notes,
          vitals: vitals,
          hivSummaries: hivSummaries,
          reminders: reminders.reminders || [],
          labDataSummary: labDataSummary
        });
      })
      .catch(function (e) {
        // Return  error
        console.error('An error occured', e);
        callback(Boom.badData(JSON.stringify(e)));
      });
  }

  function getPatientReminders(request, onSuccess, onError) {
    var combineRequestParams = Object.assign({}, request.query, request.params);
    combineRequestParams.limitParam = 1;
    var reportParams = helpers.getReportParams(
      'clinical-reminder-report',
      ['referenceDate', 'patientUuid', 'offSetParam', 'limitParam'],
      combineRequestParams
    );

    var report = new BaseMysqlReport(
      'clinicalReminderReport',
      reportParams.requestParams
    );
    report
      .generateReport()
      .then(function (results) {
        try {
          if (results.results.results.length > 0) {
            var processedResults = patientReminderService.generateReminders(
              results.results.results,
              []
            );
            results.result = processedResults;
          } else {
            results.result = {
              person_uuid: combineRequestParams.person_uuid,
              reminders: []
            };
          }
          onSuccess(results);
        } catch (error) {
          console.error('Error generating reminders', error);
          onError(new Error('Error generating reminders'));
        }
      })
      .catch(function (error) {
        console.error('Error generating reminders', error);
        onError(new Error('Error generating reminders'));
      });
  }

  function getClinicalNotes(request, callback) {
    var patientEncounters = encounterService.getPatientEncounters(
      request.params.uuid
    );
    var patientHivSummary = getPatientHivSummary(request);
    var patientVitals = getPatientVitals(request);

    Promise.all([patientEncounters, patientHivSummary, patientVitals])
      .then(function (data) {
        var encounters = data[0];
        var hivSummaries = data[1].result;
        var vitals = data[2].result;
        var notes = noteService.generateNotes(encounters, hivSummaries, vitals);
        callback({
          notes: notes,
          status: 'notes generated'
        });
      })
      .catch(function (e) {
        // Return empty json on error
        callback({
          notes: [],
          status: 'error generating notes',
          error: e
        });
      });
  }

  function getPatientLabData(request, callback) {
    var uuid = request.params.uuid;
    var order = helpers.getSortOrder(request.query.order);

    var queryParts = {
      columns: request.query.fields || 't1.*, t2.cur_arv_meds',
      table: 'etl.flat_labs_and_imaging',
      leftOuterJoins: [
        [
          '(select * from etl.flat_hiv_summary_v15b where is_clinical_encounter and uuid="' +
            uuid +
            '" group by date(encounter_datetime))',
          't2',
          'date(t1.test_datetime) = date(t2.encounter_datetime)'
        ]
      ],
      where: ['t1.uuid = ?', uuid],
      order: order || [
        {
          column: 'test_datetime',
          asc: false
        }
      ],
      offset: request.query.startIndex,
      limit: request.query.limit
    };

    db.queryServer_test(queryParts, function (result) {
      _.each(result.result, function (row) {
        row.tests_ordered = helpers.getTestsOrderedNames(row.tests_ordered);
        row.hiv_rapid_test = helpers.getConceptName(row.hiv_rapid_test);
        row.cur_arv_meds = helpers.getARVNames(row.cur_arv_meds);
        row.lab_errors = helpers.resolvedLabOrderErrors(
          row.vl_error,
          row.cd4_error,
          row.hiv_dna_pcr_error
        );
        row.hiv_dna_pcr = helpers.getConceptName(row.hiv_dna_pcr);
        row.antibody_screen = helpers.getConceptName(row.antibody_screen);
        row.pus_c_urine = helpers.getConceptName(row.pus_c_urine);
        row.protein_urine = helpers.getConceptName(row.protein_urine);
        row.leuc = helpers.getConceptName(row.leuc);
        row.ketone = helpers.getConceptName(row.ketone);
        row.sugar_urine = helpers.getConceptName(row.sugar_urine);
        row.nitrites = helpers.getConceptName(row.nitrites);
        row.chest_xray = helpers.getConceptName(row.chest_xray);
        row.ecg = helpers.getConceptName(row.ecg);
        row.test_datetime = row.test_datetime.toString();
      });
      var arr = result.result;

      var resultsByDay = getUniqueResultsByDay(arr);
      var cleanResult = getUnique(resultsByDay, 'test_datetime');
      result.result = cleanResult;
      callback(result);
    });
  }

  function getUnique(arr, comp) {
    const unique = arr
      .map((e) => e[comp])
      .map((e, i, final) => final.indexOf(e) === i && i)
      .filter((e) => arr[e])
      .map((e) => arr[e]);

    return unique;
  }

  function getUniqueResultsByDay(results) {
    let resultTracker = {};
    const sortedArray = results
      .map((result, index) => {
        const test_date = result.test_datetime;
        const curResult = result;
        if (resultTracker.hasOwnProperty(test_date)) {
          const prevResult = resultTracker[test_date];
          const mergedResult = mergeResults(curResult, prevResult);
          resultTracker[test_date] = mergedResult;
          return mergedResult;
        } else {
          resultTracker[test_date] = result;
          return result;
        }
      })
      .filter((result) => {
        const test_date = result.test_datetime;
        return _.isEqual(result, resultTracker[test_date]);
      });
    return sortedArray;
  }

  function mergeResults(curResult, prevResult) {
    let mergedResult = {};
    Object.keys(curResult).forEach((key) => {
      if (
        (curResult[key] === null || curResult[key] === '') &&
        (prevResult[key] !== null || prevResult[key] !== '')
      ) {
        mergedResult[key] = prevResult[key];
      } else {
        mergedResult[key] = curResult[key];
      }
    });

    return mergedResult;
  }

  function getPatient(request, callback) {
    var uuid = request.params.uuid;
    var order = helpers.getSortOrder(request.query.order);

    var queryParts = {
      columns: request.query.fields || '*',
      table: 'etl.flat_hiv_summary_v15b',
      where: ['uuid = ?', uuid],
      order: order || [
        {
          column: 'encounter_datetime',
          asc: false
        }
      ],
      offset: request.query.startIndex,
      limit: request.query.limit
    };

    db.queryServer_test(queryParts, function (result) {
      callback(result);
    });
  }

  function getPatientCountGroupedByLocation(request, callback) {
    var periodFrom =
      request.query.startDate || new Date().toISOString().substring(0, 10);
    var periodTo =
      request.query.endDate || new Date().toISOString().substring(0, 10);
    var order = helpers.getSortOrder(request.query.order);

    var queryParts = {
      columns: 't3.location_id,t3.name,count( distinct t1.patient_id) as total',
      table: 'amrs.patient',
      where: [
        "date_format(t1.date_created,'%Y-%m-%d') between date_format(?,'%Y-%m-%d') AND date_format(?,'%Y-%m-%d')",
        periodFrom,
        periodTo
      ],
      group: ['t3.uuid,t3.name'],
      order: order || [
        {
          column: 't2.location_id',
          asc: false
        }
      ],
      joins: [
        ['amrs.encounter', 't2', 't1.patient_id = t2.patient_id'],
        ['amrs.location', 't3', 't2.location_id=t3.location_id'],
        [
          'amrs.person_name',
          't4',
          't4.person_id=t1.patient_id and (t4.voided is null || t4.voided = 0)'
        ]
      ],
      offset: request.query.startIndex,
      limit: request.query.limit
    };

    db.queryServer_test(queryParts, function (result) {
      callback(result);
    });
  }

  function getPatientDetailsGroupedByLocation(request, callback) {
    var location = request.params.location;
    var periodFrom =
      request.query.startDate || new Date().toISOString().substring(0, 10);
    var periodTo =
      request.query.endDate || new Date().toISOString().substring(0, 10);
    var order = helpers.getSortOrder(request.query.order);
    var queryParts = {
      columns:
        'distinct t4.uuid as patientUuid, t1.patient_id, t3.given_name, t3.middle_name, t3.family_name, t4.gender, extract(year from (from_days(datediff(now(),t4.birthdate)))) as age',
      table: 'amrs.patient',
      where: [
        "t2.location_id = ? AND date_format(t1.date_created,'%Y-%m-%d') between date_format(?,'%Y-%m-%d') AND date_format(?,'%Y-%m-%d')",
        location,
        periodFrom,
        periodTo
      ],
      order: order || [
        {
          column: 't2.location_id',
          asc: false
        }
      ],
      joins: [
        ['amrs.encounter', 't2', 't1.patient_id = t2.patient_id'],
        q[
          ('amrs.person_name',
          't3',
          't3.person_id=t1.patient_id and (t3.voided is null || t3.voided = 0)')
        ],
        ['amrs.person', 't4', 't4.person_id=t1.patient_id']
      ],
      offset: request.query.startIndex,
      limit: request.query.limit
    };

    db.queryServer_test(queryParts, function (result) {
      callback(result);
    });
  }

  return {
    getPatientHivSummary: getPatientHivSummary,
    getPatientOncologySummary: getPatientOncologySummary,
    getPatientVitals: getPatientVitals,
    getClinicalNotes: getClinicalNotes,
    getPatientData: getPatientLabData,
    getPatient: getPatient,
    getHivPatientClinicalSummary: getHivPatientClinicalSummary,
    getPatientCountGroupedByLocation: getPatientCountGroupedByLocation,
    getPatientDetailsGroupedByLocation: getPatientDetailsGroupedByLocation
  };
})();
