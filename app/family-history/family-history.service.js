var db = require('../../etl-db');
var obs_service = require('../../service/openmrs-rest/obs.service');

export class FamilyTestingService {
  getPatientList = (params) => {
    return new Promise((resolve, reject) => {
      let queryParts = {};
      let where = '';
      let sql = 'SELECT ';
      const columns = `t1.*,tx.*, tx.encounter_datetime as last_date_elicited, t2.contacts_count,tx.gender as index_gender,
      case 
          when eligible_for_testing = 1065 then 'YES' 
          when eligible_for_testing = 1066 then 'No' 
          else null 
        end as test_eligible,
        case 
          when test_result = 703 then 'POSITIVE' 
          when test_result = 664 then 'NEGATIVE' 
          when test_result = 1138 then 'INDETERMINATE'
          else null 
        end as test_result_value,
        case 
          when in_care = 1065 then 'YES' 
          when in_care = 1066 then 'NO' 
          when in_care = 1067 then 'UNKNOWN'
          else null 
        end as enrolled,
        case 
          when facility_enrolled is not null then facility_enrolled  
        end as fm_facility_enrolled,
        date_format(preferred_testing_date,"%d-%m-%Y") as preferred_testing_date,
        case 
          when fm_status is null then 'UNKNOWN' 
          else fm_status 
        end as modified_fm_status,
        date_format(current_test_date,"%d-%m-%Y") as modified_current_test_date,
        extract(year from (from_days(datediff(now(),tx.birthdate)))) as age , 
        extract(year from (from_days(datediff(now(),t1.fm_dob)))) as fm_current_age ,  
        extract(year from (from_days(datediff(t1.date_elicited,t1.fm_dob)))) as age_at_elicitation `;

      const from = `FROM
      etl.flat_family_testing_index tx
        LEFT JOIN
      etl.flat_family_testing t1 on (tx.person_id = t1.patient_id)
          LEFT JOIN
      (SELECT 
          patient_id, COUNT(*) AS 'contacts_count'
      FROM
          etl.flat_family_testing
          WHERE
       location_uuid = '${params.locationUuid}'
      GROUP BY patient_id) t2 ON (t1.patient_id = t2.patient_id) `;

      where = `
      WHERE
      tx.location_uuid = '${params.locationUuid}' `;

      if (params.start_date != null && params.end_date != null) {
        where =
          where +
          `  and date(t1.date_elicited) between date('${params.start_date}') and date('${params.end_date}')`;
      } else if (params.end_date != null) {
        where =
          where + `  and date(t1.date_elicited) <= date('${params.end_date}')`;
      }

      if (params.eligible != null) {
        where = where + `  and eligible_for_testing = '${params.eligible}'`;
      }

      if (params.programs != undefined) {
        let program = '';
        const programs = params.programs.split(',');
        for (let i = 0; i < programs.length; i++) {
          if (i == programs.length - 1) {
            program += `'${programs[i]}'`;
          } else {
            program += `'${programs[i]}',`;
          }
        }

        where = where + `  and tx.patient_program_uuid in (${program})`;
      }

      switch (params.child_status) {
        case '1':
          where = where + `  and tx.child_status_reason = 11890`;
          break;
        case '0':
          where = where + `  and tx.child_status_reason = 11891`;
          break;
      }

      if (params.elicited_clients == 0) {
        where = `${where}  group by tx.person_id`;
        sql =
          sql +
          ' tx.*, extract(year from (from_days(datediff(now(),tx.birthdate)))) as age, tx.gender as index_gender ' +
          from +
          where;
      } else if (params.elicited_clients < 0) {
        where = `${where} and obs_group_id is null `;
        sql =
          sql +
          ' tx.*, extract(year from (from_days(datediff(now(),tx.birthdate)))) as age, tx.gender as index_gender ' +
          from +
          where;
      } else if (params.elicited_clients > 0) {
        where = `${where} and tx.person_id in (select patient_id from etl.flat_family_testing where location_uuid = '${params.locationUuid}' ) group by tx.person_id`;
        sql =
          sql +
          ' tx.*, extract(year from (from_days(datediff(now(),tx.birthdate)))) as age, tx.gender as index_gender ' +
          from +
          where;
      } else {
        sql = sql + columns + from + where + ' and obs_group_id is not null ';
      }

      queryParts = {
        sql: sql
      };
      return db.queryServer(queryParts, function (result) {
        result.sql = sql;
        resolve(result);
      });
    });
  };

