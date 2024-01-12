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
        where = `EXTRACT(YEAR FROM (FROM_DAYS(DATEDIFF(NOW(), h.birthdate)))) < 15`;
        break;
      case 'PMTCT':
        where = `p.program_id = 4`;
        break;
      default:
        where = `EXTRACT(YEAR FROM (FROM_DAYS(DATEDIFF(NOW(), h.birthdate)))) >= 15`;
    }
    let runner = this.getSqlRunner();

    const limitOffSetDefinition =
      limit === 'all' ? '' : `limit ` + limit + ` offset ` + offset;
    let sqlQuery =
      `
      SELECT 
    h.person_uuid AS uuid,
    fpiv.ccc AS ccc_number,
    fpiv.nupi AS upi_number,
    fpiv.ovcid AS ovcid_id,
    EXTRACT(YEAR FROM (FROM_DAYS(DATEDIFF(NOW(), h.birthdate)))) AS age,
    IF(DATE(h.tb_screening_datetime) > DATE_SUB(h.endDate, INTERVAL 6 MONTH),
        'YES',
        'NO') AS tb_screened_this_visit,
    h.gender AS 'sex_gender',
    e.height,
    e.weight,
    DATE_FORMAT(h.birthdate, '%Y-%m-%d') AS birthdate,
    h.encounter_id,
    DATE_FORMAT(h.encounter_date, '%Y-%m-%d') AS last_appointment_date,
    h.rtc_date,
    h.location_id,
    h.cur_arv_meds,
    h.tb_screen,
    h.tb_screening_datetime,
    e.hiv_start_date,
    h.arv_start_date,
    e.cd4_1,
    e.encounter_datetime AS last_clinical_encounter,
    DATE_FORMAT(h.rtc_date, '%Y-%m-%d') AS next_appointment,
    h.vl_1,
    CASE
        WHEN
            e.weight IS NOT NULL
                AND e.height IS NOT NULL
        THEN
            'YES'
        ELSE 'NO'
    END AS nutrition,
    CASE
        WHEN e.visit_type IN (37 , 58) THEN 'CARG'
        WHEN e.visit_type IN (43 , 80, 104, 118, 120, 123) THEN 'Treatment Supporter'
        ELSE 'Self'
    END AS visit_type,
    h.cur_arv_meds_names AS drugs_given,
    CASE
        WHEN
            e.height IS NOT NULL
                AND e.weight IS NOT NULL
        THEN
            e.weight / ((e.height / 100) * (e.height / 100))
        ELSE NULL
    END AS BMI,
    IF(p.program_id = 9, 'DC', 'Standard') AS DSD,
    TIMESTAMPDIFF(DAY,
        h.encounter_date,
        h.rtc_date) AS drugs_duration,
    IF(h.ipt_start_date = h.encounter_date,
        1,
        0) AS ipt_started_this_visit,
    DATE_FORMAT(h.ipt_start_date, '%Y-%m-%d') AS last_ipt_start_date,
    CASE
        WHEN e.on_ipt = 1 THEN 'CONTINUING'
        WHEN
            e.ipt_completion_date IS NULL
                AND e.ipt_stop_date IS NOT NULL
        THEN
            'DISCONTINUED'
        WHEN e.ipt_completion_date IS NOT NULL THEN 'COMPLETED'
        ELSE 'NA'
    END AS tpt_status,
    h.ipt_stop_date,
    h.ipt_completion_date,
    e.cur_who_stage,
    e.cd4_1,
    fv.muac,
    IF(h.ipt_stop_date = h.encounter_date
            OR h.ipt_completion_date = h.encounter_date,
        1,
        0) AS ipt_ended_this_visit,
    fv.systolic_bp AS sysBP,
    fv.diastolic_bp AS dysBP,
    h.status,
    IF((o.value_coded IS NULL), 'NO', 'YES') AS is_crag_screened,
    CASE
        WHEN (h.vl_1 < 200) THEN 'suppressed'
        WHEN (h.vl_1 >= 200) THEN 'unsuppressed'
    END AS vl_suppression,
    CASE
        WHEN (e.tb_screening_result = 6971) THEN 'Pr TB'
        WHEN (e.tb_screening_result = 6137) THEN 'Confirmed'
        WHEN (e.tb_screening_result IN (1107 , 10678)) THEN 'No TB'
        WHEN (e.tb_screening_result = 10767) THEN 'TB Rx'
        WHEN (e.tb_screening_result = 10974) THEN 'INH'
    END AS tb_screening_result
FROM
    etl.hiv_monthly_report_dataset_v1_2 h
        LEFT JOIN
    etl.flat_hiv_summary_v15b e ON (h.encounter_id = e.encounter_id)
        LEFT JOIN
--    etl.flat_hiv_summary_v15b ls ON (ls.next_clinical_datetime_hiv IS NULL
--        AND ls.person_id = e.person_id)
--        LEFT JOIN
--    (SELECT 
--         *, MAX(encounter_datetime) AS max_date
--     FROM
--         etl.flat_vitals
--     WHERE
--         encounter_datetime <= '` +
      endDate +
      `'
--     GROUP BY person_id , encounter_datetime
--     ORDER BY encounter_datetime) 
    etl.flat_vitals fv ON (e.person_id = fv.person_id)
        INNER JOIN
    amrs.person t1 ON (h.person_id = t1.person_id)
        inner JOIN
    etl.flat_patient_identifiers_v1 fpiv ON (t1.person_id = fpiv.patient_id and fpiv.ccc is not null)
        LEFT JOIN
    amrs.patient_program p ON (p.patient_id = h.person_id
        AND p.program_id IN (4 , 9)
        AND p.date_completed IS NULL
        AND p.voided = 0)
        LEFT JOIN
    amrs.obs o ON (o.encounter_id = e.encounter_id
        AND o.person_id = h.person_id
        AND o.concept_id = 9812
        AND o.voided = 0 and e.is_clinical_encounter = 1)
WHERE
     e.encounter_datetime >= "2022-01-01" AND (e.weight is not null) AND
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
