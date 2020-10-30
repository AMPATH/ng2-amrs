/*jshint -W003, -W097, -W117, -W026 */
'use strict';

var db = require('../../etl-db');
var _ = require('underscore');
var patientStatusReport = require('../../reports/patient-status-change-tracker-report.json');
var reportFactory = require('../../etl-factory');
var helpers = require('../../etl-helpers');
var Moment = require('moment');
module.exports = (function () {
  return {
    getPatientCareStatusAggregatesQuery: function (queryParams, callback) {
      var queryParts = {};
      var indicators = [];
      var whereClause = {};

      // add patient level indicators from the report schema
      _.each(patientStatusReport[0].indicators, function (reportIndicator) {
        _.each(reportFactory.indicatorsSchema, function (indicator) {
          if (indicator.name === reportIndicator.expression) {
            indicators.push(indicator.expression + ' as ' + indicator.name);
            //if (_.contains(requestIndicators, indicator.name))
            // whereClause += ' and (' + indicator.expression + ')';
          }
        });
      });
      var column = '';
      if (queryParams.analysis === 'cohortAnalysis') {
        column =
          "date_format(date('" +
          queryParams.endDate +
          "'), '%m/%Y') as reporting_month," +
          "'" +
          queryParams.startDate +
          "' as from_month, " +
          "'" +
          queryParams.endDate +
          "' as to_month, ";
      } else {
        column =
          "date_format(if(to_month,to_month,last_day(date_add(from_month,interval 1 day))), '%m/%Y') as reporting_month," +
          "if(from_month,from_month,date_sub(DATE_FORMAT(to_month, '%Y-%m-01'),interval 1 day)) as from_month, " +
          'if(to_month,to_month,last_day(date_add(from_month,interval 1 day))) as to_month, ';
      }
      var where1 =
        queryParams.analysis === 'cohortAnalysis'
          ? "t2.endDate = date('" + queryParams.startDate + "')"
          : "t2.endDate >= date('" +
            queryParams.startDate +
            "') and t2.endDate <= date('" +
            queryParams.endDate +
            "')";
      var where2 =
        queryParams.analysis === 'cohortAnalysis'
          ? "t2.endDate = date('" + queryParams.endDate + "')"
          : "t2.endDate >= date('" +
            queryParams.startDate +
            "') and t2.endDate <= date('" +
            queryParams.endDate +
            "')";
      var onClause =
        queryParams.analysis === 'cohortAnalysis'
          ? 'on t1.person_id = t2.person_id '
          : "on t1.person_id = t2.person_id and t1.endDate = date_sub(DATE_FORMAT(t2.endDate, '%Y-%m-01'), interval 1 day) ";

      var sql =
        'select  * from (' +
        'select ' +
        'patient_uuid,next_state,' +
        column +
        "if(p1,p1,p2) as person_id, concat(initial_state,'_to_', next_state) as indicator, count(*) as counts " +
        'from (' +
        "select *, case when ar1 then 'active_return' when ne1 then 'new_enrollment' " +
        "when ti1 then 'transfer_in' when ltfu1 then 'LTFU' when to1 then 'transfer_out' " +
        "when d1 then 'dead' when neg1 then 'HIV_negative' when sd1 then 'self_disengaged' " +
        "else 'self_transfer_out' end as initial_state, " +
        "case when ar2 then 'active_return' when ne2 then 'new_enrollment' when ti2 then 'transfer_in' " +
        "when ltfu2 then 'LTFU' when to2 then 'transfer_out' when d2 then 'dead' " +
        "when neg2 then 'HIV_negative' when sd2 then 'self_disengaged' else 'self_transfer_out' " +
        'end as next_state ' +
        'from ' +
        '(select t1.person_id as p1, t2.person_id as p2, t1.reporting_date as from_month, t2.reporting_date as to_month, ' +
        'if(t1.reporting_month, t1.reporting_month, t2.reporting_month) as reporting_month, ' +
        'if(t1.uuid, t1.uuid, t2.uuid) as patient_uuid, ' +
        't1.active_return as ar1, t1.new_enrollments as ne1, t1.transfer_in as ti1, ' +
        't1.LTFU as ltfu1, t1.transfer_out_patients as to1, t1.deaths as d1, ' +
        't1.HIV_negative_patients as neg1, t1.self_disengaged_patients as sd1, ' +
        't2.active_return as ar2, t2.new_enrollments as ne2, t2.transfer_in as ti2, ' +
        't2.LTFU as ltfu2, t2.transfer_out_patients as to2, t2.deaths as d2, ' +
        't2.HIV_negative_patients as neg2, t2.self_disengaged_patients as sd2 ' +
        'from ( ' +
        this.getPatientCareStatusInternalQuery(
          queryParams,
          indicators,
          where1
        ) +
        ' ) `t1` ' +
        'left outer join( ' +
        this.getPatientCareStatusInternalQuery(
          queryParams,
          indicators,
          where2
        ) +
        ' ) t2 ' +
        onClause +
        '  union all ' +
        'select t1.person_id as p1, t2.person_id as p2, t1.reporting_date as from_month, t2.reporting_date as to_month, ' +
        'if(t1.reporting_month, t1.reporting_month, t2.reporting_month) as reporting_month, ' +
        'if(t1.uuid, t1.uuid, t2.uuid) as patient_uuid, ' +
        ' t1.active_return, t1.new_enrollments, t1.transfer_in, t1.LTFU, t1.transfer_out_patients, ' +
        ' t1.deaths, t1.HIV_negative_patients, t1.self_disengaged_patients, ' +
        't2.active_return as ar2, t2.new_enrollments as ne2, t2.transfer_in as ti2, t2.LTFU as ltfu2, ' +
        't2.transfer_out_patients as to2, t2.deaths as d2, t2.HIV_negative_patients as neg2, t2.self_disengaged_patients as sd2 ' +
        'from( ' +
        this.getPatientCareStatusInternalQuery(
          queryParams,
          indicators,
          where1
        ) +
        ' ) `t1` ' +
        'right outer join( ' +
        this.getPatientCareStatusInternalQuery(
          queryParams,
          indicators,
          where2
        ) +
        ' ) t2 ' +
        onClause +
        'having t1.person_id is null ) tn  ) tn2  group by from_month, to_month, indicator order by from_month, to_month ' +
        ') t1 ';
      queryParts.sql = sql;
      db.queryServer(queryParts, function (result) {
        result.sql = sql;
        callback(result);
      });
    },
    getPatientCareStatusPatientListQuery: function (queryParams, callback) {
      if (queryParams.analysis === 'cohortAnalysis') {
        this.cohortPatientListQuery(queryParams, function (result) {
          callback(result);
        });
      } else {
        this.monthlyPatientListQuery(queryParams, function (result) {
          callback(result);
        });
      }
    },
    monthlyPatientListQuery: function (queryParams, callback) {
      var queryParts = {};
      var indicators = [];
      var whereClause = '';
      var requestIndicators = (queryParams.indicator || '').split('_to_');
      var columns = [
        'patient_uuid',
        'p1p2',
        'next_state',
        'person.gender',
        'person.birthdate',
        'extract(year from (from_days(datediff(now(),person.birthdate)))) as age',
        "concat(COALESCE(person_name.given_name,''),' ',COALESCE(person_name.middle_name,''),' ',COALESCE(person_name.family_name,'')) as person_name",
        "group_concat(distinct id.identifier separator ', ') as identifiers"
      ];

      // go back 1 month in time
      var startDate = Moment(
        Moment(queryParams.startDate).format('YYYY-MM-DD')
      );
      //var endDate = Moment(Moment(queryParams.endDate).format('YYYY-MM-DD')).endOf('month');
      queryParams.startDate = new Date(startDate.add(-1, 'months'))
        .toISOString()
        .substring(0, 10);
      // queryParams.endDate = new Date(endDate.add(1, 'months')).toISOString().substring(0, 10);

      // add patient level indicators from the report schema & whereClause from queryParams
      _.each(patientStatusReport[0].indicators, function (reportIndicator) {
        _.each(reportFactory.indicatorsSchema, function (indicator) {
          if (indicator.name === reportIndicator.expression) {
            indicators.push(indicator.expression + ' as ' + indicator.name);
            //if (_.contains(requestIndicators, indicator.name))
            // whereClause += ' and (' + indicator.expression + ')';
          }
        });
      });
      var where =
        " t2.endDate >= date('" +
        queryParams.startDate +
        "') and t2.endDate <= date('" +
        queryParams.endDate +
        "') ";
      var onClause =
        " on t1.person_id = t2.person_id and t1.endDate = date_sub(DATE_FORMAT(t2.endDate, '%Y-%m-01'), interval 1 day) ";
      var sql =
        'select  ' +
        columns.toString() +
        ' from (' +
        'select *, if(p1, p1, p2) as p1p2, ' +
        " case when ar1 then 'active_return' when ne1 then 'new_enrollment' " +
        "when ti1 then 'transfer_in' when ltfu1 then 'LTFU' when to1 then 'transfer_out' " +
        "when d1 then 'dead' when neg1 then 'HIV_negative' when sd1 then 'self_disengaged' " +
        "else 'self_transfer_out' end as initial_state, " +
        "case when ar2 then 'active_return' when ne2 then 'new_enrollment' when ti2 then 'transfer_in' " +
        "when ltfu2 then 'LTFU' when to2 then 'transfer_out' when d2 then 'dead' " +
        "when neg2 then 'HIV_negative' when sd2 then 'self_disengaged' else 'self_transfer_out' " +
        'end as next_state ' +
        'from ' +
        '(select t1.person_id as p1, t2.person_id as p2, t1.reporting_date as from_month, t2.reporting_date as to_month, ' +
        'if(t1.reporting_month, t1.reporting_month, t2.reporting_month) as reporting_month, ' +
        'if(t1.uuid, t1.uuid, t2.uuid) as patient_uuid, ' +
        't1.active_return as ar1, t1.new_enrollments as ne1, t1.transfer_in as ti1, ' +
        't1.LTFU as ltfu1, t1.transfer_out_patients as to1, t1.deaths as d1, ' +
        't1.HIV_negative_patients as neg1, t1.self_disengaged_patients as sd1, ' +
        't2.active_return as ar2, t2.new_enrollments as ne2, t2.transfer_in as ti2, ' +
        't2.LTFU as ltfu2, t2.transfer_out_patients as to2, t2.deaths as d2, ' +
        't2.HIV_negative_patients as neg2, t2.self_disengaged_patients as sd2 ' +
        'from ( ' +
        this.getPatientCareStatusInternalQuery(queryParams, indicators, where) +
        ' ) `t1` ' +
        'left outer join( ' +
        this.getPatientCareStatusInternalQuery(queryParams, indicators, where) +
        ' ) t2 ' +
        onClause +
        '  union all ' +
        'select t1.person_id as p1, t2.person_id as p2, t1.reporting_date as from_month, t2.reporting_date as to_month, ' +
        'if(t1.reporting_month, t1.reporting_month, t2.reporting_month) as reporting_month, ' +
        'if(t1.uuid, t1.uuid, t2.uuid) as patient_uuid, ' +
        ' t1.active_return, t1.new_enrollments, t1.transfer_in, t1.LTFU, t1.transfer_out_patients, ' +
        ' t1.deaths, t1.HIV_negative_patients, t1.self_disengaged_patients, ' +
        't2.active_return as ar2, t2.new_enrollments as ne2, t2.transfer_in as ti2, t2.LTFU as ltfu2, ' +
        't2.transfer_out_patients as to2, t2.deaths as d2, t2.HIV_negative_patients as neg2, t2.self_disengaged_patients as sd2 ' +
        'from( ' +
        this.getPatientCareStatusInternalQuery(queryParams, indicators, where) +
        ' ) `t1` ' +
        'right outer join( ' +
        this.getPatientCareStatusInternalQuery(queryParams, indicators, where) +
        ' ) t2 ' +
        onClause +
        'having t1.person_id is null ) tn ' +
        "having initial_state = '" +
        requestIndicators[0] +
        "' " +
        "and next_state = '" +
        requestIndicators[1] +
        "' " +
        " and date(to_month)=date('" +
        queryParams.endDate +
        "') " +
        ') t1 ' +
        ' INNER JOIN amrs.person_name `person_name` ON (t1.p1p2 = person_name.person_id and (person_name.voided is null || person_name.voided = 0)) ' +
        'LEFT OUTER JOIN amrs.patient_identifier `id` ON (t1.p1p2 = id.patient_id) ' +
        'INNER JOIN amrs.person `person` ON (t1.p1p2 = person.person_id) ' +
        ' group by t1.p1p2 ';

      queryParts.sql = sql;
      db.queryServer(queryParts, function (result) {
        result.sql = sql;
        callback(result);
      });
    },
    cohortPatientListQuery: function (queryParams, callback) {
      var queryParts = {};
      var indicators = [];
      var whereClause = '';
      var requestIndicators = (queryParams.indicator || '').split('_to_');
      var columns = [
        'patient_uuid',
        'p1p2',
        'next_state',
        'initial_state',
        'person.gender',
        'person.birthdate',
        'extract(year from (from_days(datediff(now(),person.birthdate)))) as age',
        "concat(COALESCE(person_name.given_name,''),' ',COALESCE(person_name.middle_name,''),' ',COALESCE(person_name.family_name,'')) as person_name",
        "group_concat(distinct id.identifier separator ', ') as identifiers"
      ];

      // add patient level indicators from the report schema & whereClause from queryParams
      _.each(patientStatusReport[0].indicators, function (reportIndicator) {
        _.each(reportFactory.indicatorsSchema, function (indicator) {
          if (indicator.name === reportIndicator.expression) {
            indicators.push(indicator.expression + ' as ' + indicator.name);
            //if (_.contains(requestIndicators, indicator.name))
            // whereClause += ' and (' + indicator.expression + ')';
          }
        });
      });
      var where1 = " t2.endDate = date('" + queryParams.startDate + "') ";
      var where2 = " t2.endDate = date('" + queryParams.endDate + "') ";
      var onClause = ' on t1.person_id = t2.person_id ';
      var sql =
        'select ' +
        columns.toString() +
        ' from (' +
        ' select patient_uuid, next_state, initial_state,  if(p1, p1, p2) as p1p2 from (' +
        'select *, ' +
        " case when ar1 then 'active_return' when ne1 then 'new_enrollment' " +
        "when ti1 then 'transfer_in' when ltfu1 then 'LTFU' when to1 then 'transfer_out' " +
        "when d1 then 'dead' when neg1 then 'HIV_negative' when sd1 then 'self_disengaged' " +
        "else 'self_transfer_out' end as initial_state, " +
        "case when ar2 then 'active_return' when ne2 then 'new_enrollment' when ti2 then 'transfer_in' " +
        "when ltfu2 then 'LTFU' when to2 then 'transfer_out' when d2 then 'dead' " +
        "when neg2 then 'HIV_negative' when sd2 then 'self_disengaged' else 'self_transfer_out' " +
        'end as next_state ' +
        'from ' +
        '(select t1.person_id as p1, t2.person_id as p2, t1.reporting_date as from_month, t2.reporting_date as to_month, ' +
        'if(t1.reporting_month, t1.reporting_month, t2.reporting_month) as reporting_month, ' +
        'if(t1.uuid, t1.uuid, t2.uuid) as patient_uuid, ' +
        't1.active_return as ar1, t1.new_enrollments as ne1, t1.transfer_in as ti1, ' +
        't1.LTFU as ltfu1, t1.transfer_out_patients as to1, t1.deaths as d1, ' +
        't1.HIV_negative_patients as neg1, t1.self_disengaged_patients as sd1, ' +
        't2.active_return as ar2, t2.new_enrollments as ne2, t2.transfer_in as ti2, ' +
        't2.LTFU as ltfu2, t2.transfer_out_patients as to2, t2.deaths as d2, ' +
        't2.HIV_negative_patients as neg2, t2.self_disengaged_patients as sd2 ' +
        'from ( ' +
        this.getPatientCareStatusInternalQuery(
          queryParams,
          indicators,
          where1
        ) +
        ' ) `t1` ' +
        'left outer join( ' +
        this.getPatientCareStatusInternalQuery(
          queryParams,
          indicators,
          where2
        ) +
        ' ) t2 ' +
        onClause +
        '  union all ' +
        'select t1.person_id as p1, t2.person_id as p2, t1.reporting_date as from_month, t2.reporting_date as to_month, ' +
        'if(t1.reporting_month, t1.reporting_month, t2.reporting_month) as reporting_month, ' +
        'if(t1.uuid, t1.uuid, t2.uuid) as patient_uuid, ' +
        ' t1.active_return, t1.new_enrollments, t1.transfer_in, t1.LTFU, t1.transfer_out_patients, ' +
        ' t1.deaths, t1.HIV_negative_patients, t1.self_disengaged_patients, ' +
        't2.active_return as ar2, t2.new_enrollments as ne2, t2.transfer_in as ti2, t2.LTFU as ltfu2, ' +
        't2.transfer_out_patients as to2, t2.deaths as d2, t2.HIV_negative_patients as neg2, t2.self_disengaged_patients as sd2 ' +
        'from( ' +
        this.getPatientCareStatusInternalQuery(
          queryParams,
          indicators,
          where1
        ) +
        ' ) `t1` ' +
        'right outer join( ' +
        this.getPatientCareStatusInternalQuery(
          queryParams,
          indicators,
          where2
        ) +
        ' ) t2 ' +
        onClause +
        'having t1.person_id is null ) tn ) tn2 ' +
        'group by p1p2 ' +
        "having initial_state = '" +
        requestIndicators[0] +
        "' " +
        "and next_state = '" +
        requestIndicators[1] +
        "' " +
        ') t1 ' +
        ' INNER JOIN amrs.person_name `person_name` ON (t1.p1p2 = person_name.person_id and (person_name.voided is null || person_name.voided = 0)) ' +
        'LEFT OUTER JOIN amrs.patient_identifier `id` ON (t1.p1p2 = id.patient_id) ' +
        'INNER JOIN amrs.person `person` ON (t1.p1p2 = person.person_id) ' +
        ' group by t1.p1p2 ';

      queryParts.sql = sql;
      db.queryServer(queryParts, function (result) {
        result.sql = sql;
        callback(result);
      });
    },

    getPatientCareStatusInternalQuery: function (
      queryParams,
      indicators,
      whereClause
    ) {
      return (
        ' SELECT   t2.endDate as reporting_date, ' +
        "date_format(t2.endDate, '%m/%Y') as reporting_month, " +
        't2.endDate,t1.uuid,t1.person_id, ' +
        indicators.toString() +
        ' FROM etl.dates `t2` ' +
        'INNER JOIN etl.flat_hiv_summary_v15b `t1` force index (loc_id_enc_date_next_clinic)  ON' +
        ' (date(t1.encounter_datetime) <= date(t2.endDate)) ' +
        'WHERE (' +
        whereClause +
        ' and t1.location_id in(' +
        queryParams.locations.toString() +
        ') and t1.is_clinical_encounter = 1 ' +
        'and (t1.next_clinical_datetime_hiv is null ' +
        'or date(t1.next_clinical_datetime_hiv) > t2.endDate)' +
        ')'
      );
    }
  };
})();