  getPatientContacts = (params) => {
    return new Promise((resolve, reject) => {
      let queryParts = {};
      let sql = `select t1.*,
    case 
        when children_testing_consent_given = 1065 then 'YES' 
        when children_testing_consent_given = 1066 then 'NO'
    end as children_testing_consent_given,
    case 
        when child_status = 1065 then 'YES' 
        when child_status = 1066 then 'NO'
        when child_status = 1175 then 'Not Applicable' 
     end as child_status,
      case 
        when child_status_reason = 11890 then 'Children above 19yrs' 
        when child_status_reason = 11891 then 'No child' 
      end as child_status_reason,
      case 
        when children_elicited_by_partner = 1065 then 'YES' 
        when children_elicited_by_partner = 1066 then 'NO' 
      end as children_elicited_by_partner,
      case 
        when female_partner_status = 10901 then 'unknown HIV status' 
        when female_partner_status = 9584 then 'Not in care' 
        when female_partner_status = 159 then 'Deceased' 
      end as female_partner_status,
      case 
        when fm_uuid is not null then true
        when fm_status = 'POSITIVE' or test_result = 703 then false
        when test_result = 664 then true
        else false
      end as disableRegisterAction,
      case 
        when test_result = 703 then 'POSITIVE' 
        when test_result = 664 then 'NEGATIVE' 
        when test_result = 1138 then 'INDETERMINATE'
        else null 
      end as test_result_value,
        case 
          when in_care = 1065 then 'YES' 
          when in_care = 1066 then 'NO' 
          when in_care = 1067 then 'UNKNOWN'
          else null 
        end as enrolled,
        case 
          when eligible_for_testing = 1065 then 'YES' 
          when eligible_for_testing = 1066 then 'No' 
          else null 
        end as test_eligible,
        case 
          when test_result is not null then 1 
          when eligible_for_testing = 1065 then  2
          else 0 
        end as eligible_for_tracing,
        case 
          when facility_enrolled is not null then facility_enrolled  
        end as fm_facility_enrolled,
        date_format(preferred_testing_date,"%d-%m-%Y") as preferred_testing_date,
        case 
        when fm_status is null then 'UNKNOWN' 
          else fm_status 
        end as modified_fm_status,
        date_format(current_test_date,"%d-%m-%Y") as modified_current_test_date,
        case 
          when children_count > 0 and child_status is null then 'YES' 
          when children_count is null and child_status is null then 'NO'
          end as children_elicited,
        tx.encounter_datetime,
        t1.date_elicited,
        tx.updated_elicitation_date,
        tx.updated_elicitation_date_alert
          
      FROM
            etl.flat_family_testing_index tx
              LEFT JOIN
            etl.flat_family_testing t1 on (tx.person_id = t1.patient_id) 
              LEFT JOIN
            (SELECT patient_id, COUNT(*) AS 'children_count'
              FROM
            etl.flat_family_testing
              WHERE
            patient_uuid = '${params.patientUuid}'
              and fm_age < 20) t2
            ON (t1.patient_id = t2.patient_id) 
            where tx.patient_uuid = '${params.patientUuid}'`;
      /*
      1.eligible_for_tracing = 0, not eligible for testing 
      2.eligible_for_tracing = 1, traced and tested
      3.eligible_for_tracing = 2, eligible for testing
      */
      queryParts = {
        sql: sql
      };
      return db.queryServer(queryParts, function (result) {
        result.sql = sql;
        resolve(result);
      });
    });
  };

