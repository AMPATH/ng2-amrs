import QueryService from '../../app/database-access/query.service';

export class DQAChartAbstractionDAO {
  constructor() {}

  getDQAChartAbstractionReport(locations, limit, offset) {
    let runner = this.getSqlRunner();
    let sqlQuery =
      `
        SELECT 
        uuid, 
        person_id, 
        identifiers, 
        person_name, 
        gender, 
        birthdate,
        case
            when timestampdiff(year,birthdate,now()) > 0 then round(timestampdiff(year,birthdate,now()),0)
            else round(timestampdiff(month,birthdate,now())/12,2)
        end as age,
        encounter_datetime as last_appointment_date,
        rtc_date as next_appointment,
        etl.get_arv_names(cur_arv_meds) AS drugs_given,
        weight,
        height,
        case
            when height is not null and weight is not null then weight/((height/100) * (height/100))
            else null
        end as BMI,
        condom_provided_this_visit,
        tb_screened_this_visit,
        ipt_start_date as last_ipt_start_date
    FROM
        (SELECT 
            *,
                GROUP_CONCAT(DISTINCT identifier
                    SEPARATOR ', ') AS identifiers
        FROM
            (SELECT 
            h.uuid,
                h.person_id,
                CONCAT(COALESCE(person_name.given_name, ''), ' ', COALESCE(person_name.middle_name, ''), ' ', COALESCE(person_name.family_name, '')) AS person_name,
                id.identifier,
                gender,
                birthdate,
                encounter_id,
                encounter_datetime,
                rtc_date,
                h.location_id,
                is_clinical_encounter,
                cur_arv_meds,
                tb_screen,
                tb_screening_datetime,
                IF(tb_screening_datetime = encounter_datetime, 1, 0) AS tb_screened_this_visit,
                ipt_start_date,
                IF(ipt_start_date = encounter_datetime, 1, 0) AS ipt_started_this_visit,
                ipt_stop_date,
                ipt_completion_date,
                IF(ipt_stop_date = encounter_datetime
                    OR ipt_completion_date = encounter_datetime, 1, 0) AS ipt_ended_this_visit,
                condoms_provided_date,
                IF(condoms_provided_date = encounter_datetime, 1, 0) AS condom_provided_this_visit
        FROM
            etl.flat_hiv_summary_v15b h
        INNER JOIN amrs.person t1 ON (h.person_id = t1.person_id)
        INNER JOIN amrs.person_name person_name ON (t1.person_id = person_name.person_id
            AND (person_name.voided IS NULL
            || person_name.voided = 0))
        LEFT JOIN amrs.patient_identifier id ON (t1.person_id = id.patient_id
            AND (id.voided IS NULL || id.voided = 0))
        WHERE
            is_clinical_encounter = 1
                AND encounter_datetime < NOW()
                AND encounter_datetime > '2018-01-01'
                AND h.location_id IN (` +
      locations +
      `)
        ORDER BY encounter_datetime DESC
        LIMIT 10000000) clinical
        GROUP BY person_id
        ORDER BY person_id DESC) AS hiv
            LEFT OUTER JOIN
        (SELECT 
            *
        FROM
            (SELECT 
            person_id AS v_person_id,
                encounter_id AS v_encounter_id,
                encounter_datetime AS v_encounter_datetime,
                weight,
                height
        FROM
            etl.flat_vitals
        WHERE
            location_id IN (` +
      locations +
      `)
                AND encounter_datetime <= NOW()
                AND encounter_datetime > '2018-01-01'
                AND (height IS NOT NULL OR weight IS NOT NULL)
        ORDER BY encounter_datetime DESC
        LIMIT 10000000) vitals
        GROUP BY v_person_id
        ORDER BY v_person_id DESC) AS vitals ON (hiv.person_id = vitals.v_person_id)
        ORDER BY encounter_datetime desc limit ` +
      limit +
      ` offset ` +
      offset +
      `; `;
    return new Promise((resolve, reject) => {
      runner
        .executeQuery(sqlQuery)
        .then((results) => {
          resolve({
            results: results
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  getSqlRunner() {
    return new QueryService();
  }
}
