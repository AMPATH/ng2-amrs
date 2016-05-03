/*jshint -W003, -W097, -W117, -W026 */
'use strict';

var db = require('../../etl-db');
var _ = require('underscore');
var reportFactory = require('../../etl-factory');
var Boom = require('boom'); //extends Hapi Error Reporting. Returns HTTP-friendly error objects: github.com/hapijs/boom
var helpers = require('../../etl-helpers');
module.exports = function() {
  return {
    getPatientHivSummary: function getPatientHivSummary(request, callback) {
      var uuid = request.params.uuid;
      var order = helpers.getSortOrder(request.query.order);

      var queryParts = {
        columns: request.query.fields || "*",
        table: "etl.flat_hiv_summary",
        where: ["uuid = ? and t1.is_clinical_encounter = 1", uuid],
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
      db.queryServer_test(qParts, function(result) {
        console.log('returned rows : ', result.result.length);
        _.each(result.result, function(row) {
          encounterTypeNames[row.encounter_type_id] = row.name;
        });
      });

      db.queryServer_test(queryParts, function(result) {
        _.each(result.result, function(row) {
          row.cur_arv_meds = helpers.getARVNames(row.cur_arv_meds);
          row.arv_first_regimen = helpers.getARVNames(row.arv_first_regimen);
          row['encounter_type_name'] = encounterTypeNames[row.encounter_type];
          row['prev_encounter_type_name'] = encounterTypeNames[row.prev_encounter_type_hiv];
        });
        callback(result);
      });
    },
    getPatientVitals: function getPatientVitals(request, callback) {
      var uuid = request.params.uuid;
      var order =  helpers.getSortOrder(request.query.order);
      console.log('test  ', request.query);
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

      db.queryServer_test(queryParts, function(result) {
        callback(result);
      });

    },
    getPatientData: function getPatientData(request, callback) {
      var uuid = request.params.uuid;
      var order =  helpers.getSortOrder(request.query.order);

      var queryParts = {
        columns: request.query.fields || "*",
        table: "etl.flat_labs_and_imaging",
        where: ["uuid = ?", uuid],
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

        });
        callback(result);
      });
    },
    getPatient: function getPatient(request, callback) {
      console.log('Gettting Here', request.query);
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
    },
    getPatientCountGroupedByLocation: function getPatientStgetPatientCountGroupedByLocationatics(request, callback) {
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
    },
    getPatientDetailsGroupedByLocation: function getPatientDetailsGroupedByLocation(request, callback) {
      var location = request.params.location;
      var periodFrom = request.query.startDate || new Date().toISOString().substring(0, 10);
      var periodTo = request.query.endDate || new Date().toISOString().substring(0, 10);
      var order =  helpers.getSortOrder(request.query.order);
      var queryParts = {
        columns: "distinct t4.uuid as patientUuid, t1.patient_id, t3.given_name, t3.middle_name, t3.family_name",
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
    },
    getPatientListByIndicator: function getPatientListByIndicator(request, callback) {
      console.log('Getting Here', request.query);
      var reportIndicator = request.query.indicator;
      var location = request.params.location;
      var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);
      var endDate = request.query.endDate || new Date().toISOString().substring(0, 10);
      var order =  helpers.getSortOrder(request.query.order);
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
          columns: "t1.person_id,t1.encounter_id,t1.location_id,t1.location_uuid, t1.uuid as patient_uuid",
          concatColumns: "concat(t2.given_name,' ',t2.middle_name,' ',t2.family_name) as person_name; " +
            "group_concat(distinct t3.identifier separator ', ') as identifiers",
          table: exprResult.resource,
          where: ["t1.encounter_datetime >= ? and t1.encounter_datetime <= ? " +
           "and t1.location_uuid = ? and t1.is_clinical_encounter = 1 and " +
           "(t1.next_clinical_datetime_hiv is null or t1.next_clinical_datetime_hiv  >= ? )" +
            exprResult.whereClause, startDate, endDate, location, endDate
          ],
          joins: [
            ['amrs.person_name', 't2', 't1.person_id = t2.person_id']
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
    },
    getPatientByIndicatorAndLocation: function getPatientByIndicator(request, callback) {
      console.log('Getting Here', request.query);
      var reportIndicator = request.query.indicator;
      var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);
      var endDate = request.query.endDate || new Date().toISOString().substring(0, 10);
      var order =  helpers.getSortOrder(request.query.order);
      var reportName = request.query.reportName || 'hiv-summary-report';
      var locationIds = request.query.locations;
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
          columns: "t1.person_id,t1.encounter_id,t1.location_id,t1.location_uuid, t1.uuid as patient_uuid",
          concatColumns: "concat(t2.given_name,' ',t2.middle_name,' ',t2.family_name) as person_name; " +
            "group_concat(distinct t3.identifier separator ', ') as identifiers",
          table: exprResult.resource,
          where: ["t1.encounter_datetime >= ? and t1.encounter_datetime <= ? " +
           "and t1.location_id in ? and t1.is_clinical_encounter = 1 and " +
           "(t1.next_clinical_datetime_hiv is null or t1.next_clinical_datetime_hiv  >= ?)" +
            exprResult.whereClause, startDate, endDate, locations, endDate
          ],
          joins: [
            ['amrs.person_name', 't2', 't1.person_id = t2.person_id']
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
  };
}();
