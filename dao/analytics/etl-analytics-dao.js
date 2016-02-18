/*jshint -W003, -W097, -W117, -W026 */
'use strict';

var db = require('../../etl-db');
var _ = require('underscore');
var reportFactory = require('../../etl-factory');
var Boom = require('boom'); //extends Hapi Error Reporting. Returns HTTP-friendly error objects: github.com/hapijs/boom
var helpers = require('../../etl-helpers');
module.exports = function() {
  return {
    getCustomData: function getCustomData(request, callback) {

      var passed_params = request.params.userParams.split('/');
      var table_ = "amrs." + passed_params[0];
      var column_name = passed_params[1];
      var column_value = passed_params[2];

      console.log('Gettting Here');
      var uuid = request.params.uuid;
      var order =  helpers.getSortOrder(request.query.order);

      var queryParts = {
        columns: request.query.fields || "*",
        table: table_,
        where: [column_name + " = ?", column_value],
        // order: order || [{column:'encounter_datetime',asc:false}],
        offset: request.query.startIndex,
        limit: request.query.limit
      };

      db.queryServer_test(queryParts, function(result) {
        callback(result);
      });
    },
    getReportIndicators: function getReportIndicators(request, callback) {
      console.log('Getting Here', request.query);
      var reportName = request.query.report;
      var countBy = request.query.countBy;
      var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);
      var endDate = request.query.endDate || new Date().toISOString().substring(0, 10);
      var order = helpers.getSortOrder(request.query.order);
      var locations;
      if (request.query.locations) {
        locations = [];
        _.each(request.query.locations.split(','), function(loc) {
          locations.push(Number(loc));
        });
      }
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
        }],
        order: order || [{
          column: 't1.location_id',
          asc: true
        }],
        countBy: countBy || 'num_persons',
        groupBy: request.query.groupBy || 'groupByLocation',
        offset: request.query.startIndex,
        limit: request.query.limit,
        requestIndicators: requestIndicators
      };
      //build report
      var queryParts =reportFactory.singleReportToSql(requestParams);

      db.reportQueryServer(queryParts, function(results) {
        callback(reportFactory.resolveIndicators(reportName, results));
      });
    },
    getDataEntryIndicators: function getDataEntryIndicators(subType, request, callback) {
      var reportName = 'data-entry-statistic-report';
      var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);
      var endDate = request.query.endDate || new Date().toISOString().substring(0, 10);
      var queryParams = {
        reportName: reportName,
        countBy: 'encounter', //this gives the ability to count by either person_id or encounter_id,
        locations: request.query.locationIds,
        provideruuid: request.query.providerUuid,
        encounterTypeIds: request.query.encounterTypeIds,
        creatoruuid: request.query.creatorUuid,
        formIds: request.query.formIds
      };
      var columns;
      var groupBy;
      var orderBy = [];
      var joins = [
        ['amrs.encounter', 't2', 't1.encounter_id = t2.encounter_id'],
        ['amrs.encounter_type', 't3', 't3.encounter_type_id = t2.encounter_type']
      ];
      var where = ["encounter_datetime >= ? and encounter_datetime <= ?", startDate, endDate];

      helpers.buildWhereClauseForDataEntryIndicators(queryParams, where);

      switch (subType) {
        case 'by-date-by-encounter-type':
          columns = ["date(encounter_datetime) as date, t2.encounter_type as encounter_type_id, " +
            "t3.name as encounter_type, count(*) as encounters_count"
          ];
          groupBy = ['date', 'encounter_type_id'];
          joins.push(['amrs.provider', 't4', 't4.provider_id = t1.provider_id']);
          break;
        case 'by-month-by-encounter-type':
          columns = ["year(encounter_datetime) as year, month(encounter_datetime)  as month_number, " +
            "DATE_FORMAT(encounter_datetime, '%M, %Y') as month, t2.encounter_type as encounter_type_id," +
            " t3.name as encounter_type, count(*) as encounters_count"
          ];
          groupBy = ['month', 'encounter_type_id'];
          joins.push(['amrs.provider', 't4', 't4.provider_id = t1.provider_id']);
          orderBy = [{
            column: 'year',
            asc: true
          }, {
            column: 'month_number',
            asc: true
          }];
          break;
        case 'by-provider-by-encounter-type':
          columns = ["t4.provider_id as provider_id, t4.uuid as provider_uuid, t2.encounter_type as " +
            "encounter_type_id, t3.name as encounter_type, count(*) as encounters_count"
          ];
          groupBy = ['provider_id', 'encounter_type_id'];
          joins.push(['amrs.provider', 't4', 't4.provider_id = t1.provider_id']);
          break;
        case 'by-creator-by-encounter-type':
          columns = ["t5.user_id as creator_id, t5.uuid as user_uuid, t2.encounter_type as encounter_type_id," +
            " t3.name as encounter_type, count(*) as encounters_count"
          ];
          groupBy = ['creator_id', 'encounter_type_id'];
          joins.push(['amrs.users', 't5', 't2.creator = t5.user_id']);
          break;
      }

      var queryParts = {
        columns: columns,
        table: "amrs.encounter_provider",
        where: where,
        joins: joins,
        group: groupBy,
        order: orderBy
      };
      db.queryServer_test(queryParts, function(result) {
        callback(result);
      });

    },
    getIndicatorsSchemaWithSections: function getIndicatorsSchemaWithSections(request, callback) {
      console.log('Getting Here', request.query);
      var reportName = request.query.report;
      //Check for undefined query field
      if (reportName === undefined)
        callback(Boom.badRequest('report (Report Name) is missing from your request query'));
      //build query params
      var queryParams = {
        reportName: reportName
      };
      //retrieve jsin
      reportFactory.buildIndicatorsSchemaWithSections(queryParams, function(result) {
        var schema = {};
        schema.result = result;
        callback(schema);
      });
    },
    getIndicatorsSchema: function getIndicatorsSchema(request, callback) {
      console.log('Getting Here', request.query);
      var reportName = request.query.report;
      //Check for undefined query field
      if (reportName === undefined)
        callback(Boom.badRequest('report (Report Name) is missing from your request query'));
      //build query params
      var queryParams = {
        reportName: reportName
      };
      //retrieve jsin
      reportFactory.buildIndicatorsSchema(queryParams, function(result) {
        var schema = {};
        schema.result = result;
        callback(schema);
      });
    },
    getIdsByUuidAsyc:function getIdsByUuidAsyc(fullTableName, idColumnName, uuidColumnName, arrayOfUuids, callback) {
        var uuids = [];
        _.each(arrayOfUuids.split(','), function(uuid) {
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

        db.queryServer_test(queryParts, function(result) {
            var formattedResult = '';

            _.each(result.result, function(rowPacket) {
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
      var locationUuids = request.query.locationUuids ||'';
      var locations = [];
      _.each(locationUuids.split(','), function(loc) {
        locations.push(loc);
      });
      var columns = "name as location, t1.*, day(encounter_datetime) as day, t3.gender, " +
        "week(encounter_datetime) as week, month(encounter_datetime) as month, year(encounter_datetime) as year," +
        "DATE_FORMAT(NOW(), '%Y') - DATE_FORMAT(t3.birthdate, '%Y') - (DATE_FORMAT(NOW(), '00-%m-%d') < " +
        "DATE_FORMAT(t3.birthdate,'00-%m-%d')) AS age, if(arv_start_date is not null, t1.person_id,null) as on_arvs, " +
          "t2.location_id";

      var whereClause=["encounter_datetime >= ? and encounter_datetime <= ? " +
      "and t1.location_uuid in ?", startDate, endDate, locations];
      console.log('here is the no of locations selected', request.query.locationUuids);
      if (request.query.locationUuids===undefined)
        whereClause= ["encounter_datetime >= ? and encounter_datetime <= ?", startDate, endDate];
      var queryParts = {
        columns: columns,
        table: "etl.flat_hiv_summary",
        where:whereClause,
        joins: [
          ['amrs.location', 't2', 't1.location_uuid = t2.uuid'],
          ['amrs.person', 't3', 't3.person_id=t1.person_id']
        ],
        offset: request.query.startIndex,
        limit: request.query.limit
      };
      db.queryServer_test(queryParts, function(result) {
        callback(result);
      });

    }
  };
}();
