'use strict';
const db = require('../etl-db');

const def = {
  getPatientQualifiedDcVisits
};

function getPatientQualifiedDcVisits(patientUuid) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
    p.person_id,
    latest_medication_visit.*,
    latest_standard_visit.*,
    latest_dc_enrolment_visit.*,
    CASE
       WHEN latest_dc_enrolment_visit.latest_dc_enrolment_visit is null THEN @recent_dc_enrolment:=0
       WHEN date(latest_dc_enrolment_visit.latest_dc_enrolment_visit) < date(latest_new_dc_enrollment_date.latest_new_dc_enrollment_date) THEN @recent_dc_enrolment:=0
       WHEN (latest_dc_enrolment_visit.latest_dc_enrolment_visit > latest_medication_visit.latest_medication_visit
                                AND latest_dc_enrolment_visit.latest_dc_enrolment_visit > latest_standard_visit.latest_standard_visit) THEN @recent_dc_enrolment:=1
           WHEN latest_dc_enrolment_visit.latest_dc_enrolment_visit > latest_medication_visit.latest_medication_visit
                                AND latest_standard_visit.latest_standard_visit is null THEN @recent_dc_enrolment:=1
           WHEN latest_dc_enrolment_visit.latest_dc_enrolment_visit > latest_standard_visit.latest_standard_visit
                                AND latest_medication_visit.latest_medication_visit is null THEN @recent_dc_enrolment:=1
       ELSE @recent_dc_enrolment:=0
    END AS 'recent_dc_enrolment',
    @recent_dc_enrolment,
    CASE
           WHEN latest_new_dc_enrollment_date.latest_new_dc_enrollment_date is null THEN @recent_dc_enrolment_program_manager:=0
       WHEN (latest_new_dc_enrollment_date.latest_new_dc_enrollment_date > latest_medication_visit.latest_medication_visit
                                AND latest_new_dc_enrollment_date.latest_new_dc_enrollment_date > latest_standard_visit.latest_standard_visit) THEN @recent_dc_enrolment_program_manager:=1
           WHEN latest_new_dc_enrollment_date.latest_new_dc_enrollment_date > latest_medication_visit.latest_medication_visit
                                AND latest_standard_visit.latest_standard_visit is null THEN @recent_dc_enrolment_program_manager:=1
           WHEN latest_new_dc_enrollment_date.latest_new_dc_enrollment_date > latest_standard_visit.latest_standard_visit
                                AND latest_medication_visit.latest_medication_visit is null THEN @recent_dc_enrolment_program_manager:=1
        WHEN latest_new_dc_enrollment_date.latest_new_dc_enrollment_date is not null and latest_medication_visit.latest_medication_visit is null 
                                AND latest_standard_visit.latest_standard_visit is null then @recent_dc_enrolment_program_manager:=1
       ELSE @recent_dc_enrolment_program_manager:=0
    END AS 'recent_dc_enrolment_program_manager',
    @recent_dc_enrolment_program_manager,
    CASE
       WHEN @recent_dc_enrolment = 1 THEN 1 
       WHEN @recent_dc_enrolment_program_manager = 1 THEN 0
       WHEN latest_standard_visit.latest_standard_visit > latest_medication_visit.latest_medication_visit THEN 1
       WHEN latest_standard_visit.latest_standard_visit is not null AND latest_medication_visit.latest_medication_visit is NULL THEN 1
       WHEN latest_standard_visit.latest_standard_visit is null AND latest_medication_visit.latest_medication_visit is NULL THEN 1
       ELSE 0
    END AS 'qualifies_for_medication_refill',
    CASE
       WHEN @recent_dc_enrolment = 1 THEN 0
       WHEN @recent_dc_enrolment_program_manager = 1 THEN 1
       WHEN latest_medication_visit.latest_medication_visit > latest_standard_visit.latest_standard_visit THEN 1
       WHEN latest_medication_visit.latest_medication_visit IS NOT NULL AND latest_standard_visit.latest_standard_visit is NULL THEN 1
       ELSE 0
    END AS 'qualifies_for_standard_visit'
FROM
    amrs.person p
    LEFT JOIN (
    SELECT 
    e.patient_id,
    e.encounter_datetime as 'latest_medication_visit'
FROM
    amrs.encounter e
    join amrs.person p on (e.patient_id = p.person_id)
    join amrs.visit v on (e.visit_id = v.visit_id)
    where e.encounter_type in (186)
    AND v.visit_type_id in (138,16,58,123)
    AND e.voided = 0
    AND p.uuid = '${patientUuid}'
    order by encounter_datetime desc limit 1
    ) latest_medication_visit on (latest_medication_visit.patient_id = p.person_id)
    LEFT JOIN (
    SELECT 
    e.patient_id,
    e.encounter_datetime AS 'latest_standard_visit'
FROM
    amrs.encounter e
    join amrs.person p on (e.patient_id = p.person_id)
    join amrs.visit v on (e.visit_id = v.visit_id)
    where e.encounter_type in (2)
    AND v.visit_type_id in (59)
    AND e.voided = 0
    AND p.uuid = '${patientUuid}'
    order by encounter_datetime desc limit 1
    ) latest_standard_visit on (latest_standard_visit.patient_id = p.person_id)
    LEFT JOIN (
    SELECT 
    e.patient_id,
    e.encounter_datetime AS 'latest_dc_enrolment_visit'
FROM
    amrs.encounter e
    join amrs.person p on (e.patient_id = p.person_id)
    join amrs.visit v on (e.visit_id = v.visit_id)
    join amrs.patient_program pp on (pp.patient_id = e.patient_id and pp.program_id = 9 and date_completed is null and pp.voided = 0)
    where e.encounter_type in (2)
    AND v.visit_type_id in (2)
    AND e.voided = 0
    AND pp.program_id is not null
    AND p.uuid = '${patientUuid}'
    order by encounter_datetime desc limit 1) latest_dc_enrolment_visit on (latest_dc_enrolment_visit.patient_id = p.person_id)
    LEFT JOIN (
    SELECT
	p.person_id,
    pp.date_enrolled as latest_new_dc_enrollment_date
FROM
	amrs.person p
		INNER JOIN
	amrs.patient_program pp ON (pp.patient_id = p.person_id
		AND pp.program_id = 9
		AND date_completed IS NULL
		AND pp.voided = 0)
	WHERE
		p.uuid = '${patientUuid}'
	ORDER BY program_id DESC
	LIMIT 1
    ) latest_new_dc_enrollment_date on (latest_new_dc_enrollment_date.person_id = p.person_id)
WHERE
    p.voided = 0 AND p.uuid = '${patientUuid}';`;

    const queryParts = {
      sql: sql
    };
    db.queryServer(queryParts, function (result) {
      result.sql = sql;
      resolve(result);
    });
  });
}

module.exports = def;
