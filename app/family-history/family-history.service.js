var db = require('../../etl-db');
var obs_service = require('../../service/openmrs-rest/obs.service');

export class FamilyTestingService {
  getPatientList = (params) => {
    return new Promise((resolve, reject) => {
      let queryParts = {};
      let where = '';
      let sql = `SELECT 
      t1.*, t2.contacts_count,
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
        date_format(current_test_date,"%d-%m-%Y") as current_test_date
        FROM
            etl.flat_family_testing t1
                INNER JOIN
            (SELECT 
                patient_id, COUNT(*) AS 'contacts_count'
            FROM
                etl.flat_family_testing
                WHERE
            location_uuid = '${params.locationUuid}'
        GROUP BY patient_id) t2 ON (t1.patient_id = t2.patient_id)
            
        `;

      where = `
      WHERE
      location_uuid = '${params.locationUuid}'`;

      if (params.start_date != null && params.end_date != null) {
        where =
          where +
          `  and date(date_elicited) between date('${params.start_date}') and date('${params.end_date}')`;
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

        where = where + `  and patient_program_uuid in (${program})`;
      }

      queryParts = {
        sql: sql + where
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
      let sql = `select *,
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
        date_format(current_test_date,"%d-%m-%Y") as current_test_date
      from etl.flat_family_testing where patient_uuid = '${params.patientUuid}'`;
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
