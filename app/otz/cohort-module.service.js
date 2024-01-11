var db = require('../../etl-db');

export class CohortModuleService {
  getCohortSummary = (cohortUuids) => {
    const uuids = cohortUuids
      .split(',')
      .map((s) => {
        return `"${s}"`;
      })
      .join(',');
    return new Promise((resolve, reject) => {
      let queryParts = {};
      const sql = `SELECT 
        c.uuid,
        COUNT(DISTINCT cm.patient_id) AS total_patients,
        IFNULL(SUM(CASE
                    WHEN fl.hiv_viral_load < 200 THEN 1
                    ELSE 0
                END) / NULLIF(COUNT(DISTINCT cm.patient_id), 0) * 100,
                0) AS suppression_rate_percentage
    FROM
        amrs.cohort c
            LEFT JOIN
        amrs.location l ON l.location_id = c.location_id
            INNER JOIN
        amrs.cohort_member cm ON c.cohort_id = cm.cohort_id
            LEFT JOIN
        (SELECT 
            person_id, MAX(test_datetime) AS latest_test_datetime
        FROM
            etl.flat_labs_and_imaging
        WHERE
            hiv_viral_load IS NOT NULL
        GROUP BY person_id) AS latest_tests ON cm.patient_id = latest_tests.person_id
            LEFT JOIN
        etl.flat_labs_and_imaging fl ON latest_tests.person_id = fl.person_id
            AND latest_tests.latest_test_datetime = fl.test_datetime
    WHERE
        l.uuid = '${cohortUuids}'
    GROUP BY c.cohort_id;
    
    `;

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
