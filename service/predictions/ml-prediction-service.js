const db = require('../../etl-db');

/**
 * Gets the predicted score for a patient from the database.
 *
 * @param {string} patientUuid - The UUID of the patient
 * @returns {Promise<Object>} A promise that resolves with the result
 */
const getPredictedScore = async (patientUuid) => {
  return new Promise((resolve, reject) => {
    const sql = `select ml.* from predictions.ml_weekly_predictions ml 
        left join amrs.person p on (ml.person_id = p.person_id)
        where p.uuid = '${patientUuid}' 
        and p.voided = 0 
        order by ml.prediction_generated_date desc limit 1;`;

    const queryParts = {
      sql: sql
    };

    db.queryServer(queryParts, (result) => {
      result.sql = sql;
      resolve(result);
    });
  });
};

/**
 * Gets the predicted score data for a patient.
 *
 * @param {string} patientUuid - The UUID of the patient
 * @returns {Promise<Object>} A promise that resolves with the predicted data
 */
export const getPatientPredictedScore = async (patientUuid) => {
  const results = await getPredictedScore(patientUuid);

  const predictedData = {
    result: {},
    query: {}
  };

  if (results && results.result.length) {
    predictedData.result = results.result[0];
    predictedData.query = results.sql;
  }

  return predictedData;
};
