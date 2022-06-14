const db = require('../../etl-db');

const getPatientVaccinationSummary = (patientUuid) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT 
    CASE
        WHEN c.vaccination_status = 2208 THEN 'Fully Vaccinated'
        WHEN c.vaccination_status = 11907 THEN 'Partially Vaccinated'
        WHEN
            c.first_dose_vaccine_administered IS NULL
                AND c.second_dose_vaccine_administered IS NULL
                AND EXTRACT(YEAR FROM (FROM_DAYS(DATEDIFF(NOW(), p.birthdate)))) >= 15
        THEN
            'Eligible for Covid 19 Vaccination'
        WHEN
            c.received_covid_19_vaccine = 1066
                AND EXTRACT(YEAR FROM (FROM_DAYS(DATEDIFF(NOW(), p.birthdate)))) >= 15
        THEN
            'Eligible for Covid 19 Vaccination'
        WHEN
            c.person_id IS NULL
                AND EXTRACT(YEAR FROM (FROM_DAYS(DATEDIFF(NOW(), p.birthdate)))) >= 15
        THEN
            'Eligible for Covid 19 Vaccination'
        ELSE NULL
    END AS 'vaccination_status',
    CASE
        WHEN c.vaccination_status = 2208 THEN '2'
        WHEN c.vaccination_status = 11907 THEN '1'
        WHEN
            c.first_dose_vaccine_administered IS NULL
                AND c.second_dose_vaccine_administered IS NULL
                AND EXTRACT(YEAR FROM (FROM_DAYS(DATEDIFF(NOW(), p.birthdate)))) >= 15
        THEN
            '0'
        WHEN
            c.received_covid_19_vaccine = 1066
                AND EXTRACT(YEAR FROM (FROM_DAYS(DATEDIFF(NOW(), p.birthdate)))) >= 15
        THEN
            '0'
        WHEN
            c.person_id IS NULL
                AND EXTRACT(YEAR FROM (FROM_DAYS(DATEDIFF(NOW(), p.birthdate)))) >= 15
        THEN
            '0'
        ELSE NULL
    END AS 'vaccination_status_code',
    CASE
        WHEN
            c.first_dose_vaccine_administered IS NULL
                AND c.second_dose_vaccine_administered IS NOT NULL
                AND c.second_dose_vaccine_administered IN (11900 , 11902, 11903, 11904, 11905)
        THEN
            'MISSING 1ST DOSE DATA'
        WHEN
            c.vaccination_status = 2208
                AND c.first_dose_vaccine_administered IN (11900 , 11902, 11903, 11904, 11905)
                AND c.second_dose_vaccine_administered IS NULL
        THEN
            'MISSING 2ND DOSE DATA'
        WHEN
            c.vaccination_status = 2208
                AND c.second_dose_vaccine_administered IN (11900 , 11902, 11903, 11904, 11905)
                AND c.first_dose_vaccine_administered IS NULL
        THEN
            'MISSING 1ST DOSE DATA'
        WHEN
            c.vaccination_status = 11907
                AND (c.first_dose_vaccine_administered = 11901
                OR c.second_dose_vaccine_administered = 11901)
        THEN
            'PATIENT MARKED AS PARTIALLY VACCINATED BUT HAS JOHNSON AND JOHNSON'
        ELSE ''
    END AS 'vaccination_status_code_message',
    DATE_FORMAT(p.birthdate, '%Y-%m-%d') AS 'dob',
    EXTRACT(YEAR FROM (FROM_DAYS(DATEDIFF(NOW(), p.birthdate)))) AS age,
    DATE_FORMAT(date_given_first_dose, '%Y-%m-%d') AS date_given_first_dose,
    CASE
        WHEN c.first_dose_vaccine_administered = 11900 THEN 'ASTRAZENECA'
        WHEN c.first_dose_vaccine_administered = 11901 THEN 'JOHNSON AND JOHNSON'
        WHEN c.first_dose_vaccine_administered = 11902 THEN 'MODERNA'
        WHEN c.first_dose_vaccine_administered = 11903 THEN 'PFIZER'
        WHEN c.first_dose_vaccine_administered = 11904 THEN 'SPUTNIK'
        WHEN c.first_dose_vaccine_administered = 11905 THEN 'SINOPHARM'
        WHEN c.first_dose_vaccine_administered = 1067 THEN 'UNKNOWN'
        ELSE NULL
    END AS first_dose_vaccine_administered,
    DATE_FORMAT(c.date_given_second_dose, '%Y-%m-%d') AS date_given_second_dose,
    CASE
        WHEN c.second_dose_vaccine_administered = 11900 THEN 'ASTRAZENECA'
        WHEN c.second_dose_vaccine_administered = 11901 THEN 'JOHNSON AND JOHNSON'
        WHEN c.second_dose_vaccine_administered = 11902 THEN 'MODERNA'
        WHEN c.second_dose_vaccine_administered = 11903 THEN 'PFIZER'
        WHEN c.second_dose_vaccine_administered = 11904 THEN 'SPUTNIK'
        WHEN c.second_dose_vaccine_administered = 11905 THEN 'SINOPHARM'
        WHEN c.second_dose_vaccine_administered = 1067 THEN 'UNKNOWN'
        ELSE NULL
    END AS second_dose_vaccine_administered
FROM
    etl.flat_hiv_summary_v15b fhs
        LEFT JOIN
    etl.flat_covid_extract c ON (fhs.person_id = c.person_id
        AND c.next_encounter_datetime IS NULL)
        JOIN
    amrs.person p ON (p.person_id = fhs.person_id
        AND p.voided = 0)
WHERE
    fhs.uuid = '${patientUuid}'
        AND fhs.next_clinical_datetime_hiv IS NULL;`;

    console.log('sql', sql);

    const queryParts = {
      sql: sql
    };
    db.queryServer(queryParts, function (result) {
      result.sql = sql;
      resolve(result);
    });
  });
};

export const getPatientCovidVaccinationStatus = (patientUuid) => {
  return new Promise((resolve, reject) => {
    getPatientVaccinationSummary(patientUuid)
      .then((results) => {
        const vaccinationStatusData = {
          result: {}
        };
        if (results.size) {
          vaccinationStatusData.result = results.result[0] || [];
        }
        resolve(vaccinationStatusData);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
