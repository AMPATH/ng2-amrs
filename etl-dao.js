"use strict";

var db = require('./etl-db');
var _ = require('underscore');
var reportFactory = require('./etl-factory');
var Boom = require('boom'); //extends Hapi Error Reporting. Returns HTTP-friendly error objects: github.com/hapijs/boom
console.log('modules');
console.log('+++++Test Dao', db)

//Testing some simple stuff
//Test DAO
module.exports = function () {

    var getSortOrder = function (param) {
        if (!param) return null;
        var parts;
        var order = [];
        _.each(param.split(','), function (order_by) {
            parts = order_by.split('|');
            order.push({ column: parts[0], asc: (parts[1].toLowerCase() === "asc") });
        })
        return order;
    }

    var getFilters = function (filters) {
        var s = "";
        var vals = [], column;
        _.each(filters, function (item) {
            column = item.column;
            for (var f in item.filters) {
                if (item.filters[f] === undefined || item.filters[f] === null || item.filters[f] === "") continue;
                console.log(item.filters[f]);
                s += column;
                if (f === "start") s += " >= ?";
                else if (f === "end") s += " <= ?";
                else s += " like ?"
                vals.push(item.filters[f]);
                s += " AND "
            }
        });
        s = s.substring(0, s.length - 5)
        if (s !== "")
            s = "(" + s + ")";
        console.log(s);
        console.log(vals);
        return { s: s, vals: vals };
    }

    //str : code1 ## code2 ##
    function getARVNames(str) {
        if (str === null || str === undefined) return "";
        var arvs = {
            814: "ABACAVIR",
            817: "ABACAVIR LAMIVUDINE AND ZIDOVUDINE",
            6159: "ATAZANAVIR",
            6160: "ATAZANAVIR AND RITONAVIR",
            796: "DIDANOSINE",
            633: "EFAVIRENZ",
            791: "EMTRICITABINE",
            6679: "EPZICOM",
            6158: "ETRAVIRINE",
            749: "INDINAVIR",
            6156: "ISENTRESS",
            6965: "LAMIVIR S30",
            628: "LAMIVUDINE",
            1400: "LAMIVUDINE AND TENOFOVIR",
            794: "LOPINAVIR AND RITONAVIR",
            635: "NELFINAVIR",
            631: "NEVIRAPINE",
            6467: "NEVIRAPINE LAMIVUDINE AND ZIDOVUDINE",
            1107: "NONE",
            5424: "OTHER ANTIRETROVIRAL DRUG",
            6157: "PREZISTA",
            795: "RITONAVIR",
            625: "STAVUDINE",
            792: "STAVUDINE LAMIVUDINE AND NEVIRAPINE",
            6964: "TDF AND 3TC AND EFV",
            802: "TENOFOVIR",
            6180: "TRUVADA",
            5811: "UNKNOWN ANTIRETROVIRAL DRUG",
            797: "ZIDOVUDINE",
            630: "ZIDOVUDINE AND LAMIVUDINE"
        }
        var arvCodes = str.split(" ## ");
        var arvNames = [];
        _.each(arvCodes, function (code) { arvNames.push(arvs[code]); });
        return arvNames.join(', ');
    }


    return {
        getClinicEncounterData: function getClinicEncounterData(request, callback) {
            var uuid = request.params.uuid;
            var order = getSortOrder(request.query.order);
            var filters = { s: "" };
            if (request.query.filters)
                filters = getFilters(JSON.parse(request.query.filters));
            var where = ["t1.location_uuid = ?", uuid];
            if (filters.s != "") {
                where[0] += " AND " + filters.s;
                where = where.concat(filters.vals);
            }
            console.log(where);

            var queryParts = {
                columns: request.query.fields || "t1.*,t2.gender,round(datediff(t1.encounter_datetime,t2.birthdate)/365) as age,group_concat(identifier) as identifiers",
                table: "etl.flat_hiv_summary",
                joins: [
                    ['amrs.person', 't2', 't1.person_id = t2.person_id'],
                    ['amrs.patient_identifier', 't3', 't1.person_id=t3.patient_id']
                ],
                where: where,
                group: ['person_id', 'encounter_id'],
                order: order || [{ column: 'encounter_datetime', asc: false }],
                offset: request.query.startIndex,
                limit: request.query.limit
            }

            db.queryServer_test(queryParts, function (result) {
                _.each(result.result, function (row) {
                    row.cur_arv_meds = getARVNames(row.cur_arv_meds);
                    row.arv_first_regimen = getARVNames(row.arv_first_regimen);
                })
                callback(result);
            });
        },
        getPatientHivSummary: function getPatientHivSummary(request, callback) {
            var uuid = request.params.uuid;
            var order = getSortOrder(request.query.order);

            var queryParts = {
                columns: request.query.fields || "*",
                table: "etl.flat_hiv_summary",
                where: ["uuid = ?", uuid],
                order: order || [{ column: 'encounter_datetime', asc: false }],
                offset: request.query.startIndex,
                limit: request.query.limit
            }

            db.queryServer_test(queryParts, function (result) {
                _.each(result.result, function (row) {
                    row.cur_arv_meds = getARVNames(row.cur_arv_meds);
                    row.arv_first_regimen = getARVNames(row.arv_first_regimen);
                })
                callback(result);
            });
        },
        getClinicHivSummayIndicators: function getClinicHivSummayIndicators(request, callback) {
            var uuid = request.params.uuid;
            var order = getSortOrder(request.query.order);

            var query = ""

            var queryParts = {
                columns: request.query.fields || "*",
                table: "etl.hiv_summary_indicators",
                where: ["location = ?", uuid],
                order: order || [{ column: 'encounter_datetime', asc: false }],
                offset: request.query.startIndex,
                limit: request.query.limit
            }

            db.queryServer_test(queryParts, function (result) {
                callback(result);
            });;
        },
        getClinicAppointmentSchedule: function getClinicAppointmentSchedule(request, callback) {
            var uuid = request.params.uuid;
            var order = getSortOrder(request.query.order);
            var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);
            var endDate = request.query.endDate || new Date().toISOString().substring(0, 10);

            var queryParts = {
                columns: request.query.fields || "t1.*,t3.given_name,t3.middle_name,t3.family_name,group_concat(identifier) as identifiers",
                table: "etl.flat_hiv_summary",
                joins: [
                    ['etl.derived_encounter', 't2', 't1.encounter_id = t2.encounter_id'],
                    ['amrs.person_name', 't3', 't1.person_id = t3.person_id'],
                    ['amrs.patient_identifier', 't4', 't1.person_id=t4.patient_id']
                ],
                where: ["t1.location_uuid = ? and date(rtc_date) >= ? and date(rtc_date) <= ?", uuid, startDate, endDate],
                group: ['person_id'],
                order: order || [{ column: 'family_name', asc: true }],
                offset: request.query.startIndex,
                limit: request.query.limit
            }

            db.queryServer_test(queryParts, function (result) {
                callback(result);
            });

        },
        getClinicDailyVisits: function getClinicDailyVisits(request, callback) {
            var uuid = request.params.uuid;
            var order = getSortOrder(request.query.order);
            var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);
            var endDate = request.query.endDate || new Date().toISOString().substring(0, 10);

            var queryParts = {
                columns: request.query.fields || "t1.*,t3.given_name,t3.middle_name,t3.family_name,group_concat(identifier) as identifiers",
                table: "etl.flat_hiv_summary",
                joins: [
                    ['etl.derived_encounter', 't2', 't1.encounter_id = t2.encounter_id'],
                    ['amrs.person_name', 't3', 't1.person_id = t3.person_id'],
                    ['amrs.patient_identifier', 't4', 't1.person_id=t4.patient_id']
                ],
                where: ["t1.location_uuid = ? and date(encounter_datetime) >= ? and date(encounter_datetime) <= ?", uuid, startDate, endDate],
                group: ['person_id'],
                order: order || [{ column: 'family_name', asc: true }],
                offset: request.query.startIndex,
                limit: request.query.limit
            }

            db.queryServer_test(queryParts, function (result) {
                callback(result);
            });

        },
        getClinicMonthlyAppointmentSchedule: function getClinicMonthlyAppointmentSchedule(request, callback) {
            var uuid = request.params.uuid;
            var order = getSortOrder(request.query.order);
            var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);

            var queryParts = {
                columns: request.query.fields || ["date(rtc_date) as rtc_date", "date_format(rtc_date,'%W') as day_of_week", "count( distinct t1.person_id) as total"],
                table: "etl.flat_hiv_summary",
                where: ["t1.location_uuid = ? and date_format(rtc_date,'%Y-%m') = date_format(?,'%Y-%m')", uuid, startDate],
                group: ['rtc_date'],
                order: order || [{ column: 'rtc_date', asc: true }],
                offset: request.query.startIndex,
                limit: request.query.limit
            }

            db.queryServer_test(queryParts, function (result) {
                callback(result);
            });
        },
        getClinicMonthlySummary: function getClinicMonthlySummary(request, callback) {
            var uuid = request.params.uuid;
            var order = getSortOrder(request.query.order);
            var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);

            var queryParts = {};
            queryParts.values = [uuid, startDate, uuid, startDate, uuid, startDate, uuid, startDate];
            queryParts.startDate = startDate;

            var sql = "select "
            sql += " CONVERT_TZ((coalesce(scheduled.rtc_date, visited.encounter_datetime)),'+00:00', '+03:00') as rtc_date, "
            sql += "        coalesce(scheduled.day_of_week, visited.day_of_week) as day_of_week,"
            sql += "        ifnull(scheduled.total_scheduled,0) as total,"
            sql += "        ifnull(visited.total_visits,0) as total_visited"
            sql += "        from ("
            sql += "       select date(rtc_date) as rtc_date, date_format(rtc_date,'%W') as day_of_week,"
            sql += "        count( distinct t1.person_id) as total_scheduled,location_id"
            sql += "        from etl.flat_hiv_summary t1"
            sql += "        where t1.location_uuid = ? and date_format(rtc_date,'%Y-%m') = date_format(?,'%Y-%m')"
            sql += "        group by rtc_date) scheduled"
            sql += "        left join("
            sql += "        select date(encounter_datetime) as encounter_datetime, date_format(encounter_datetime,'%W') as day_of_week,"
            sql += "        count( distinct t1.person_id) as total_visits,location_id"
            sql += "        from etl.flat_hiv_summary t1"
            sql += "        where t1.location_uuid = ? and date_format(encounter_datetime,'%Y-%m') = date_format(?,'%Y-%m')"
            sql += "        group by encounter_datetime) visited on scheduled.location_id=visited.location_id and scheduled.rtc_date=visited.encounter_datetime"
            sql += " union"
            sql += "        select "
            sql += "        CONVERT_TZ((coalesce(scheduled.rtc_date, visited.encounter_datetime)),'+00:00', '+03:00') as rtc_date, "
            sql += "        coalesce(scheduled.day_of_week, visited.day_of_week) as day_of_week,"
            sql += "        ifnull(scheduled.total_scheduled,0) as total,"
            sql += "        ifnull(visited.total_visits,0) as total_visited"
            sql += "        from ("
            sql += "        select date(rtc_date) as rtc_date, date_format(rtc_date,'%W') as day_of_week,"
            sql += "        count( distinct t1.person_id) as total_scheduled,location_id"
            sql += "        from etl.flat_hiv_summary t1"
            sql += "        where t1.location_uuid = ? and date_format(rtc_date,'%Y-%m') = date_format(?,'%Y-%m')"
            sql += "        group by rtc_date) scheduled"
            sql += "        right join("
            sql += "        select date(encounter_datetime) as encounter_datetime, date_format(encounter_datetime,'%W') as day_of_week,"
            sql += "        count( distinct t1.person_id) as total_visits,location_id"
            sql += "        from etl.flat_hiv_summary t1"
            sql += "        where t1.location_uuid = ? and date_format(encounter_datetime,'%Y-%m') = date_format(?,'%Y-%m')"
            sql += "        group by encounter_datetime) visited on scheduled.location_id=visited.location_id and scheduled.rtc_date=visited.encounter_datetime"
            queryParts.sql = sql;
            // var queryParts = {
            //     columns : request.query.fields || ["date(rtc_date) as rtc_date","date_format(rtc_date,'%W') as day_of_week","count( distinct t1.person_id) as total"],
            //     table:"etl.flat_hiv_summary",
            //     where:["t1.location_uuid = ? and date_format(rtc_date,'%Y-%m') = date_format(?,'%Y-%m')",uuid,startDate],
            //     group:['rtc_date'],
            //     order: order || [{column:'rtc_date',asc:true}],
            //     offset:request.query.startIndex,
            //     limit:request.query.limit
            // }


            db.queryServer(queryParts, function (result) {
                callback(result);
            });
        },
        getClinicMonthlyVisits: function getClinicMonthlyVisits(request, callback) {
            var uuid = request.params.uuid;
            var order = getSortOrder(request.query.order);
            var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);

            var queryParts = {
                columns: request.query.fields || ["date(encounter_datetime) as visit_date", "date_format(encounter_datetime,'%W') as day_of_week", "count( distinct t1.person_id) as total"],
                table: "etl.flat_hiv_summary",
                where: ["t1.location_uuid = ? and date_format(encounter_datetime,'%Y-%m') = date_format(?,'%Y-%m')", uuid, startDate],
                group: ['encounter_datetime'],
                order: order || [{ column: 'encounter_datetime', asc: true }],
                offset: request.query.startIndex,
                limit: request.query.limit
            }

            db.queryServer_test(queryParts, function (result) {
                callback(result);
            });
        },
        getClinicDefaulterList: function getClinicDefaulterList(request, callback) {
            var uuid = request.params.uuid;
            var order = getSortOrder(request.query.order);

            var defaulterPeriod = request.query.defaulterPeriod || 30;

            var queryParts = {
                columns: request.query.fields || "*",
                table: "etl.flat_defaulters",
                where: ["location_uuid = ? and days_since_rtc >= ?", uuid, defaulterPeriod],
                order: order || [{ column: 'days_since_rtc', asc: true }],
                offset: request.query.startIndex,
                limit: request.query.limit
            }

            db.queryServer_test(queryParts, function (result) {
                callback(result);
            });
        },
        getCustomData: function getCustomData(request, callback) {

            var passed_params = request.params.userParams.split('/');
            var table_ = "amrs." + passed_params[0];
            var column_name = passed_params[1];
            var column_value = passed_params[2];

            console.log('Gettting Here')
            var uuid = request.params.uuid;
            var order = getSortOrder(request.query.order);

            var queryParts = {
                columns: request.query.fields || "*",
                table: table_,
                where: [column_name + " = ?", column_value],
                // order: order || [{column:'encounter_datetime',asc:false}],
                offset: request.query.startIndex,
                limit: request.query.limit
            }

            db.queryServer_test(queryParts, function (result) {
                callback(result);
            });
        },
        getPatientVitals: function getPatientVitals(request, callback) {
            var uuid = request.params.uuid;
            var order = getSortOrder(request.query.order);
            console.log('test  ', request.query)
            request.query.page;
            request.query.pageSize;

            var queryParts = {
                columns: request.query.fields || "*",
                table: "etl.flat_vitals",
                where: ["uuid = ?", uuid],
                order: order || [{ column: 'encounter_datetime', asc: false }],
                offset: request.query.startIndex,
                limit: request.query.limit
            }

            db.queryServer_test(queryParts, function (result) {
                callback(result);
            });

        },
        getPatientData: function getPatientData(request, callback) {
            var uuid = request.params.uuid;
            var order = getSortOrder(request.query.order);

            var queryParts = {
                columns: request.query.fields || "*",
                table: "etl.flat_labs_and_imaging",
                where: ["uuid = ?", uuid],
                order: order || [{ column: 'encounter_datetime', asc: false }],
                offset: request.query.startIndex,
                limit: request.query.limit
            }

            db.queryServer_test(queryParts, function (result) {
                callback(result);
            });
        },
        getPatient: function getPatient(request, callback) {
            console.log('Gettting Here', request.query)
            var uuid = request.params.uuid;
            var order = getSortOrder(request.query.order);

            var queryParts = {
                columns: request.query.fields || "*",
                table: "etl.flat_hiv_summary",
                where: ["uuid = ?", uuid],
                order: order || [{ column: 'encounter_datetime', asc: false }],
                offset: request.query.startIndex,
                limit: request.query.limit
            }

            db.queryServer_test(queryParts, function (result) {
                callback(result);
            });
        },
        getPatientCountGroupedByLocation: function getPatientStgetPatientCountGroupedByLocationatics(request, callback) {
            var periodFrom = request.query.startDate;
            var periodTo = request.query.endDate;
            var order = getSortOrder(request.query.order);

            var queryParts = {
                columns: "t3.location_id,t3.name,count( distinct t1.patient_id) as total",
                table: "amrs.patient",
                where: ["date_format(t1.date_created,'%Y-%m-%d') between date_format(?,'%Y-%m-%d') AND date_format(?,'%Y-%m-%d')", periodFrom, periodTo],
                group: ['t3.uuid,t3.name'],
                order: order || [{ column: 't2.location_id', asc: false }],
                joins: [
                    ['amrs.encounter', 't2', 't1.patient_id = t2.patient_id'],
                    ['amrs.location', 't3', 't2.location_id=t3.location_id']

                ],
                offset: request.query.startIndex,
                limit: request.query.limit
            }

            db.queryServer_test(queryParts, function (result) {
                callback(result);
            });
        },
        getPatientDetailsGroupedByLocation: function getPatientDetailsGroupedByLocation(request, callback) {
            var periodFrom = request.query.startDate;
            var periodTo = request.query.endDate;
            var location = request.params.location;
            var order = getSortOrder(request.query.order);

            var queryParts = {
                columns: "distinct t1.patient_id,t3.given_name,t3.middle_name,t3.family_name",
                table: "amrs.patient",
                where: ["t2.location_id = ? AND date_format(t1.date_created,'%Y-%m-%d') between date_format(?,'%Y-%m-%d') AND date_format(?,'%Y-%m-%d')", location, periodFrom, periodTo],
                order: order || [{ column: 't2.location_id', asc: false }],
                joins: [
                    ['amrs.encounter', 't2', 't1.patient_id = t2.patient_id'],
                    ['amrs.person_name', 't3', 't3.person_id=t1.patient_id']

                ],
                offset: request.query.startIndex,
                limit: request.query.limit
            }

            db.queryServer_test(queryParts, function (result) {
                callback(result);
            });
        },
        getHivSummaryIndicators: function getHivSummaryIndicators(request, callback) {
            console.log('Getting Here', request.query);
            var reportName = request.query.report;
            var countBy = request.query.countBy;
            var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);
            var endDate = request.query.endDate || new Date().toISOString().substring(0, 10);
            //Check for undefined query field
            if (reportName === undefined)
                callback(Boom.badRequest('report (Report Name) is missing from your request query'));
            if (countBy === undefined)
                callback(Boom.badRequest('countBy (Count By) is missing from your request query' +
                    'this is necessary because gives you the ability to count by either person_id or encounter_id'));
            //build query params
            var queryParams = {
                reportName: reportName,
                countBy: countBy //this gives the ability to count by either person_id or encounter_id
            };
            //build report
            reportFactory.buildReportExpression(queryParams, function (exprResult) {
                var columns = ["name as location, location_uuid" + exprResult];
                var queryParts = {
                    columns: columns,
                    table: "etl.flat_hiv_summary",
                    where: ["encounter_datetime >= ? and encounter_datetime <= ? ", startDate, endDate],
                    joins: [
                        ['amrs.location', 't2', 't1.location_uuid = t2.uuid']
                    ],
                    group: ['location_uuid']

                };
                db.queryServer_test(queryParts, function (result) {
                    callback(result);
                });
            });
        },
        getDataEntryIndicators: function getDataEntryIndicators(subType, request, callback) {
            var reportName = 'data-entry-statistic-report';

            var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);
            var endDate = request.query.endDate || new Date().toISOString().substring(0, 10);
        
            //build query params
            var queryParams = {
                reportName: reportName,
                countBy: 'encounter', //this gives the ability to count by either person_id or encounter_id,
                locations: request.query.locations,
                provideruuid: request.query.providerUuid,
                encounterTypeIds: request.query.encounterTypeIds,
                creatoruuid: request.query.creatorUuid,
                formIds: request.query.formIds
            };

            reportFactory.buildReportExpression(queryParams, function (exprResult) {
                var columns;
                var groupBy;
                var joins = [
                    ['amrs.encounter', 't2', 't1.encounter_id = t2.encounter_id'],
                    ['amrs.encounter_type', 't3', 't3.encounter_type_id = t2.encounter_type']
                ];
                var where = ["encounter_datetime >= ? and encounter_datetime <= ?", startDate, endDate];

                buildWhereClauseForDataEntryIndicators(queryParams, where);

                switch (subType) {
                    case 'by-date-by-encounter-type':
                        columns = ["date(encounter_datetime) as date, t2.encounter_type as encounter_type_id, t3.name as encounter_type" + exprResult];
                        groupBy = ['date', 'encounter_type_id'];
                        joins.push(['amrs.provider', 't4', 't4.provider_id = t1.provider_id']);
                        break;
                    case 'by-month-by-encounter-type':
                        columns = ["CONCAT(year(encounter_datetime), '-', month(encounter_datetime))  as month, t2.encounter_type as encounter_type_id, t3.name as encounter_type" + exprResult];
                        groupBy = ['month', 'encounter_type_id'];
                        joins.push(['amrs.provider', 't4', 't4.provider_id = t1.provider_id']);
                        break;
                    case 'by-provider-by-encounter-type':
                        columns = ["t4.provider_id as provider_id, t4.uuid as provider_uuid, t2.encounter_type as encounter_type_id, t3.name as encounter_type" + exprResult];
                        groupBy = ['provider_id', 'encounter_type_id'];
                        joins.push(['amrs.provider', 't4', 't4.provider_id = t1.provider_id']);
                        break;
                    case 'by-creator-by-encounter-type':
                        columns = ["t5.person_id as creator_id, t5.uuid as person_uuid, t2.encounter_type as encounter_type_id, t3.name as encounter_type" + exprResult];
                        groupBy = ['creator_id', 'encounter_type_id'];
                        joins.push(['amrs.person', 't5', 't2.creator = t5.person_id']);
                        break;
                }

                var queryParts = {
                    columns: columns,
                    table: "amrs.encounter_provider",
                    where: where,
                    joins: joins,
                    group: groupBy
                };
                db.queryServer_test(queryParts, function (result) {
                    callback(result);
                });
            });
        },
        getPatientListByIndicator: function getPatientListByIndicator(request, callback){
            console.log('Getting Here',request.query);
            var reportIndicator =request.query.indicator;
            var location = request.params.location;
            var startDate = request.query.startDate || new Date().toISOString().substring(0,10);
            var endDate = request.query.endDate || new Date().toISOString().substring(0,10);
            //Check for undefined query field
            if(reportIndicator === undefined)
                callback(Boom.badRequest('indicator (Report Indicator) is missing from your request query'));
            //declare query params
            var queryParams = {
                reportIndicator: reportIndicator,
            };
            //build report
            reportFactory.buildPatientListExpression(queryParams, function(exprResult){
                var queryParts = {
                    columns : "*",
                    table:exprResult.resource,
                    where:["encounter_datetime >= ? and encounter_datetime <= ? and location_id=? and "
                    +exprResult.whereClause,startDate,endDate,location]
                };
                db.queryServer_test(queryParts, function(result){
                    callback(result);
                });
            });
        }
    };
    
    //helper functions
    function buildWhereClauseForDataEntryIndicators(queryParams, where) {
        if (queryParams.locations) {
            var locations = [];
            _.each(queryParams.locations.split(','), function (loc) {
                locations.push(Number(loc));
            });
            where[0] = where[0] + " and t2.location_id in ?";
            where.push(locations);
        }
        if (queryParams.provideruuid) {
            where[0] = where[0] + " and t4.uuid = ?";
            where.push(queryParams.provideruuid);
        }
        if (queryParams.creatoruuid) {
            where[0] = where[0] + " and t5.uuid = ?";
            where.push(queryParams.creatoruuid);
        }
        if (queryParams.encounterTypeIds) {
            var encounterTypes = [];
            _.each(queryParams.encounterTypeIds.split(','), function (encType) {
                encounterTypes.push(Number(encType));
            });
            where[0] = where[0] + " and t2.encounter_type in ?";
            where.push(encounterTypes);
        }
        if (queryParams.formIds) {
            var formIds = [];
            _.each(queryParams.formIds.split(','), function (formid) {
                formIds.push(Number(formid));
            });
            where[0] = where[0] + " and t2.form_id in ?";
            where.push(formIds);
        }
    }
} ();
