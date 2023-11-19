var db = require('../../etl-db');
var obs_service = require('../../service/openmrs-rest/obs.service');

export class CohortModuleService {
  getCohortOtzModules = (cohortUuid) => {
    return new Promise((resolve, reject) => {
      let queryParts = {};
      const sql = `SELECT 
    b.patient_id,
    b.uuid,
    MAX(b.mod1) AS mod1,
    MAX(b.mod2) AS mod2,
    MAX(b.mod3) AS mod3,
    MAX(b.mod4) AS mod4,
    MAX(b.mod5) AS mod5,
    MAX(b.mod6) AS mod6,
    MAX(b.mod7) AS mod7,
    MAX(b.mod8) AS mod8
FROM
    (SELECT 
        c.cohort_id,
            c.name AS cohort_name,
            cm.patient_id,
            en.encounter_id,
            en.encounter_datetime,
            ob.value_coded,
            ob.value_text,
            ob.concept_id,
            p.uuid,
            CASE
                WHEN
                    ob.concept_id = 11032
                        AND ob.value_coded = 1065
                THEN
                    TRUE
                WHEN
                    ob.concept_id = 11032
                        AND ob.value_coded = 1066
                THEN
                    FALSE
                ELSE FALSE
            END AS 'mod1',
            CASE
                WHEN
                    ob.concept_id = 11033
                        AND ob.value_coded = 1065
                THEN
                    TRUE
                WHEN
                    ob.concept_id = 11033
                        AND ob.value_coded = 1066
                THEN
                    FALSE
                ELSE FALSE
            END AS 'mod2',
            CASE
                WHEN
                    ob.concept_id = 11034
                        AND ob.value_coded = 1065
                THEN
                    TRUE
                WHEN
                    ob.concept_id = 11034
                        AND ob.value_coded = 1066
                THEN
                    FALSE
                ELSE FALSE
            END AS 'mod3',
            CASE
                WHEN
                    ob.concept_id = 11035
                        AND ob.value_coded = 1065
                THEN
                    TRUE
                WHEN
                    ob.concept_id = 11035
                        AND ob.value_coded = 1066
                THEN
                    FALSE
                ELSE FALSE
            END AS 'mod4',
            CASE
                WHEN
                    ob.concept_id = 9302
                        AND ob.value_coded = 1065
                THEN
                    TRUE
                WHEN
                    ob.concept_id = 9302
                        AND ob.value_coded = 1066
                THEN
                    FALSE
                ELSE FALSE
            END AS 'mod5',
            CASE
                WHEN
                    ob.concept_id = 11037
                        AND ob.value_coded = 1065
                THEN
                    TRUE
                WHEN
                    ob.concept_id = 11037
                        AND ob.value_coded = 1066
                THEN
                    FALSE
                ELSE FALSE
            END AS 'mod6',
            CASE
                WHEN
                    ob.concept_id = 11038
                        AND ob.value_coded = 1065
                THEN
                    TRUE
                WHEN
                    ob.concept_id = 11038
                        AND ob.value_coded = 1066
                THEN
                    FALSE
                ELSE FALSE
            END AS 'mod7',
            CASE
                WHEN
                    ob.concept_id = 11039
                        AND ob.value_coded = 1065
                THEN
                    TRUE
                WHEN
                    ob.concept_id = 11039
                        AND ob.value_coded = 1066
                THEN
                    FALSE
                ELSE FALSE
            END AS 'mod8'
    FROM
        amrs.cohort c
    INNER JOIN amrs.cohort_member cm ON c.cohort_id = cm.cohort_id
    INNER JOIN amrs.encounter en ON (en.patient_id = cm.patient_id
        AND en.encounter_type = 284)
    INNER JOIN amrs.obs ob ON ob.encounter_id = en.encounter_id
    INNER JOIN amrs.person p ON p.person_id = cm.patient_id
    WHERE
        c.uuid = '${cohortUuid}'
            AND en.voided = 0
            AND ob.concept_id IN (11032 , 11033, 11034, 11035, 11036, 11037, 11038, 11039)) b
GROUP BY b.patient_id;`;

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
