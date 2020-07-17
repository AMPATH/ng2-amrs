/*jshint -W003, -W097, -W117, -W026 */
'use strict';

var db = require('../../etl-db');
var _ = require('underscore');
var reportFactory = require('../../etl-factory');
var Boom = require('boom'); //extends Hapi Error Reporting. Returns HTTP-friendly error objects: github.com/hapijs/boom
var helpers = require('../../etl-helpers');
var Promise = require('bluebird');
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
                where: ['uuid in ?', uuids],
                offset: 0,
                limit: 300
            };

            db.queryServer_test(queryParts, function (result) {
                //stringify
                result = JSON.stringify(result);
                result = JSON.parse(result);
                callback(result.result);
            });
        },
        runReport: function runReport(reportParams) {
            console.log('Report Params', reportParams);
            //build report
            var queryParts = reportFactory.singleReportToSql(reportParams);
            console.log('Query Parts', queryParts);
            return new Promise(function (resolve, reject) {
                db.reportQueryServer(queryParts, function (results) {
                    if (results.error) {
                        results.queryParts = queryParts;
                        reject(results);
                    } else {
                        reportFactory.buildIndicatorsSchema(reportParams, function (indicators) {
                            results.indicatorDefinitions = indicators;
                            var resolved = reportFactory.resolveIndicators(reportParams.reportName, results, reportParams.requestIndicators);
                            resolve(resolved);
                        });
                    }
                });
            });
        },
        getDataEntryIndicators: function getDataEntryIndicators(subType, request, callback) {
            var reportName = subType;
            var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);
            var endDate = request.query.endDate || new Date().toISOString().substring(0, 10);
            var providerUuid;
            // var creatorUuid;
            // if (request.query.creatorUuid) creatorUuid = request.query.creatorUuid;
            if (request.query.providerUuid) providerUuid = request.query.providerUuid;

            var queryParams = {
                reportName: reportName,
                countBy: 'encounter', //this gives the ability to count by either person_id or encounter_id,
                locations: request.query.locationIds,
                encounterTypeIds: request.query.encounterTypeIds,
                visitTypeIds: request.query.visitTypeIds,
                formIds: request.query.formIds,
                creatoruuid: request.query.creatorUuid
            };

            var where = {};

            helpers.buildWhereParamsDataEntryIndicators(queryParams, where);

            var requestIndicators = request.query.indicators;

            //build query params
            if (!_.isUndefined(startDate)) startDate = startDate.split('T')[0];
            if (!_.isUndefined(endDate)) endDate = endDate.split('T')[0];
            console.log('Where', where);
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
                        "value": where.creator
                    },
                    {
                        "name": "encounterTypeIds",
                        "value": where.encounterTypes
                    },
                    {
                        "name": "visitTypeIds",
                        "value": where.visitTypes
                    }
                ],
                groupBy: request.query.groupBy || 'groupByEncounterTypeId',
                offset: request.query.startIndex,
                limit: request.query.limit || 1000000
            };
            //build report
            var queryParts = reportFactory.singleReportToSql(requestParams);
            // console.log('Query Parts', queryParts);
            db.reportQueryServer(queryParts, function (results) {
                var res = reportFactory.resolveIndicators(reportName, results);
                _.each(res.result, (item) => {
                    item.cur_meds = helpers.getARVNames(item.cur_meds);
                });
                callback(res);

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
                groupBy: 'groupByEncounter',
                offset: request.query.startIndex || 0,
                limit: request.query.limit || 1000000
            };

            //build report

            var queryParts = reportFactory.singleReportToSql(requestParams);
            db.reportQueryServer(queryParts, function (results) {
                var finalResults = reportFactory.resolveIndicators(reportName, results);
                if (request.query.excludePatientList &&
                    (request.query.excludePatientList === 'true' ||
                        request.query.excludePatientList === true)) {

                    var removePatientList = function (results) {
                        if (results.result) {
                            results.result = [];
                        }

                        if (results.results) {
                            results.results = [];
                        }

                        _.each(results.resultsByLocation, function (item) {
                            removePatientList(item);
                        })
                    };

                    removePatientList(finalResults);

                }
                callback(finalResults);

            });

        },
        getClinicLabOrdersData: function getClinicLabOrdersData(request, callback) {
            var reportName = 'clinic-lab-orders-report';
            var dateActivated = request.query.dateActivated || new Date().toISOString().substring(0, 10);
            if (!_.isUndefined(dateActivated)) dateActivated = dateActivated.split('T')[0];
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
                        "name": "dateActivated",
                        "value": dateActivated
                    },
                    {
                        "name": "locations",
                        "value": locations
                    }
                ],
                groupBy: 'groupByPerson',
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
                console.log('Uuid', uuid);
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
                table: "etl.flat_hiv_summary_v15b",
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
        getPatientListReport: function getPatientListReport(requestParams) {
            var requestIndicators = requestParams.indicator;
            var startDate = requestParams.startDate || new Date().toISOString().substring(0, 10);
            var endDate = requestParams.endDate || new Date().toISOString().substring(0, 10);
            var order = helpers.getSortOrder(requestParams.order);
            var reportName = requestParams.reportName || 'hiv-summary-report';
            var locationIds = requestParams.locations || '';
            var locationUuids = [];
            var stateUuids = [];
            var locations = [];
            var programUuids= [];
            var startAge = requestParams.startAge || 0;
            var endAge = requestParams.endAge || 150;
            var gender = (requestParams.gender || 'M,F').split(',');

            _.each(locationIds.split(','), function (loc) {
                locations.push(Number(loc));
            });

            // format locationUuids
            if (requestParams.locationUuids) {
                _.each(requestParams.locationUuids.split(','), function (loc) {
                    locationUuids.push(String(loc));
                });
            }
            //format StateUuids
            if (requestParams.stateUuids) {
                _.each(requestParams.stateUuids.split(','), function (s) {
                    stateUuids.push(String(s));
                });
            }
            if (requestParams.programUuids) {
                _.each(requestParams.programUuids.split(','), function (s) {
                    programUuids.push(String(s));
                });
            }

            if (!_.isUndefined(startDate)) startDate = startDate.split('T')[0];
            if (!_.isUndefined(endDate)) endDate = endDate.split('T')[0];

            var queryParams = {
                requestIndicators: requestIndicators,
                reportName: reportName,
                order: order,
                groupBy: 'groupByPerson',
                whereParams: [{
                    "name": "startDate",
                    "value": startDate
                }, {
                    "name": "endDate",
                    "value": endDate
                }, {
                    "name": "locationUuids",
                    "value": locationUuids
                }, {
                    "name": "locations",
                    "value": locations
                }, {
                    "name": "startAge",
                    "value": startAge
                }, {
                    "name": "endAge",
                    "value": endAge
                }, {
                    "name": "gender",
                    "value": gender
                },
                {
                    "name": "programUuids",
                    "value": programUuids
                },
                {
                    "name": "stateUuids",
                    "value": stateUuids
                }

                ],
                startIndex: requestParams.startIndex || 0,
                limit: requestParams.limit || 300
            };

            var queryParts = reportFactory.buildPatientListReportExpression(queryParams);
            return new Promise(function (resolve, reject) {
                if (!_.isEmpty(queryParts)) {
                    db.reportQueryServer(queryParts, function (results) {
                        if (results.error) {
                            results.queryParts = queryParts;
                            reject(results);
                        } else {
                            resolve(reportFactory.resolveIndicators(reportName, results));
                        }
                    });
                } else {
                    reject(Boom.badRequest('An error occurred while generating patient list, please check parameter and try again'));
                }
            });
        },

    };
}();
