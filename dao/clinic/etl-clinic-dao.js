/*jshint -W003, -W097, -W117, -W026 */
'use strict';

var db = require('../../etl-db');
var _ = require('underscore');
var reportFactory = require('../../etl-factory');
var Boom = require('boom'); //extends Hapi Error Reporting. Returns HTTP-friendly error objects: github.com/hapijs/boom
var helpers = require('../../etl-helpers');
module.exports = function () {
    return {
        getClinicEncounterData: function getClinicEncounterData(request, callback) {
            var uuid = request.params.uuid;
            var order = helpers.getSortOrder(request.query.order);
            var filters = {
                s: ""
            };
            if (request.query.filters)
                filters = helpers.getFilters(JSON.parse(request.query.filters));
            var where = ["t1.location_uuid = ?", uuid];
            if (filters.s !== "") {
                where[0] += " AND " + filters.s;
                where = where.concat(filters.vals);
            }


            var queryParts = {
                columns: request.query.fields || "t1.*,t2.gender,round(datediff(t1.encounter_datetime,t2.birthdate)/365) as age,group_concat(identifier) as identifiers",
                table: "etl.flat_hiv_summary",
                joins: [
                    ['amrs.person', 't2', 't1.person_id = t2.person_id'],
                    ['amrs.patient_identifier', 't3', 't1.person_id=t3.patient_id']
                ],
                where: where,
                group: ['person_id', 'encounter_id'],
                order: order || [{
                    column: 'encounter_datetime',
                    asc: false
                }],
                offset: request.query.startIndex,
                limit: request.query.limit
            };

            db.queryServer_test(queryParts, function (result) {
                _.each(result.result, function (row) {
                    row.cur_arv_meds = helpers.getARVNames(row.cur_arv_meds);
                    row.arv_first_regimen = helpers.getARVNames(row.arv_first_regimen);
                });
                callback(result);
            });
        },
        getClinicHivSummayIndicators: function getClinicHivSummayIndicators(request, callback) {
            var uuid = request.params.uuid;
            var order = helpers.getSortOrder(request.query.order);

            var query = "";

            var queryParts = {
                columns: request.query.fields || "*",
                table: "etl.hiv_summary_indicators",
                where: ["location = ?", uuid],
                order: order || [{
                    column: 'encounter_datetime',
                    asc: false
                }],
                offset: request.query.startIndex,
                limit: request.query.limit
            };

            db.queryServer_test(queryParts, function (result) {
                callback(result);
            });
        },
        getClinicAppointmentSchedule: function getClinicAppointmentSchedule(request, callback) {
            var uuid = request.params.uuid;
            var order = helpers.getSortOrder(request.query.order);
            var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);
            var endDate = request.query.endDate || new Date().toISOString().substring(0, 10);

            if (!_.isUndefined(startDate)) startDate = startDate.split('T')[0];
            if (!_.isUndefined(endDate)) endDate = endDate.split('T')[0];

            var queryParts = {
                columns: request.query.fields || "t1.*,t3.given_name,t3.middle_name,t3.family_name,group_concat(identifier) as identifiers",
                table: "etl.flat_hiv_summary",
                joins: [
                    //  ['etl.derived_encounter', 't2', 't1.encounter_id = t2.encounter_id'],
                    ['amrs.person_name', 't3', 't1.person_id = t3.person_id and (t3.voided is null || t3.voided = 0)'],
                    ['amrs.patient_identifier', 't4', 't1.person_id=t4.patient_id']
                ],
                where: ["t1.location_uuid = ? and date(rtc_date) >= ? and date(rtc_date) <= ?", uuid, startDate, endDate],
                group: ['person_id'],
                order: order || [{
                    column: 'family_name',
                    asc: true
                }],
                offset: request.query.startIndex,
                limit: request.query.limit
            };

            db.queryServer_test(queryParts, function (result) {
                callback(result);
            });

        },
        getClinicDailyVisits: function getClinicDailyVisits(request, callback) {
            var uuid = request.params.uuid;
            var order = helpers.getSortOrder(request.query.order);
            var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);
            var endDate = request.query.endDate || new Date().toISOString().substring(0, 10);

            if (!_.isUndefined(startDate)) startDate = startDate.split('T')[0];
            if (!_.isUndefined(endDate)) endDate = endDate.split('T')[0];

            var queryParts = {
                columns: request.query.fields || "t1.*,t3.given_name,t3.middle_name,t3.family_name,group_concat(identifier) as identifiers",
                table: "etl.flat_hiv_summary",
                joins: [
                    //    ['etl.derived_encounter', 't2', 't1.encounter_id = t2.encounter_id'],
                    ['amrs.person_name', 't3', 't1.person_id = t3.person_id and (t3.voided is null || t3.voided = 0)'],
                    ['amrs.patient_identifier', 't4', 't1.person_id=t4.patient_id']
                ],
                where: ["t1.location_uuid = ? and date(encounter_datetime) >= ? and date(encounter_datetime) <= ?", uuid, startDate, endDate],
                group: ['person_id'],
                order: order || [{
                    column: 'family_name',
                    asc: true
                }],
                offset: request.query.startIndex,
                limit: request.query.limit
            };

            db.queryServer_test(queryParts, function (result) {
                callback(result);
            });

        },
        getHasNotReturned: function getHasNotReturned(request, callback) {
            var uuid = request.params.uuid;
            var order = helpers.getSortOrder(request.query.order);
            var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);
            var endDate = request.query.endDate || new Date().toISOString().substring(0, 10);

            if (!_.isUndefined(startDate)) startDate = startDate.split('T')[0];
            if (!_.isUndefined(endDate)) endDate = endDate.split('T')[0];

            var queryParts = {
                columns: request.query.fields || "t1.*,t3.given_name,t3.middle_name,t3.family_name,group_concat(identifier) as identifiers",
                table: "etl.flat_hiv_summary",
                joins: [
                    ['amrs.person_name', 't3', 't1.person_id = t3.person_id and (t3.voided is null || t3.voided = 0)'],
                    ['amrs.patient_identifier', 't4', 't1.person_id=t4.patient_id']
                ],
                where: ["t1.location_uuid = ? and date(t1.rtc_date) between ? and ? and next_clinical_datetime_hiv is null",

                    uuid, startDate, endDate
                ],
                group: ['person_id'],
                order: order || [{
                    column: 'family_name',
                    asc: true
                }],
                offset: request.query.startIndex,
                limit: request.query.limit
            };
            db.queryServer_test(queryParts, function (result) {
                callback(result);
            });

        },
        getClinicMonthlyAppointmentSchedule: function getClinicMonthlyAppointmentSchedule(request, callback) {
            var uuid = request.params.uuid;
            var order = helpers.getSortOrder(request.query.order);
            var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);

            var queryParts = {
                columns: request.query.fields || ["date(rtc_date) as rtc_date", "date_format(rtc_date,'%W') as day_of_week", "count( distinct t1.person_id) as total"],
                table: "etl.flat_hiv_summary",
                where: ["t1.location_uuid = ? and date_format(rtc_date,'%Y-%m') = date_format(?,'%Y-%m')", uuid, startDate],
                group: ['rtc_date'],
                order: order || [{
                    column: 'rtc_date',
                    asc: true
                }],
                offset: request.query.startIndex,
                limit: request.query.limit
            };

            db.queryServer_test(queryParts, function (result) {
                callback(result);
            });
        },
        getClinicMonthlySummary: function getClinicMonthlySummary(request, callback) {
            var uuid = request.params.uuid;
            var order = helpers.getSortOrder(request.query.order);
            var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);
            var endDate = request.query.endDate || new Date().toISOString().substring(0, 10);

            if (!_.isUndefined(startDate)) startDate = startDate.split('T')[0];
            if (!_.isUndefined(endDate)) endDate = endDate.split('T')[0];

            var queryParts = {};
            queryParts.values = [uuid, startDate, endDate, uuid, startDate, endDate];
            queryParts.startDate = startDate;
            var sql = "SELECT d AS rtc_date," +
                "       date_format(d,'%W') AS day_of_week," +
                "       SUM(CASE WHEN description = 'schedule' THEN total_scheduled ELSE 0 END) AS total_visited," +
                "       SUM(CASE WHEN description = 'encounter' THEN total_scheduled ELSE 0 END) AS total," +
                "       (CASE WHEN CURDATE() > d THEN scheduled_and_attended ELSE 0 END) as scheduled_and_attended," +
                "       (CASE WHEN CURDATE() >  d THEN has_not_returned ELSE 0 END) as has_not_returned from" +
                "  (SELECT date(rtc_date) AS d, 'schedule' AS description, date_format(rtc_date,'%W') AS day_of_week, count(DISTINCT t1.person_id) AS total_scheduled,location_id, count(DISTINCT if(next_clinical_datetime_hiv IS NOT NULL,t1.person_id,NULL)) AS scheduled_and_attended, count(DISTINCT if(next_clinical_datetime_hiv IS NULL,t1.person_id,NULL)) AS has_not_returned" +
                "   FROM etl.flat_hiv_summary t1" +
                "   WHERE t1.location_uuid = ?" +
                "     AND rtc_date BETWEEN ? AND ?  GROUP BY d" +
                "   UNION SELECT date(encounter_datetime) AS d, 'encounter' AS description, date_format(encounter_datetime,'%W') AS day_of_week, count(DISTINCT t1.person_id) AS total_visits,location_id, count(DISTINCT if(next_clinical_datetime_hiv IS NOT NULL,t1.person_id,NULL)) AS scheduled_and_attended, count(DISTINCT if(next_clinical_datetime_hiv IS NULL,t1.person_id,NULL)) AS has_not_returned" +
                "   FROM etl.flat_hiv_summary t1" +
                "   WHERE t1.location_uuid = ? " +
                "     AND date(encounter_datetime) BETWEEN ? AND ?" +
                "   GROUP BY d) AS a GROUP BY d;";
            queryParts.sql = sql;
            db.queryServer(queryParts, function (result) {
                callback(result);
            });
        },
        getClinicMonthlyVisits: function getClinicMonthlyVisits(request, callback) {
            var uuid = request.params.uuid;
            var order = helpers.getSortOrder(request.query.order);
            var startDate = request.query.startDate || new Date().toISOString().substring(0, 10);

            var queryParts = {
                columns: request.query.fields || ["date(encounter_datetime) as visit_date", "date_format(encounter_datetime,'%W') as day_of_week", "count( distinct t1.person_id) as total"],
                table: "etl.flat_hiv_summary",
                where: ["t1.location_uuid = ? and date_format(encounter_datetime,'%Y-%m') = date_format(?,'%Y-%m')", uuid, startDate],
                group: ['encounter_datetime'],
                order: order || [{
                    column: 'encounter_datetime',
                    asc: true
                }],
                offset: request.query.startIndex,
                limit: request.query.limit
            };

            db.queryServer_test(queryParts, function (result) {
                callback(result);
            });
        },
        getDefaulterList: function getDefaulterList(request, callback) {
            var uuids = request.query.locationUuids;
            var order = helpers.getSortOrder(request.query.order);

            var defaulterPeriod = request.query.defaulterPeriod || 30;
            var maxPeriod = request.query.maxDefaultPeriod || '';
            var maxDefaultPeriodFilter = '';
            var programUuid = request.query.programUuid;

            // Define optional max default period
            if (maxPeriod) {
                maxDefaultPeriodFilter = 'and days_since_rtc <= ?';
            }

            var queryParts = {
                columns: request.query.fields || ["*", "extract(year from (from_days(datediff(now(),t3.birthdate)))) as age",
                "date_format(fhs.rtc_date, '%Y-%m-%d') as latest_rtc_date",
                "fhs.vl_1 as latest_vl",
                "date_format(fhs.vl_1_date, '%Y-%m-%d') as latest_vl_date",
                "CONCAT(COALESCE(DATE_FORMAT(fhs.encounter_datetime, '%Y-%m-%d'),''),' ',COALESCE(et.name, '')) as last_appointment",
                "fhs.cur_arv_meds as cur_meds",
                "fhs.vl_2 as previous_vl",
                "date_format(fhs.vl_2_date, '%Y-%m-%d') as previous_vl_date",
                "pa.address3 as nearest_center"
            ],
                table: "etl.flat_defaulters",
                joins: [
                    ['amrs.person', 't3', 't1.person_id = t3.person_id and t3.death_date is null']
                ],
                leftOuterJoins: [
                    ['amrs.patient_program', 't4', 't1.person_id = t4.patient_id AND t4.date_completed IS NULL'],
                    ['(SELECT program_id, uuid as `programuuid` FROM amrs.program ) `t5` ON (t4.program_id = t5.program_id)'],
                    ['etl.flat_hiv_summary_v15b', 'fhs', 't1.person_id = fhs.person_id AND fhs.next_clinical_location_id IS NULL AND fhs.encounter_type NOT IN (99999)'],
                    ['amrs.encounter_type', 'et', 'fhs.encounter_type = et.encounter_type_id'],
                    ['amrs.person_address', 'pa', 't1.person_id = pa.person_id']
                ],
                where: ["t1.location_uuid in (?) and programuuid in (?) and days_since_rtc >= ? " + maxDefaultPeriodFilter, uuids, programUuid, defaulterPeriod, maxPeriod],
                order: order || [{
                    column: 'days_since_rtc',
                    asc: true
                }],
                group: ['t1.person_id'],
                offset: request.query.startIndex,
                limit: request.query.limit
            };

            db.queryServer_test(queryParts, function (result) {
                _.each(result.result, (item) => {
                    item.cur_meds = helpers.getARVNames(item.cur_meds);
                });
                callback(result);
            });
        },
        getClinicDefaulterList: function getClinicDefaulterList(request, callback) {
            var uuid = request.params.uuid;
            var order = helpers.getSortOrder(request.query.order);

            var defaulterPeriod = request.query.defaulterPeriod || 30;

            var queryParts = {
                columns: request.query.fields || ["*", "extract(year from (from_days(datediff(now(),t3.birthdate)))) as age"],
                table: "etl.flat_defaulters",
                joins: [
                    ['amrs.person', 't3', 't1.person_id = t3.person_id ']
                ],
                where: ["location_uuid = ? and days_since_rtc >= ?", uuid, defaulterPeriod],
                order: order || [{
                    column: 'days_since_rtc',
                    asc: true
                }],
                offset: request.query.startIndex,
                limit: request.query.limit
            };

            db.queryServer_test(queryParts, function (result) {
                callback(result);
            });
        }
    };
} ();