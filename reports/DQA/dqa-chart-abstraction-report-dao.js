import QueryService from '../../app/database-access/query.service';

export class DQAChartAbstractionDAO {
  constructor() {}

  getDQAChartAbstractionReport(
    locations,
    limit,
    offset,
    startDate,
    endDate,
    patientType
  ) {
    let where = '';
    switch (patientType) {
      case 'PEADS':
        where = `TIMESTAMPDIFF(YEAR, h.birthdate, '` + endDate + `') < 15`;
        break;
      case 'PMTCT':
        where = `p.program_id = 4`;
        break;
      default:
        where = `TIMESTAMPDIFF(YEAR, h.birthdate, '` + endDate + `') >= 15`;
    }
    let runner = this.getSqlRunner();

    const limitOffSetDefinition =
      limit === 'all' ? '' : `limit ` + limit + ` offset ` + offset;
    let sqlQuery =
      `
      SELECT 
    h.person_uuid AS uuid,
    fpiv.ccc AS ccc_number,
    IF((fpiv.nupi IS NOT NULL), fpiv.nupi, 'missing') AS NUPI,
    TIMESTAMPDIFF(year,h.birthdate,'` +
      endDate +
      `') AS age,
    IF(DATE(h.tb_screening_datetime) > DATE_SUB(h.endDate, INTERVAL 6 MONTH),
        'Yes',
        'No') AS tb_screened_this_visit,
    CASE
        WHEN  (h.gender = 'F') then 'Female'
        WHEN  (h.gender = 'M') then 'Male'
        ELSE 'missing'
    END AS 'sex_gender',
    e.height,
    e.weight,
    DATE_FORMAT(h.birthdate, "%d-%b-%Y") AS birthdate,
    h.encounter_id,
    DATE_FORMAT(h.encounter_date, "%d-%b-%Y") AS last_appointment_date,
    h.rtc_date,
    h.location_id,
    h.cur_arv_meds,
    CASE 
        WHEN (h.cur_arv_meds_names regexp '[[:<:]]DTG[[:>:]]') THEN 'DTG-based'
        WHEN (h.cur_arv_meds_names NOT regexp '[[:<:]]DTG[[:>:]]') THEN 'Non-DTG-based'
        ELSE 'NON DTG'
    END as cur_arv_med_basis,
    h.tb_screen,
    DATE_FORMAT(h.tb_screening_datetime,"%d-%b-%Y") as tb_screening_datetime,
    DATE_FORMAT(e.hiv_start_date,"%d-%b-%Y") as hiv_start_date,
    h.arv_start_date,
    DATE_FORMAT(h.arv_first_regimen_start_date,"%d-%b-%Y") as arv_first_regimen_start_date,
    e.cd4_1,
    IF((e.cd4_1 IS NOT NULL), 'Y', 'N') as has_cd4_1,
    DATE_FORMAT(e.encounter_datetime, "%d-%b-%Y") AS last_clinical_encounter,
    DATE_FORMAT(h.rtc_date, "%d-%b-%Y") AS next_appointment,
    h.vl_1,
    CASE
        WHEN (TIMESTAMPDIFF(MONTH,h.arv_start_date,'` +
      endDate +
      `') < 6 ) THEN 'NA'
        WHEN (h.vl_1 is NOT NULL) THEN 'Y'
        ELSE 'missing'
    END AS viral_load_validity,
    h.cur_arv_meds_names AS drugs_given,
    CASE
        WHEN
            e.height IS NOT NULL
                AND e.weight IS NOT NULL
        THEN
            e.weight / ((e.height / 100) * (e.height / 100))
        ELSE NULL
    END AS BMI,
    TIMESTAMPDIFF(DAY,
        h.encounter_date,
        h.rtc_date) AS drugs_duration,
    IF(h.ipt_start_date = h.encounter_date,
        1,
        0) AS ipt_started_this_visit,
    DATE_FORMAT(h.ipt_start_date, "%d-%b-%Y") AS last_ipt_start_date,
    CASE
        WHEN h.on_ipt_this_month = 1 THEN 'continuing'
        WHEN
            h.ipt_completion_date IS NULL
                AND h.ipt_stop_date IS NOT NULL
        THEN
            'Discontinued'
        WHEN h.ipt_completion_date IS NOT NULL THEN 'INH Completed'
        WHEN (h.on_ipt_this_month = 0 AND h.on_tb_tx_this_month = 0) THEN 'Missing'
        WHEN ((TIMESTAMPDIFF(MONTH,h.ipt_start_date,'` +
      endDate +
      `') < 3) AND h.on_ipt_this_month = 1) THEN 'Defaulted'
        ELSE 'NA'
    END AS tpt_status,
    DATE_FORMAT(h.ipt_stop_date,"%d-%b-%Y") as ipt_stop_date,
    DATE_FORMAT(h.ipt_completion_date, "%d-%b-%Y") as ipt_completion_date, 
    fv.muac as muac,
    IF(h.ipt_stop_date = h.encounter_date
            OR h.ipt_completion_date = h.encounter_date,
        1,
        0) AS ipt_ended_this_visit,
    h.status,
    IF((o.value_coded IS NULL), 'N', 'Y') AS is_crag_screened,
    CASE
        WHEN (h.vl_1 < 200) THEN 'Y'
        WHEN (h.vl_1 >= 200) THEN 'N'
        ELSE 'Missing'
    END AS vl_suppression,
    CASE
        WHEN (e.tb_screening_result IN (6621,1118)) THEN 'TB Screening not done'
        WHEN (e.tb_screening_result = 6971) THEN 'Presumed TB'
        WHEN (e.tb_screening_result IN (6137, 6176, 10767)) THEN 'TB confirmed'
        WHEN (e.tb_screening_result IN (1107 , 10678)) THEN 'No TB signs'
        ELSE 'Missing'
    END AS tb_screening_result
FROM
    etl.hiv_monthly_report_dataset_v1_2 h
        LEFT JOIN
    etl.flat_hiv_summary_v15b e ON (h.encounter_id = e.encounter_id)
        LEFT JOIN
    etl.flat_vitals fv ON (e.person_id = fv.person_id)
        INNER JOIN
    amrs.person t1 ON (h.person_id = t1.person_id)
        inner JOIN
    etl.flat_patient_identifiers_v1 fpiv ON (t1.person_id = fpiv.patient_id)
        LEFT JOIN
    amrs.patient_program p ON (p.patient_id = h.person_id
        AND p.program_id IN (4)
        AND p.date_completed IS NULL
        AND p.voided = 0)
        LEFT JOIN
    amrs.obs o ON (o.encounter_id = e.encounter_id
        AND o.person_id = h.person_id
        AND o.concept_id in (9812)
        AND o.voided = 0 
        )
WHERE
     h.status = "active" AND
h.endDate >= '` +
      startDate +
      `'
AND h.endDate <= '` +
      endDate +
      `'
	AND h.location_id IN (` +
      locations +
      `)
	AND ` +
      where +
      `
GROUP BY
	h.person_id
	` +
      limitOffSetDefinition;

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
