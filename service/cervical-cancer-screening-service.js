const db = require('../etl-db');

const defs = {
  getPatientLatestCericalScreeningResult,
  getPatientCervicalCancerScreeningSummary
};

function getPatientLatestCericalScreeningResult(personId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
         person_id, 
         test_datetime, 
         via_or_via_vili, 
         TIMESTAMPDIFF(YEAR,test_datetime,now()) AS 'years_since_last_via_or_via_vili_test',
         CASE
           WHEN TIMESTAMPDIFF(YEAR,test_datetime,now()) >= 1 THEN 1
           ELSE NULL
         END AS 'qualifies_for_via_or_via_vili_retest'
         FROM 
         etl.flat_labs_and_imaging 
         WHERE 
         via_or_via_vili IS NOT NULL AND person_id = ${personId} 
         ORDER BY test_datetime DESC LIMIT 1;`;

    const queryParts = {
      sql: sql
    };
    db.queryServer(queryParts, function (result) {
      result.sql = sql;
      resolve(result);
    });
  });
}

function getPatientCervicalCancerScreeningSummary(patientUuId) {
  return new Promise((resolve, reject) => {
    if (patientUuId === '' || patientUuId === null) {
      reject('Patient Uuid is missing');
    } else {
      const sql = `SELECT 
    person_id,
    DATE_FORMAT(test_datetime,'%d-%m-%Y') as 'test_date',
    via_or_via_vili,
    pap_smear,
    hpv,
    uuid,
    case
      WHEN via_or_via_vili is NOT NULL THEN 'VIA or VIA/VILI'
      WHEN pap_smear is NOT NULL THEN 'PAP SMEAR'
      WHEN hpv is NOT NULL THEN 'HPV'
      ELSE NULL
    end as 'test',
     case
      WHEN via_or_via_vili = 7469 THEN 'ACETOWHITE LESION'
      WHEN via_or_via_vili = 1115 THEN 'NORMAL'
      WHEN via_or_via_vili = 6497 THEN 'DYSFUNCTIONAL UTERINE BLEEDING'
      WHEN via_or_via_vili = 703 THEN 'POSITIVE'
      WHEN via_or_via_vili = 7470 THEN 'PUNCTUATED CAPILLARIES'
      WHEN via_or_via_vili = 664 THEN 'NEGATIVE'
      WHEN via_or_via_vili = 7472 THEN 'ATYPICAL BLOOD VESSELS'
      WHEN via_or_via_vili = 7293 THEN 'ULCER'
      WHEN via_or_via_vili = 9593 THEN 'FRIABLE TISSUE'
      WHEN via_or_via_vili = 6971 THEN 'POSSIBLE'
      ELSE NULL
    end as 'via_test_result'
FROM
    etl.flat_labs_and_imaging
WHERE
    (via_or_via_vili IS NOT NULL OR pap_smear IS NOT NULL OR hpv IS NOT NULL)
        AND uuid = '${patientUuId}'
ORDER BY test_datetime DESC
LIMIT 10;`;

      const queryParts = {
        sql: sql
      };
      db.queryServer(queryParts, function (result) {
        resolve(result);
      });
    }
  });
}

module.exports = defs;
