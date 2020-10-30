const _ = require('lodash');
export class patientMedicationHistService {
  processMedicationHistory(data) {
    var revisedResults = [];
    _.each(data.result, function (result) {
      try {
        if (result && result.current_regimen === result.previous_regimen) {
          // do not include medication data when current and previous regimen are same
        } else {
          revisedResults.push(result);
        }
      } catch (error) {
        console.log(error);
      }
    });
    data.result = revisedResults;
    return data;
  }
}