  updateRegisteredContact = (params) => {
    return new Promise((resolve, reject) => {
      let queryParts = {};
      let sql =
        'update etl.flat_family_testing set is_registered = 1, fm_uuid = "' +
        params.uuid +
        '" where obs_group_id = ' +
        params.obs_group_id +
        '';
      queryParts = {
        sql: sql
      };
      return db.queryServer(queryParts, function (result) {
        result.sql = sql;
        resolve(result);
      });
    });
  };

  saveContactTracing = (params) => {
    return new Promise((resolve, reject) => {
      let queryParts = {};
      let sql = '';
      let save_params =
        'set contact_id = ' +
        params.payload.contact_id +
        ',contact_date="' +
        params.payload.contact_date +
        '",contact_type=' +
        params.payload.contact_type +
        ',contact_status=' +
        params.payload.contact_status +
        ',reason_not_contacted=' +
        params.payload.reason_not_contacted +
        ',remarks="' +
        params.payload.remarks +
        '"';

      if (params.query.trace_id != null) {
        sql =
          'update etl.contact_tracing ' +
          save_params +
          ' where id = ' +
          params.query.trace_id +
          '';
      } else {
        sql = 'insert into etl.contact_tracing ' + save_params;
      }
      queryParts = {
        sql: sql
      };
      return db.queryServer(queryParts, function (result) {
        result.sql = sql;
        resolve(result);
      });
    });
  };

  getContactTracingHistory = (params) => {
    return new Promise((resolve, reject) => {
      let queryParts = {};
      let sql = `select t2.*, id, contact_id, contact_date, remarks,
        case 
          when contact_type = 1555 then 'Phone tracing' 
          when contact_type = 10791 then 'Physical tracing' 
        end as contact_type,
        case 
          when contact_status = 1065 then 'Contacted' 
          when contact_status = 1118 then 'Not contacted'
        end as contact_status,
        case 
          when reason_not_contacted = 1 then 'Incorrect locator information' 
          when reason_not_contacted = 2 then 'Not found/Travelled' 
          when reason_not_contacted = 3 then 'Not known in the area'
          when reason_not_contacted = 4 then 'Relocated' 
          when reason_not_contacted = 5 then 'Deceased' 
          when reason_not_contacted = 6 then 'other'
          when reason_not_contacted = 7 then 'Invalid phone number'
          when reason_not_contacted = 8 then 'Phone off' 
          when reason_not_contacted = 9 then 'Wrong phone number' 
        end as reason_not_contacted
        from etl.flat_family_testing t2 left join etl.contact_tracing t1 on (t1.contact_id = t2.obs_group_id) 
        where obs_group_id = ${params.contact_id}`;
      queryParts = {
        sql: sql
      };
      return db.queryServer(queryParts, function (result) {
        result.sql = sql;
        resolve(result);
      });
    });
  };

  getContactObsData = (params) => {
    return new Promise((resolve, reject) => {
      let queryParts = {};
      let sql =
        "select uuid from amrs.obs where obs_id = '" + params.contact_id + "'";
      queryParts = {
        sql: sql
      };
      return db.queryServer(queryParts, function (result) {
        result.sql = sql;
        resolve(result);
      });
    });
  };

  deleteContact = (params) => {
    let that = this;
    return this.getContactObsData(params).then((res) => {
      return new Promise(function (resolve, reject) {
        obs_service
          .voidObs(res.result[0].uuid)
          .then(function (result) {
            that.removeDeletedContacts(params).then((res) => {
              resolve(res);
            });
          })
          .catch(function (error) {
            reject(error);
          });
      });
    });
  };

  removeDeletedContacts = (params) => {
    return new Promise((resolve, reject) => {
      let queryParts = {};
      let sql =
        "delete from etl.flat_family_testing where obs_group_id = '" +
        params.contact_id +
        "'";
      queryParts = {
        sql: sql
      };
      return db.queryServer(queryParts, function (result) {
        result.sql = sql;
        resolve(result);
      });
    });
  };
}
