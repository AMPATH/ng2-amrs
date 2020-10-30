const Promise = require('bluebird');
const db = require('../etl-db');
export class PatientMonthlyStatusHistory {
  resolvePersonId(personUuid) {
    let query = 'Select * from amrs.person where uuid = ? limit 1';
    let params = [personUuid];
    return new Promise(function (resolve, reject) {
      db.queryReportServer({ query: query, sqlParams: params }, (result) => {
        resolve(result);
      });
    });
  }
  getPatientMonthlyStatusHistory(personUuid, startDate, endDate) {
    return this.resolvePersonId(personUuid).then((person) => {
      if (person.result && person.result.length > 0) {
        let personId = person.result[0].person_id;
        let params = [
          startDate,
          endDate,
          personId,
          startDate,
          endDate,
          personId
        ];
        let query = `SELECT p1                                                  AS person_id, 
       Date_format(e2, '%d-%m-%Y')                         AS 
       most_recent_clinical_encounter, 
       l3.name                                             AS location, 
       Date_format(rtc_date, '%d-%m-%Y') AS 
       rtc_date, 
       Date_format(r2, '%m / %Y')                          AS 'month', 
       et1.name                                            AS 
       encounter_type_name, 
       CASE 
         WHEN encounter_type IN ( 1, 2, 3, 4, 
                                  10, 14, 15, 17, 
                                  19, 26, 32, 33, 
                                  34, 47, 105, 106, 
                                  112, 113, 114, 115, 
                                  117, 120, 127, 128, 129 ) THEN 'Clinical' 
         WHEN encounter_type IN ( 21 ) THEN 'Outreach' 
       end                                                 AS status_source, 
       CASE 
         WHEN active_return THEN 'active_return' 
         WHEN new_enrollments THEN 'new_enrollment' 
         WHEN transfer_in THEN 'transfer_in' 
         WHEN ltfu THEN 'LTFU' 
         WHEN transfer_out_patients THEN 'transfer_out' 
         WHEN deaths THEN 'dead' 
         WHEN hiv_negative_patients THEN 'HIV_negative' 
         WHEN self_disengaged_patients THEN 'self_disengaged' 
         ELSE 'none' 
       end                                                 AS initial_state, 
       CASE 
         WHEN ar2 THEN 'active_return' 
         WHEN ne2 THEN 'new_enrollment' 
         WHEN ti2 THEN 'transfer_in' 
         WHEN ltfu2 THEN 'LTFU' 
         WHEN to2 THEN 'transfer_out' 
         WHEN d2 THEN 'dead' 
         WHEN neg2 THEN 'HIV_negative' 
         WHEN sd2 THEN 'self_disengaged' 
         ELSE 'none' 
       end                                                 AS next_state 
FROM   (SELECT t1.person_id                AS p1, 
               t2.person_id                AS p2, 
               t1.encounter_datetime       AS e1, 
               t2.encounter_datetime       AS e2, 
               t1.location_id              AS l1, 
               t2.location_id              AS l2, 
               t1.next_clinical_datetime_hiv, 
               t1.reporting_date           AS r1, 
               t2.reporting_date           AS r2, 
               t1.active_return, 
               t1.new_enrollments, 
               t1.transfer_in, 
               t1.ltfu, 
               t1.transfer_out_patients, 
               t1.deaths, 
               t1.hiv_negative_patients, 
               t1.self_disengaged_patients, 
               t2.active_return            AS ar2, 
               t2.new_enrollments          AS ne2, 
               t2.transfer_in              AS ti2, 
               t2.ltfu                     AS ltfu2, 
               t2.transfer_out_patients    AS to2, 
               t2.deaths                   AS d2, 
               t2.hiv_negative_patients    AS neg2, 
               t2.self_disengaged_patients AS sd2, 
               t1.encounter_type           AS encounter_type, 
               t1.location_id              AS location_id ,
               t2.rtc_date
        FROM   (SELECT t2.enddate                       AS reporting_date, 
                       t1.location_id, 
                       Date_format(t2.enddate, '%m/%Y') AS reporting_month, 
                       t2.enddate, 
                       t1.person_id, 
                       t1.encounter_datetime, 
                       t1.encounter_type, 
                       t1.rtc_date, 
                       t1.transfer_out, 
                       t1.prev_clinical_rtc_date_hiv, 
                       t1.death_date, 
                       t1.next_clinical_datetime_hiv, 
                       outreach.death_date              AS outreach_death_date, 
                       outreach.encounter_datetime      AS outreach_date, 
                       outreach.patient_care_status, 
                       outreach.transfer_out            AS outreach_transfer_out 
                       , 
                       t1.hiv_start_date, 
                       t1.arv_first_regimen_location_id,
                       CASE 
                         WHEN Date(t1.encounter_datetime) <= t2.enddate THEN 1 
                         ELSE NULL 
                       end                              AS total_patients, 
                       CASE 
                         WHEN Date(t1.death_date) <= t2.enddate 
                               OR Date(outreach.death_date) <= t2.enddate THEN 
                         NULL 
                         WHEN outreach.patient_care_status IN ( 9036 ) 
                               OR t1.patient_care_status IN ( 9036 ) THEN 1 
                         ELSE NULL 
                       end                              AS HIV_negative_patients 
                       , 
                       CASE 
                         WHEN Date(t1.death_date) <= t2.enddate 
                               OR Date(outreach.death_date) <= t2.enddate THEN 
                         NULL 
                         WHEN t1.patient_care_status IN ( 9083 ) 
                               OR outreach.patient_care_status IN ( 9083 ) 
                               OR transfer.patient_care_status IN ( 9083 ) THEN 
                         1 
                         ELSE NULL 
                       end                              AS 
                       self_disengaged_patients, 
                       CASE 
                         WHEN Date(t1.death_date) <= t2.enddate 
                               OR Date(outreach.death_date) <= t2.enddate THEN 1 
                         ELSE NULL 
                       end                              AS deaths, 
                       CASE 
                         WHEN Date(t1.death_date) <= t2.enddate 
                               OR Date(outreach.death_date) <= t2.enddate THEN 
                         NULL 
                         WHEN t1.transfer_out IS NOT NULL 
                               OR outreach.transfer_out IS NOT NULL 
                               OR transfer.transfer_out IS NOT NULL THEN 1 
                         ELSE NULL 
                       end                              AS transfer_out_patients 
                       , 
                       CASE 
                         WHEN Date(t1.death_date) <= t2.enddate 
                               OR Date(outreach.death_date) <= t2.enddate THEN 
                         NULL 
                         WHEN t1.transfer_out IS NOT NULL 
                               OR outreach.transfer_out IS NOT NULL 
                               OR transfer.transfer_out IS NOT NULL THEN NULL 
                         WHEN t1.patient_care_status IN ( 9083 ) 
                               OR outreach.patient_care_status IN ( 9083 ) 
                               OR transfer.patient_care_status IN ( 9083 ) THEN 
                         NULL 
                         WHEN outreach.patient_care_status IN ( 9036 ) 
                               OR t1.patient_care_status IN ( 9036 ) THEN NULL 
                         WHEN Timestampdiff(day, IF(t1.rtc_date, t1.rtc_date, 
                                                 Date_add(t1.encounter_datetime, 
                                                        INTERVAL 30 day)), 
                                     t2.enddate) <= 90 THEN 1 
                         ELSE NULL 
                       end                              AS active_in_care, 
                       CASE 
                         WHEN Date(t1.hiv_start_date) BETWEEN 
                              Date_format(t2.enddate, '%Y-%m-01') AND 
                              t2.enddate THEN NULL 
                         WHEN t1.transfer_in IS NOT NULL 
                              AND ( t1.encounter_datetime BETWEEN 
                                    Date_format(t2.enddate, '%Y-%m-01') 
                                    AND 
                                    t2.enddate ) THEN NULL 
                         WHEN Date(t1.death_date) <= t2.enddate 
                               OR Date(outreach.death_date) <= t2.enddate THEN 
                         NULL 
                         WHEN t1.transfer_out IS NOT NULL 
                               OR outreach.transfer_out IS NOT NULL 
                               OR transfer.transfer_out IS NOT NULL THEN NULL 
                         WHEN t1.patient_care_status IN ( 9083 ) 
                               OR outreach.patient_care_status IN ( 9083 ) 
                               OR transfer.patient_care_status IN ( 9083 ) THEN 
                         NULL 
                         WHEN outreach.patient_care_status IN ( 9036 ) 
                               OR t1.patient_care_status IN ( 9036 ) THEN NULL 
                         WHEN Timestampdiff(day, IF(t1.rtc_date, t1.rtc_date, 
                                                 Date_add(t1.encounter_datetime, 
                                                        INTERVAL 30 day)), 
                                     t2.enddate) <= 90 THEN 1 
                         ELSE NULL 
                       end                              AS active_return, 
                       CASE 
                         WHEN Date(t1.hiv_start_date) BETWEEN 
                              Date_format(t2.enddate, '%Y-%m-01') AND 
                              t2.enddate THEN NULL 
                         WHEN t1.transfer_in IS NOT NULL 
                              AND ( t1.encounter_datetime BETWEEN 
                                    Date_format(t2.enddate, '%Y-%m-01') 
                                    AND 
                                    t2.enddate ) THEN 1 
                         ELSE NULL 
                       end                              AS transfer_in, 
                       CASE 
                         WHEN Date(t1.death_date) <= t2.enddate 
                               OR Date(outreach.death_date) <= t2.enddate THEN 
                         NULL 
                         WHEN t1.transfer_out IS NOT NULL 
                               OR outreach.transfer_out IS NOT NULL 
                               OR transfer.transfer_out IS NOT NULL THEN NULL 
                         WHEN t1.patient_care_status IN ( 9083 ) 
                               OR outreach.patient_care_status IN ( 9083 ) 
                               OR transfer.patient_care_status IN ( 9083 ) THEN 
                         NULL 
                         WHEN outreach.patient_care_status IN ( 9036 ) 
                               OR t1.patient_care_status IN ( 9036 ) THEN NULL 
                         WHEN Date(t1.hiv_start_date) BETWEEN 
                              Date_format(t2.enddate, '%Y-%m-01') AND 
                              t2.enddate THEN 1 
                         ELSE NULL 
                       end                              AS new_enrollments, 
                       CASE 
                         WHEN Date(t1.death_date) <= t2.enddate 
                               OR Date(outreach.death_date) <= t2.enddate THEN 
                         NULL 
                         WHEN t1.transfer_out IS NOT NULL 
                               OR outreach.transfer_out IS NOT NULL 
                               OR transfer.transfer_out IS NOT NULL THEN NULL 
                         WHEN t1.patient_care_status IN ( 9083 ) 
                               OR outreach.patient_care_status IN ( 9083 ) 
                               OR transfer.patient_care_status IN ( 9083 ) THEN 
                         NULL 
                         WHEN outreach.patient_care_status IN ( 9036 ) 
                               OR t1.patient_care_status IN ( 9036 ) THEN NULL 
                         WHEN Timestampdiff(day, IF(t1.rtc_date, t1.rtc_date, 
                                                 Date_add(t1.encounter_datetime, 
                                                        INTERVAL 30 day)), 
                                     t2.enddate) > 90 THEN 1 
                         ELSE NULL 
                       end                              AS LTFU 
                FROM   etl.dates t2 
                       INNER JOIN etl.flat_hiv_summary_v15b t1
                               ON ( Date(t1.encounter_datetime) <= 
                                    Date(t2.enddate) ) 
                       LEFT OUTER JOIN etl.flat_hiv_summary_v15b outreach
                                    ON ( t1.person_id = outreach.person_id 
                                         AND outreach.encounter_type = 21 
                                         AND outreach.encounter_datetime > 
                                             t1.encounter_datetime 
                                         AND Date(outreach.encounter_datetime) 
                                             <= 
                                             t2.enddate 
                                         AND ( 
                       Date(outreach.next_encounter_datetime_hiv) > 
                       t2.enddate 
                        OR outreach.next_encounter_datetime_hiv IS NULL 
                                             ) ) 
                       LEFT OUTER JOIN etl.flat_hiv_summary_v15b transfer
                                    ON ( t1.person_id = transfer.person_id 
                                         AND transfer.encounter_type = 116 
                                         AND transfer.encounter_datetime > 
                                             t1.encounter_datetime 
                                         AND Date(transfer.encounter_datetime) 
                                             <= 
                                             t2.enddate 
                                         AND ( 
                       Date(transfer.next_encounter_datetime_hiv) > 
                       t2.enddate 
                        OR transfer.next_encounter_datetime_hiv IS NULL 
                                             ) ) 
                WHERE  ( t2.enddate >= ? 
                         AND t2.enddate <= ? 
                         AND t1.person_id = ? 
                         AND t1.is_clinical_encounter = 1 
                         AND ( t1.next_clinical_datetime_hiv IS NULL 
                                OR Date(t1.next_clinical_datetime_hiv) > 
               t2.enddate ) )) t1 
               LEFT OUTER JOIN (SELECT t2.enddate                       AS 
                                       reporting_date, 
                                       t1.location_id, 
                                       Date_format(t2.enddate, '%m/%Y') AS 
                                       reporting_month, 
                                       t2.enddate, 
                                       t1.person_id, 
                                       t1.encounter_datetime, 
                                       t1.encounter_type, 
                                       t1.rtc_date, 
                                       t1.transfer_out, 
                                       t1.prev_clinical_rtc_date_hiv, 
                                       t1.death_date, 
                                       t1.next_clinical_datetime_hiv, 
                                       outreach.death_date              AS 
                                       outreach_death_date, 
                                       outreach.encounter_datetime      AS 
                                       outreach_date, 
                                       outreach.patient_care_status, 
                                       outreach.transfer_out            AS 
                       outreach_transfer_out, 
                                       t1.hiv_start_date, 
                                       t1.arv_first_regimen_location_id,
                                       CASE 
                                         WHEN Date(t1.encounter_datetime) <= 
                                              t2.enddate 
                                       THEN 1 
                                         ELSE NULL 
                                       end                              AS 
                                       total_patients, 
                                       CASE 
                                         WHEN Date(t1.death_date) <= t2.enddate 
                                               OR Date(outreach.death_date) <= 
                                                  t2.enddate THEN 
                                         NULL 
                                         WHEN outreach.patient_care_status IN ( 
                                              9036 ) 
                                               OR t1.patient_care_status IN ( 
                                                  9036 ) 
                                       THEN 1 
                                         ELSE NULL 
                                       end                              AS 
                       HIV_negative_patients, 
                                       CASE 
                                         WHEN Date(t1.death_date) <= t2.enddate 
                                               OR Date(outreach.death_date) <= 
                                                  t2.enddate THEN 
                                         NULL 
                                         WHEN t1.patient_care_status IN ( 9083 ) 
                                               OR outreach.patient_care_status 
                                                  IN ( 
                                                  9083 ) 
                                               OR transfer.patient_care_status 
                                                  IN ( 
                                                  9083 ) THEN 
                                         1 
                                         ELSE NULL 
                                       end                              AS 
                       self_disengaged_patients, 
                                       CASE 
                                         WHEN Date(t1.death_date) <= t2.enddate 
                                               OR Date(outreach.death_date) <= 
                                                  t2.enddate THEN 
                                         1 
                                         ELSE NULL 
                                       end                              AS 
                                       deaths, 
                                       CASE 
                                         WHEN Date(t1.death_date) <= t2.enddate 
                                               OR Date(outreach.death_date) <= 
                                                  t2.enddate THEN 
                                         NULL 
                                         WHEN t1.transfer_out IS NOT NULL 
                                               OR outreach.transfer_out IS NOT 
                                                  NULL 
                                               OR transfer.transfer_out IS NOT 
                                                  NULL 
                                       THEN 1 
                                         ELSE NULL 
                                       end                              AS 
                       transfer_out_patients, 
                                       CASE 
                                         WHEN Date(t1.death_date) <= t2.enddate 
                                               OR Date(outreach.death_date) <= 
                                                  t2.enddate THEN 
                                         NULL 
                                         WHEN t1.transfer_out IS NOT NULL 
                                               OR outreach.transfer_out IS NOT 
                                                  NULL 
                                               OR transfer.transfer_out IS NOT 
                                                  NULL 
                                       THEN NULL 
                                         WHEN t1.patient_care_status IN ( 9083 ) 
                                               OR outreach.patient_care_status 
                                                  IN ( 
                                                  9083 ) 
                                               OR transfer.patient_care_status 
                                                  IN ( 
                                                  9083 ) THEN 
                                         NULL 
                                         WHEN outreach.patient_care_status IN ( 
                                              9036 ) 
                                               OR t1.patient_care_status IN ( 
                                                  9036 ) 
                                       THEN NULL 
                                         WHEN Timestampdiff(day, 
                                              IF(t1.rtc_date, t1.rtc_date, 
               Date_add(t1.encounter_datetime, 
                      INTERVAL 30 day)), 
               t2.enddate) <= 90 THEN 1 
               ELSE NULL 
               end                              AS active_in_care, 
               CASE 
               WHEN Date(t1.hiv_start_date) BETWEEN 
               Date_format(t2.enddate, '%Y-%m-01') AND 
               t2.enddate THEN NULL 
               WHEN t1.transfer_in IS NOT NULL 
               AND ( t1.encounter_datetime BETWEEN 
               Date_format(t2.enddate, '%Y-%m-01') 
               AND 
               t2.enddate ) THEN NULL 
               WHEN Date(t1.death_date) <= t2.enddate 
               OR Date(outreach.death_date) <= t2.enddate THEN NULL 
               WHEN t1.transfer_out IS NOT NULL 
               OR outreach.transfer_out IS NOT NULL 
               OR transfer.transfer_out IS NOT NULL THEN NULL 
               WHEN t1.patient_care_status IN ( 9083 ) 
               OR outreach.patient_care_status IN ( 9083 ) 
               OR transfer.patient_care_status IN ( 9083 ) THEN NULL 
               WHEN outreach.patient_care_status IN ( 9036 ) 
               OR t1.patient_care_status IN ( 9036 ) THEN NULL 
               WHEN Timestampdiff(day, IF(t1.rtc_date, t1.rtc_date, 
               Date_add(t1.encounter_datetime, 
                      INTERVAL 30 day)), 
               t2.enddate) <= 90 THEN 1 
               ELSE NULL 
               end                              AS active_return, 
               CASE 
               WHEN Date(t1.hiv_start_date) BETWEEN 
               Date_format(t2.enddate, '%Y-%m-01') AND 
               t2.enddate THEN NULL 
               WHEN t1.transfer_in IS NOT NULL 
               AND ( t1.encounter_datetime BETWEEN 
               Date_format(t2.enddate, '%Y-%m-01') 
               AND 
               t2.enddate ) THEN 1 
               ELSE NULL 
               end                              AS transfer_in, 
               CASE 
               WHEN Date(t1.death_date) <= t2.enddate 
               OR Date(outreach.death_date) <= t2.enddate THEN NULL 
               WHEN t1.transfer_out IS NOT NULL 
               OR outreach.transfer_out IS NOT NULL 
               OR transfer.transfer_out IS NOT NULL THEN NULL 
               WHEN t1.patient_care_status IN ( 9083 ) 
               OR outreach.patient_care_status IN ( 9083 ) 
               OR transfer.patient_care_status IN ( 9083 ) THEN NULL 
               WHEN outreach.patient_care_status IN ( 9036 ) 
               OR t1.patient_care_status IN ( 9036 ) THEN NULL 
               WHEN Date(t1.hiv_start_date) BETWEEN 
               Date_format(t2.enddate, '%Y-%m-01') AND 
               t2.enddate THEN 1 
               ELSE NULL 
               end                              AS new_enrollments, 
               CASE 
               WHEN Date(t1.death_date) <= t2.enddate 
               OR Date(outreach.death_date) <= t2.enddate THEN NULL 
               WHEN t1.transfer_out IS NOT NULL 
               OR outreach.transfer_out IS NOT NULL 
               OR transfer.transfer_out IS NOT NULL THEN NULL 
               WHEN t1.patient_care_status IN ( 9083 ) 
               OR outreach.patient_care_status IN ( 9083 ) 
               OR transfer.patient_care_status IN ( 9083 ) THEN NULL 
               WHEN outreach.patient_care_status IN ( 9036 ) 
               OR t1.patient_care_status IN ( 9036 ) THEN NULL 
               WHEN Timestampdiff(day, IF(t1.rtc_date, t1.rtc_date, 
               Date_add(t1.encounter_datetime, 
                      INTERVAL 30 day)), 
               t2.enddate) > 90 THEN 1 
               ELSE NULL 
               end                              AS LTFU 
               FROM   etl.dates t2 
               INNER JOIN etl.flat_hiv_summary_v15b t1
               ON ( Date(t1.encounter_datetime) <= Date(t2.enddate) ) 
               LEFT OUTER JOIN etl.flat_hiv_summary_v15b outreach
               ON ( t1.person_id = outreach.person_id 
               AND outreach.encounter_type = 21 
               AND outreach.encounter_datetime > 
               t1.encounter_datetime 
               AND Date(outreach.encounter_datetime) <= t2.enddate 
               AND ( Date(outreach.next_encounter_datetime_hiv) > 
               t2.enddate 
               OR outreach.next_encounter_datetime_hiv IS NULL 
               ) ) 
               LEFT OUTER JOIN etl.flat_hiv_summary_v15b transfer
               ON ( t1.person_id = transfer.person_id 
               AND transfer.encounter_type = 116 
               AND transfer.encounter_datetime > 
               t1.encounter_datetime 
               AND Date(transfer.encounter_datetime) <= t2.enddate 
               AND ( Date(transfer.next_encounter_datetime_hiv) > 
               t2.enddate 
               OR transfer.next_encounter_datetime_hiv IS NULL 
               ) ) 
               WHERE  ( t2.enddate >= ? 
               AND t2.enddate <= ? 
               AND t1.person_id = ? 
               AND t1.is_clinical_encounter = 1 
               AND ( t1.next_clinical_datetime_hiv IS NULL 
               OR Date(t1.next_clinical_datetime_hiv) > t2.enddate ) )) t2 
                            ON t1.person_id = t2.person_id 
                               AND t1.enddate = Date_sub(Date_format(t2.enddate, 
                                                         '%Y-%m-01'), 
                                                INTERVAL 1 day)) t 
       JOIN amrs.location AS l3 
         ON l3.location_id = l2
       JOIN amrs.encounter_type AS et1 
         ON et1.encounter_type_id = encounter_type; 
                `;
        return new Promise(function (resolve, reject) {
          db.queryReportServer(
            { query: query, sqlParams: params },
            (result) => {
              resolve(result);
            }
          );
        });
      } else {
        return new Promise(function (resolve, reject) {
          reject({ error: 'Could not resolve patient id' });
        });
      }
    });
  }
}
