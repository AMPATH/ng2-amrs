/*jshint -W003, -W097, -W117, -W026 */
'use strict';
var Promise = require('bluebird');
var noteService = require('../../service/notes.service');
var encounterService = require('../../service/openmrs-rest/encounter.js')
var db = require('../../etl-db');
var _ = require('underscore');
var reportFactory = require('../../etl-factory');
var Boom = require('boom'); //extends Hapi Error Reporting. Returns HTTP-friendly error objects: github.com/hapijs/boom
var helpers = require('../../etl-helpers');
var http = require('http');
var https = require('https');
var Promise=require('bluebird');
var rp = require('../../request-config');
var config = require('../../conf/config');
var moment=require('moment');
module.exports = function() {
  function getPatientHivSummary(request, callback) {
      var uuid = request.params.uuid;
      var order = helpers.getSortOrder(request.query.order);
      var includeNonClinicalEncounter =  Boolean(request.query.includeNonClinicalEncounter||false);
      var whereClause= includeNonClinicalEncounter===true?["uuid = ?", uuid]:
          ["uuid = ?  and t1.is_clinical_encounter = 1", uuid];
    var queryParts = {
      columns: request.query.fields || "*",
      table: "etl.flat_hiv_summary",
      where:whereClause,
      order: order || [{
        column: 'encounter_datetime',
        asc: false
      }],
      offset: request.query.startIndex,
      limit: request.query.limit
    };

    var qParts = {
      columns: "*",
      table: "amrs.encounter_type",
      where: ["retired = ?", 0],
      offset: request.query.startIndex,
      limit: 1000
    };

    var encounterTypeNames = {};
    //get encounter type Name
    var encounterNamesPromise = db.queryDb(qParts);
    var summaryDataPromise = db.queryDb(queryParts);

    var promise = Promise.all([encounterNamesPromise, summaryDataPromise])
    .then(function(data) {
      var encTypeNames = data[0];
      var summaryData = data[1];

      // Map encounter type ids to names.
      _.each(encTypeNames.result, function(row) {
        encounterTypeNames[row.encounter_type_id] = row.name;
      });

      // Format & Clean up raw summaries
      _.each(summaryData.result, function(summary) {
        summary.cur_arv_meds_id = summary.cur_arv_meds;
        summary.arv_first_regimen_id = summary.arv_first_regimen;
        summary.cur_arv_meds = helpers.getARVNames(summary.cur_arv_meds);
        summary.arv_first_regimen = helpers.getARVNames(summary.arv_first_regimen);
        summary['encounter_type_name'] = encounterTypeNames[summary.encounter_type];
        summary['prev_encounter_type_name'] = encounterTypeNames[summary.prev_encounter_type_hiv];
      });

      // Return when done.
      return summaryData;
    });

    if(_.isFunction(callback)) {
      promise.then(function(result) {
        callback(result);
      }).catch(function(err) {
        callback(err);
      });
    }

    return promise;
  }

  function getPatientVitals(request, callback) {
    var uuid = request.params.uuid;
    var order =  helpers.getSortOrder(request.query.order);
    // request.query.page;
    // request.query.pageSize;

    var queryParts = {
      columns: request.query.fields || "*",
      table: "etl.flat_vitals",
      where: ["uuid = ?", uuid],
      order: order || [{
        column: 'encounter_datetime',
        asc: false
      }],
      offset: request.query.startIndex,
      limit: request.query.limit
    };

    // Use promisified function instead
    var promise = db.queryDb(queryParts);

    if(_.isFunction(callback)) {
      promise.then(function(result) {
        callback(result);
      }).catch(function(err) {
        callback(err);
      });
    }

    // return the promise
    return promise;
  }

  function getClinicalNotes(request, callback) {
    var patientEncounters = encounterService.getPatientEncounters(request.params.uuid);
    var patientHivSummary = getPatientHivSummary(request);
    var patientVitals = getPatientVitals(request);


    Promise.all([patientEncounters, patientHivSummary, patientVitals]).then(function(data) {
        var encounters = data[0];
        var hivSummaries = data[1].result;
        var vitals = data[2].result;
        var notes = noteService.generateNotes(encounters,hivSummaries,vitals);
        callback({notes:notes,status:'notes generated'});
    })
    .catch (function(e) {
        // Return empty json on error
        console.log('Error',e);
        callback({notes:[],status:'error generating notes', error:e});
    });
  }

  function getPatientData(request, callback) {
    var uuid = request.params.uuid;
    var order =  helpers.getSortOrder(request.query.order);

    var queryParts = {
      columns: request.query.fields || "t1.*, t2.cur_arv_meds",
      table: "etl.flat_labs_and_imaging",
      leftOuterJoins: [
        ['(select * from etl.flat_hiv_summary where is_clinical_encounter and uuid="'+uuid+'" group by date(encounter_datetime))',
          't2', 'date(t1.test_datetime) = date(t2.encounter_datetime)']
        ],
      where: ["t1.uuid = ?", uuid],
      order: order || [{
        column: 'test_datetime',
        asc: false
      }],
      offset: request.query.startIndex,
      limit: request.query.limit
    };

    db.queryServer_test(queryParts, function(result) {
      _.each(result.result, function(row) {
        row.tests_ordered = helpers.getTestsOrderedNames(row.tests_ordered);
        row.cur_arv_meds = helpers.getARVNames(row.cur_arv_meds);
        row.lab_errors = helpers.resolvedLabOrderErrors(row.vl_error,row.cd4_error,row.hiv_dna_pcr_error);
        row.hiv_dna_pcr = helpers.getConceptName(row.hiv_dna_pcr);
        row.chest_xray = helpers.getConceptName(row.chest_xray);

      });
      callback(result);
    });
  }

  function getPatient(request, callback) {
    var uuid = request.params.uuid;
    var order =  helpers.getSortOrder(request.query.order);

    var queryParts = {
      columns: request.query.fields || "*",
      table: "etl.flat_hiv_summary",
      where: ["uuid = ?", uuid],
      order: order || [{
        column: 'encounter_datetime',
        asc: false
      }],
      offset: request.query.startIndex,
      limit: request.query.limit
    };

    db.queryServer_test(queryParts, function(result) {
      callback(result);
    });
  }

  function getPatientStgetPatientCountGroupedByLocationatics(request, callback) {
    var periodFrom = request.query.startDate || new Date().toISOString().substring(0, 10);
    var periodTo = request.query.endDate || new Date().toISOString().substring(0, 10);
    var order =  helpers.getSortOrder(request.query.order);

    var queryParts = {
      columns: "t3.location_id,t3.name,count( distinct t1.patient_id) as total",
      table: "amrs.patient",
      where: ["date_format(t1.date_created,'%Y-%m-%d') between date_format(?,'%Y-%m-%d') AND date_format(?,'%Y-%m-%d')", periodFrom, periodTo],
      group: ['t3.uuid,t3.name'],
      order: order || [{
        column: 't2.location_id',
        asc: false
      }],
      joins: [
        ['amrs.encounter', 't2', 't1.patient_id = t2.patient_id'],
        ['amrs.location', 't3', 't2.location_id=t3.location_id'],
        ['amrs.person_name', 't4', 't4.person_id=t1.patient_id']
      ],
      offset: request.query.startIndex,
      limit: request.query.limit
    };

    db.queryServer_test(queryParts, function(result) {
      callback(result);
    });
  }

  function getPatientDetailsGroupedByLocation(request, callback) {
    var location = request.params.location;
    var periodFrom = request.query.startDate || new Date().toISOString().substring(0, 10);
    var periodTo = request.query.endDate || new Date().toISOString().substring(0, 10);
    var order =  helpers.getSortOrder(request.query.order);
    var queryParts = {
      columns: "distinct t4.uuid as patientUuid, t1.patient_id, t3.given_name, t3.middle_name, t3.family_name, t4.gender, extract(year from (from_days(datediff(now(),t4.birthdate)))) as age",
      table: "amrs.patient",
      where: ["t2.location_id = ? AND date_format(t1.date_created,'%Y-%m-%d') between date_format(?,'%Y-%m-%d') AND date_format(?,'%Y-%m-%d')", location, periodFrom, periodTo],
      order: order || [{
        column: 't2.location_id',
        asc: false
      }],
      joins: [
        ['amrs.encounter', 't2', 't1.patient_id = t2.patient_id'],
        ['amrs.person_name', 't3', 't3.person_id=t1.patient_id'],
        ['amrs.person', 't4', 't4.person_id=t1.patient_id']
      ],
      offset: request.query.startIndex,
      limit: request.query.limit
    };

    db.queryServer_test(queryParts, function(result) {
      callback(result);
    });
  }

  function getPatientListByIndicator(request, callback) {
    var reportIndicator = request.query.indicator;
    var location = request.params.location;
    var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);
    var endDate = request.query.endDate || new Date().toISOString().substring(0, 10);
    var order =  helpers.getSortOrder(request.query.order);
    var startAge =request.query.startAge||0;
    var endAge =request.query.endAge||150;
    var gender =(request.query.gender||'M,F').split(',');
    var reportName = request.query.reportName || 'hiv-summary-report';
    //Check for undefined query field
    if (reportIndicator === undefined)
      callback(Boom.badRequest('indicator (Report Indicator) is missing from your request query'));
    //declare query params
    var queryParams = {
      reportIndicator: reportIndicator,
      reportName: reportName
    };
    //build report
    reportFactory.buildPatientListExpression(queryParams, function(exprResult) {
      var queryParts = {
        columns: "t1.person_id,t1.encounter_id,t1.location_id,t1.location_uuid, t1.uuid as patient_uuid, extract(year from (from_days(datediff(now(),t4.birthdate)))) as age, t4.gender",
        concatColumns: "concat(COALESCE(t2.given_name,''),' ',COALESCE(t2.middle_name,''),' ',COALESCE(t2.family_name,'')) as person_name; " +
          "group_concat(distinct t3.identifier separator ', ') as identifiers",
        table: exprResult.resource,
        where: ["t1.encounter_datetime >= ? and t1.encounter_datetime <= ? " +
         "and t1.location_uuid = ? and t1.is_clinical_encounter = 1 and " +
         "(t1.next_clinical_datetime_hiv is null or t1.next_clinical_datetime_hiv  >= ? )" +
         " and coalesce(t1.death_date, out_of_care) is null and round(datediff(t1.encounter_datetime,t4.birthdate)/365) >= ?" +
        " and round(datediff(t1.encounter_datetime,t4.birthdate)/365) <= ? and t4.gender in ?" +
          exprResult.whereClause, startDate, endDate, location, endDate, startAge, endAge, gender
        ],
        joins: [
          ['amrs.person_name', 't2', 't1.person_id = t2.person_id'],
          ['amrs.person', 't4', 't1.person_id = t4.person_id']
        ],
        leftOuterJoins: [
          ['amrs.patient_identifier', 't3', 't1.person_id = t3.patient_id']
        ],
        order: order || [{
          column: 'encounter_datetime',
          asc: false
        }],
        offset: request.query.startIndex,
        limit: request.query.limit,
        group: ['t1.person_id']
      };
      db.queryServer_test(queryParts, function(result) {
        callback(result);
      });
    });
  }

  function getPatientByIndicatorAndLocation(request, callback) {
    var reportIndicator = request.query.indicator;
    var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);
    var endDate = request.query.endDate || new Date().toISOString().substring(0, 10);
    var order =  helpers.getSortOrder(request.query.order);
    var reportName = request.query.reportName || 'hiv-summary-monthly-report';
    var locationIds = request.query.locations;
    var startAge =request.query.startAge||0;
    var endAge =request.query.endAge||150;
    var gender =(request.query.gender||'M,F').split(',');
    var locations = [];
    _.each(locationIds.split(','), function(loc) {
      locations.push(Number(loc));
    });
    //Check for undefined query field
    if (reportIndicator === undefined)
      callback(Boom.badRequest('indicator (Report Indicator) is missing from your request query'));
    //declare query params
    var queryParams = {
      reportIndicator: reportIndicator,
      reportName: reportName
    };
    //build report
    reportFactory.buildPatientListExpression(queryParams, function(exprResult) {
      var queryParts = {
        columns: "t1.person_id,t1.encounter_id,t1.location_id,t1.location_uuid, t1.uuid as patient_uuid, extract(year from (from_days(datediff(now(),t4.birthdate)))) as age, t4.gender",
        concatColumns: "concat(COALESCE(t2.given_name,''),' ',COALESCE(t2.middle_name,''),' ',COALESCE(t2.family_name,'')) as person_name; " +
          "group_concat(distinct t3.identifier separator ', ') as identifiers",
        table: 'etl.flat_hiv_summary',
        where: ["t1.encounter_datetime >= ? and t1.encounter_datetime <= ? " +
         "and t1.location_id in ? and t1.is_clinical_encounter = 1 and " +
         "(t1.next_clinical_datetime_hiv is null or t1.next_clinical_datetime_hiv  >= ?)" +
         " and coalesce(t1.death_date, out_of_care) is null and round(datediff(t1.encounter_datetime,t4.birthdate)/365) >= ?" +
        " and round(datediff(t1.encounter_datetime,t4.birthdate)/365) <= ? and t4.gender in ?" +
          exprResult.whereClause, startDate, endDate, locations, endDate, startAge, endAge, gender
        ],
        joins: [
          ['amrs.person_name', 't2', 't1.person_id = t2.person_id'],
          ['amrs.person', 't4', 't1.person_id = t4.person_id']
        ],
        leftOuterJoins: [
          ['amrs.patient_identifier', 't3', 't1.person_id = t3.patient_id']
        ],
        order: order || [{
          column: 'encounter_datetime',
          asc: false
        }],
        offset: request.query.startIndex,
        limit: request.query.limit,
        group: ['t1.person_id']
      };
      db.queryServer_test(queryParts, function(result) {
        callback(result);
      });
    });
  }
  return {
    getPatientHivSummary: getPatientHivSummary,
    getPatientVitals: getPatientVitals,
    getClinicalNotes: getClinicalNotes,
    getPatientData: getPatientData,
    getPatient: getPatient,
    getPatientCountGroupedByLocation: getPatientStgetPatientCountGroupedByLocationatics,
    getPatientDetailsGroupedByLocation: getPatientDetailsGroupedByLocation,
    getPatientListByIndicator: getPatientListByIndicator,
    getPatientByIndicatorAndLocation: getPatientByIndicatorAndLocation
    }
}();
