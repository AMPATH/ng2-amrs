/*jshint -W003, -W097, -W117, -W026 */
'use strict';

var db = require('../../etl-db');
var _ = require('underscore');
var reportFactory = require('../../etl-factory');
var Boom = require('boom'); //extends Hapi Error Reporting. Returns HTTP-friendly error objects: github.com/hapijs/boom
var helpers = require('../../etl-helpers');
module.exports = function () {
  return {
    getCustomData: function getCustomData(request, callback) {

      var passed_params = request.params.userParams.split('/');
      var table_ = "amrs." + passed_params[0];
      var column_name = passed_params[1];
      var column_value = passed_params[2];


      var uuid = request.params.uuid;
      var order = helpers.getSortOrder(request.query.order);

      var queryParts = {
        columns: request.query.fields || "*",
        table: table_,
        where: [column_name + " = ?", column_value],
        // order: order || [{column:'encounter_datetime',asc:false}],
        offset: request.query.startIndex,
        limit: request.query.limit
      };

      db.queryServer_test(queryParts, function (result) {
        callback(result);
      });
    },
    resolveLocationUuidsToName: function resolveLocationUuidsToName(uuids, callback) {
      var queryParts = {
        columns: 'name,uuid',
        table: 'amrs.location',
        where:['uuid in ?', uuids],
        offset: 0,
        limit: 300
      };

      db.queryServer_test(queryParts, function (result) {
        //stringify
        result=JSON.stringify(result);
        result= JSON.parse(result);
        callback(result.result);
      });
    },
    getReportIndicators: function getReportIndicators(request, callback) {
      var reportName = request.query.report;
      var countBy = request.query.countBy;
      var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);
      var endDate = request.query.endDate || new Date().toISOString().substring(0, 10);
      var referenceDate = request.query.referenceDate || new Date().toISOString().substring(0, 10);
      var startAge = request.query.startAge || 0;
      var endAge = request.query.endAge || 150;
      var gender = (request.query.gender || 'M,F').split(',');
      var order = helpers.getSortOrder(request.query.order);
      var locations;
      if (request.query.locations) {
        locations = [];
        _.each(request.query.locations.split(','), function (loc) {
          locations.push(Number(loc));
        });
      }

      if (!_.isUndefined(startDate)) startDate = startDate.split('T')[0];
      if (!_.isUndefined(endDate)) endDate = endDate.split('T')[0];

      var requestIndicators = request.query.indicators;

      //build query params
      var requestParams = {
        reportName: reportName,
        whereParams: [{
          "name": "startDate",
          "value": startDate
        }, {
            "name": "endDate",
            "value": endDate
          }, {
            "name": "locations",
            "value": locations
          }, {
            "name": "@referenceDate",
            "value": referenceDate
          }, {
            "name": "patientUuid",
            "value": request.query["patientUuid"]
          },
          {
            "name": "startAge",
            "value": startAge
          }, {
            "name": "endAge",
            "value": endAge
          }, {
            "name": "gender",
            "value": gender
          }
        ],
        // order: order || [{
        //   column: 't1.location_id',
        //   asc: true
        // }],
        countBy: countBy || 'num_persons',
        groupBy: request.query.groupBy || 'groupByLocation',
        offset: request.query.startIndex,
        limit: request.query.limit,
        requestIndicators: requestIndicators
      };
      //build report
      var queryParts = reportFactory.singleReportToSql(requestParams);
      db.reportQueryServer(queryParts, function (results) {
        callback(reportFactory.resolveIndicators(reportName, results,requestIndicators));
      });
    },
    getDataEntryIndicators: function getDataEntryIndicators(subType, request, callback) {
      var reportName = subType;
      var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);
      var endDate = request.query.endDate || new Date().toISOString().substring(0, 10);
      var providerUuid;
      var creatorUuid;
      if (request.query.creatorUuid) creatorUuid = request.query.creatorUuid;
      if (request.query.providerUuid) providerUuid = request.query.providerUuid;

      var queryParams = {
        reportName: reportName,
        countBy: 'encounter', //this gives the ability to count by either person_id or encounter_id,
        locations: request.query.locationIds,
        encounterTypeIds: request.query.encounterTypeIds,
        formIds: request.query.formIds
      };

      var where = {};

      helpers.buildWhereParamsDataEntryIndicators(queryParams, where);

      var requestIndicators = request.query.indicators;

      //build query params
      if (!_.isUndefined(startDate)) startDate = startDate.split('T')[0];
      if (!_.isUndefined(endDate)) endDate = endDate.split('T')[0];
      var requestParams = {
        reportName: reportName,
        whereParams: [
          {
            "name": "startDate",
            "value": startDate
          },
          {
            "name": "endDate",
            "value": endDate
          },
          {
            "name": "locations",
            "value": where.locations
          },
          {
            "name": "providerUuid",
            "value": providerUuid
          },
          {
            "name": "formIds",
            "value": where.formIds
          },
          {
            "name": "creatorUuid",
            "value": creatorUuid
          },
          {
            "name": "encounterTypeIds",
            "value": where.encounterTypes
          }
        ],
        groupBy: request.query.groupBy || 'groupByEncounterTypeId',
        offset: request.query.startIndex,
        limit: request.query.limit
      };
      //build report
      var queryParts = reportFactory.singleReportToSql(requestParams);
      db.reportQueryServer(queryParts, function (results) {
        callback(reportFactory.resolveIndicators(reportName, results));
      });

    },
    getPatientFlowData: function getPatientFlowData(request, callback) {
      var reportName = 'patient-flow-report';
      var dateStarted = request.query.dateStarted || new Date().toISOString().substring(0, 10);
      if (!_.isUndefined(dateStarted)) dateStarted = dateStarted.split('T')[0];
      var locations;
      if (request.query.locations) {
        locations = [];
        _.each(request.query.locations.split(','), function (loc) {
          locations.push(Number(loc));
        });
      }

      var requestParams = {
        reportName: reportName,
        whereParams: [
          {
            "name": "dateStarted",
            "value": dateStarted
          },
          {
            "name": "locations",
            "value": locations
          }
        ],
        groupBy:'groupByEncounter',
        offset: request.query.startIndex || 0,
        limit: request.query.limit || 1000000
      };

      //build report

      var queryParts = reportFactory.singleReportToSql(requestParams);
      db.reportQueryServer(queryParts, function (results) {
        callback(reportFactory.resolveIndicators(reportName, results));
      });

    },
    getIndicatorsSchemaWithSections: function getIndicatorsSchemaWithSections(request, callback) {
      var reportName = request.query.report;
      //Check for undefined query field
      if (reportName === undefined)
        callback(Boom.badRequest('report (Report Name) is missing from your request query'));
      //build query params
      var queryParams = {
        reportName: reportName
      };
      //retrieve jsin
      reportFactory.buildIndicatorsSchemaWithSections(queryParams, function (result) {
        var schema = {};
        schema.result = result;
        callback(schema);
      });
    },
    getIndicatorsSchema: function getIndicatorsSchema(request, callback) {
      var reportName = request.query.report;
      //Check for undefined query field
      if (reportName === undefined)
        callback(Boom.badRequest('report (Report Name) is missing from your request query'));
      //build query params
      var queryParams = {
        reportName: reportName
      };
      //retrieve jsin
      reportFactory.buildIndicatorsSchema(queryParams, function (result) {
        var schema = {};
        schema.result = result;
        callback(schema);
      });
    },
    getIdsByUuidAsyc: function getIdsByUuidAsyc(fullTableName, idColumnName, uuidColumnName, arrayOfUuids, callback) {
      var uuids = [];
      _.each(arrayOfUuids.split(','), function (uuid) {
        uuids.push(uuid);
      });

      var queryParts = {
        columns: idColumnName,
        table: fullTableName,
        where: [uuidColumnName + " in ?", uuids]
      };

      var promise = {
        onResolved: undefined,
        results: undefined
      };

      db.queryServer_test(queryParts, function (result) {
        var formattedResult = '';

        _.each(result.result, function (rowPacket) {
          if (formattedResult === '') {
            formattedResult = formattedResult + rowPacket[idColumnName];
          } else {
            formattedResult = formattedResult + ',' + rowPacket[idColumnName];
          }
        });
        callback(formattedResult);
        promise.results = formattedResult;
        if (typeof promise.onResolved === 'function') {
          promise.onResolved(promise);
        }
      });

      return promise;
    },
    getHivSummaryData: function getHivSummaryData(request, callback) {
      var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);
      var endDate = request.query.endDate || new Date().toISOString().substring(0, 10);
      var locationUuids = request.query.locationUuids || '';
      var locations = [];
      _.each(locationUuids.split(','), function (loc) {
        locations.push(loc);
      });
      var columns = "name as location, t1.*, day(encounter_datetime) as day, t3.gender, " +
        "week(encounter_datetime) as week, month(encounter_datetime) as month, year(encounter_datetime) as year," +
        "DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(t3.birthdate, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < " +
        "DATE_FORMAT(t3.birthdate,'00-%m-%d')) AS age, if(arv_start_date is not null, t1.person_id,null) as on_arvs, " +
        "t2.location_id";

      if (!_.isUndefined(startDate)) startDate = startDate.split('T')[0];
      if (!_.isUndefined(endDate)) endDate = endDate.split('T')[0];

      var whereClause = ["date(encounter_datetime) >= ? and date(encounter_datetime) <= ? " +
        "and t1.location_uuid in ?", startDate, endDate, locations];
      console.log('here is the no of locations selected', request.query.locationUuids);
      if (request.query.locationUuids === undefined)
        whereClause = ["date(encounter_datetime) >= ? and date(encounter_datetime) <= ?", startDate, endDate];
      var queryParts = {
        columns: columns,
        table: "etl.flat_hiv_summary",
        where: whereClause,
        joins: [
          ['amrs.location', 't2', 't1.location_uuid = t2.uuid'],
          ['amrs.person', 't3', 't3.person_id=t1.person_id']
        ],
        offset: request.query.startIndex,
        limit: request.query.limit
      };

      db.queryServer_test(queryParts, function (result) {
        callback(result);
      });

    },
    getPatientListReportByIndicatorAndLocation: function getPatientListReportByIndicatorAndLocation(request, callback) {
      var requestIndicators = request.query.indicator;
      var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);
      var endDate = request.query.endDate || new Date().toISOString().substring(0, 10);
      var order = helpers.getSortOrder(request.query.order);
      var reportName = request.query.reportName || 'hiv-summary-report';
      var locationIds = request.query.locations;
      var locations = [];
      _.each(locationIds.split(','), function (loc) {
        locations.push(Number(loc));
      });
      //Check for undefined query field
      if (requestIndicators === undefined)
        callback(Boom.badRequest('indicator (Report Indicator) is missing from your request query'));
      //declare query params
      //build query params

      if (!_.isUndefined(startDate)) startDate = startDate.split('T')[0];
      if (!_.isUndefined(endDate)) endDate = endDate.split('T')[0];

      var queryParams = {
        requestIndicators: requestIndicators,
        reportName: reportName,
        whereParams: [{
          "name": "startDate",
          "value": startDate
        }, {
            "name": "endDate",
            "value": endDate
          }, {
            "name": "locations",
            "value": locations
          }]
      };
      //build report
      reportFactory.buildPatientListReportExpression(queryParams, function (exprResult) {
        var queryParts = {
          columns: "t1.person_id,t1.encounter_id,t1.location_id,t1.location_uuid, t1.uuid as patient_uuid, t4.gender, t4.birthdate, extract(year from (from_days(datediff(now(),t4.birthdate)))) as age",
          concatColumns: "concat(COALESCE(t2.given_name,''),' ',COALESCE(t2.middle_name,''),' ',COALESCE(t2.family_name,'')) as person_name;" +
          "group_concat(distinct t3.identifier separator ', ') as identifiers",
          table: "etl.flat_hiv_summary",
          where: exprResult.whereClause,
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
        db.queryServer_test(queryParts, function (result) {
          callback(result);
        });
      });
    }
  };
} ();
