const Promise = require('bluebird');
const scopeBuilder = require('./scope-builder.service');
const dataResolver = require('./patient-data-resolver.service');
const expressionRunner = require('../expression-runner/expression-runner');

const def = {
  isVisitTypeAllowed: isVisitTypeAllowed,
  separateAllowedDisallowedVisitTypes: separateAllowedDisallowedVisitTypes,
  getPatientVisitTypes: getPatientVisitTypes
};

module.exports = def;

function isVisitTypeAllowed(scope, visitType) {
  if (!visitType.allowedIf) {
    return true;
  }
  return expressionRunner.run(visitType.allowedIf, scope);
}

function separateAllowedDisallowedVisitTypes(scope, visitTypes) {
  const separated = {
    allowed: [],
    disallowed: []
  };

  if (Array.isArray(visitTypes)) {
    visitTypes.forEach((item) => {
      if (isVisitTypeAllowed(scope, item)) {
        separated.allowed.push(item);
      } else {
        separated.disallowed.push(item);
      }
    });
  }
  return separated;
}

function getPatientVisitTypes(
  patientUuid,
  programUuid,
  programEnrollmentUuid,
  intendedVisitLocationUuid,
  allProgramsConfig
) {
  return new Promise((success, error) => {
    const program = allProgramsConfig[programUuid];
    if (!program) {
      error({ message: 'Program not found!' });
      return;
    }

    // resolve data dependencies
    dataResolver
      .getAllDataDependencies(program.dataDependencies || [], patientUuid, {
        programUuid: programUuid,
        programEnrollmentUuid: programEnrollmentUuid,
        intendedVisitLocationUuid: intendedVisitLocationUuid
      })
      .then((dataObject) => {
        // add missing properties
        dataObject.programUuid = programUuid;
        dataObject.intendedVisitLocationUuid = intendedVisitLocationUuid;

        // build scope
        const scopeObj = scopeBuilder.buildScope(dataObject);
        const visits = program.visitTypes;

        program.visitTypes = separateAllowedDisallowedVisitTypes(
          scopeObj,
          visits
        );

        success(program);
      })
      .catch((dataErr) => {
        console.error(dataErr);
        error({
          message: 'Error resolving data dependencies'
        });
      });
  });
}
