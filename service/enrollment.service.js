var Promise = require('bluebird');
const _ = require('lodash');
import { BaseMysqlReport } from '../app/reporting-framework/base-mysql.report';
import { PatientlistMysqlReport } from '../app/reporting-framework/patientlist-mysql.report';

var def = {
  getActiveProgramEnrollmentSummary: getActiveProgramEnrollmentSummary,
  getActiveProgramEnrollmentsPatientList: getActiveProgramEnrollmentsPatientList
};

module.exports = def;

function getActiveProgramEnrollmentSummary(requestParams) {
  let params = {
    endDate: ''
  };

  if (requestParams.programTypeIds.length > 0) {
    params['programTypeIds'] = requestParams.programTypeIds;
  }
  if (requestParams.locations.length > 0) {
    params['locations'] = requestParams.locations;
  }
  if (requestParams.endDate) {
    params['endDate'] = requestParams.endDate;
  }

  return new Promise(function (resolve, reject) {
    let report = new BaseMysqlReport(
      'currentlyEnrolledPatientsAggregate',
      params
    );

    Promise.join(report.generateReport(), (results) => {
      let result = results.results.results;
      results.size = result ? result.length : 0;
      results.result = result;
      delete results['results'];
      resolve(results);
    }).catch((errors) => {
      console.error('ERROR: ', errors);
      reject(errors);
    });
  });
}

function getActiveProgramEnrollmentsPatientList(requestParams) {
  let params = {
    endDate: ''
  };

  if (requestParams.programTypeIds.length > 0) {
    params['programTypeIds'] = requestParams.programTypeIds;
  }
  if (requestParams.locations.length > 0) {
    params['locations'] = requestParams.locations;
  }
  if (requestParams.endDate) {
    params['endDate'] = requestParams.endDate;
  }

  let indicators = [];
  let report = new PatientlistMysqlReport(
    'currentlyEnrolledPatientsAggregate',
    params
  );

  return new Promise(function (resolve, reject) {
    //TODO: Do some pre processing
    Promise.join(report.generatePatientListReport(indicators), (results) => {
      results.size = results ? results.results.results.length : 0;
      results.result = results ? results.results.results : [];
      delete results['results'];
      resolve(results);
    }).catch((errors) => {
      console.error('ERROR: ', errors);
      reject(errors);
    });
  });
}
