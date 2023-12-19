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
          h.person_uuid as uuid,
          cc.identifier as ccc_number,
          np.identifier as upi_number,
          ov.identifier as ovcid_id,
          EXTRACT(YEAR FROM (FROM_DAYS(DATEDIFF(NOW(), h.birthdate)))) AS age,
          IF( date(h.tb_screening_datetime) > date_sub(h.endDate, interval 6 month),"YES","NO") as tb_screened_this_visit,
          h.gender as 'sex_gender',
          e.height,
          e.weight,
          DATE_FORMAT(h.birthdate,'%Y-%m-%d') AS birthdate,
          h.encounter_id,
          DATE_FORMAT(h.encounter_date,'%Y-%m-%d') as last_appointment_date,
          h.rtc_date,
          h.location_id,
          h.cur_arv_meds,
          h.tb_screen,
          h.tb_screening_datetime,
          e.hiv_start_date,
          h.arv_start_date,
          e.cd4_1,
          ls.encounter_datetime AS last_clinical_encounter,
          DATE_FORMAT(h.rtc_date,'%Y-%m-%d') as next_appointment,
          h.vl_1,
          case
             when e.weight is not null and e.height is not null then 'YES'
            else 'NO'
                end as nutrition,
          case
          when e.visit_type in (37,58) then 'CARG'
                        when e.visit_type in (43,80,104,118,120,123) then 'Treatment Supporter'
            else 'Self'
                end as visit_type,
        h.cur_arv_meds_names AS drugs_given,
          case
          when e.height is not null and e.weight is not null then e.weight/((e.height/100) * (e.height/100))
          else null
        end as BMI,
          IF(p.program_id = 9, 'DC', 'Standard') AS DSD,
          TIMESTAMPDIFF(DAY,h.encounter_date,h.rtc_date) AS drugs_duration,
          IF(h.ipt_start_date = h.encounter_date,
              1,
              0) AS ipt_started_this_visit,
          DATE_FORMAT(h.ipt_start_date,'%Y-%m-%d') AS last_ipt_start_date,
          case
           when e.on_ipt = 1 then 'CONTINUING'
           when e.ipt_completion_date is null and e.ipt_stop_date is not null then 'DISCONTINUED'
           when e.ipt_completion_date is not null
               then 'COMPLETED'
           else 'NA'
           end as tpt_status,
          h.ipt_stop_date,
          h.ipt_completion_date,
          IF(h.ipt_stop_date = h.encounter_date
                  OR h.ipt_completion_date = h.encounter_date,
              1,
              0) AS ipt_ended_this_visit,fv.systolic_bp as sysBP,fv.diastolic_bp as dysBP
      FROM
          etl.hiv_monthly_report_dataset_frozen h
          LEFT JOIN
           etl.flat_hiv_summary_v15b e on (h.encounter_id=e.encounter_id)
          LEFT JOIN
           etl.flat_hiv_summary_v15b ls on (ls.next_clinical_datetime_hiv is null and ls.person_id=e.person_id)
           left JOIN (SELECT 
            person_id,
            systolic_bp,
            diastolic_bp,
            MAX(encounter_datetime) AS max_date
        FROM
            etl.flat_vitals
        WHERE
            systolic_bp IS NOT NULL
                AND diastolic_bp IS NOT NULL AND encounter_datetime <= '`+ endDate +`'
        GROUP BY person_id , encounter_datetime
        ORDER BY encounter_datetime) fv ON e.person_id = fv.person_id
          INNER JOIN
           amrs.person t1 ON (h.person_id = t1.person_id)
          INNER JOIN 
          amrs.person_name person_name ON (t1.person_id = person_name.person_id AND (person_name.voided = 0 || person_name.voided = 0))
          LEFT JOIN
          amrs.patient_identifier id ON (t1.person_id = id.patient_id AND id.voided = 0)
          LEFT JOIN
          amrs.patient_identifier cc ON (t1.person_id = cc.patient_id and cc.identifier_type in (28) AND cc.voided = 0)
          LEFT JOIN
          amrs.patient_identifier ov ON (t1.person_id = ov.patient_id and ov.identifier_type in (43) AND ov.voided = 0)
          LEFT JOIN
          amrs.patient_identifier np ON (t1.person_id = np.patient_id and np.identifier_type in (45) AND np.voided = 0)
        left join amrs.patient_program p on (p.patient_id = h.person_id and p.program_id in (4,9) and p.date_completed is null and p.voided = 0)
        WHERE h.status = "active" and visit_this_month=1 
      AND h.endDate >= '` +
      startDate +
      `'
      AND h.endDate <= '` +
      endDate +
      `'
      AND h.location_id IN (` +
      locations +
      `) AND ` +
      where +
      ` 
    GROUP BY h.person_id
    ORDER BY RAND() DESC ` +
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
