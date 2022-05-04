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
    CASE
       WHEN latest_standard_visit.latest_standard_visit > latest_medication_visit.latest_medication_visit THEN 1
       WHEN latest_standard_visit.latest_standard_visit is not null AND latest_medication_visit.latest_medication_visit is NULL THEN 1
       WHEN latest_standard_visit.latest_standard_visit is null AND latest_medication_visit.latest_medication_visit is NULL THEN 1
       ELSE 0
    END AS 'qualifies_for_medication_refill',
    CASE
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
