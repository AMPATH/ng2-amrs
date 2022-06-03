const Promise = require('bluebird');
const scopeBuilder = require('./scope-builder.service');
const dataResolver = require('./patient-data-resolver.service');
const expressionRunner = require('../expression-runner/expression-runner');
const encounterType = require('../dao/encounter-type/encounter-type-dao');

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

function isEncounterTypeAllowed(scope, encounterType) {
  if (!encounterType.allowedIf) {
    return true;
  }
  return expressionRunner.run(encounterType.allowedIf, scope);
}

function separateAllowedDisallowedEncounterTypes(scope, encounterTypes) {
  const separated = {
    allowedEncounters: [],
    disallowedEncounters: []
  };

  if (Array.isArray(encounterTypes)) {
    encounterTypes.forEach((encounter) => {
      if (isEncounterTypeAllowed(scope, encounter)) {
        separated.allowedEncounters.push(encounter);
      } else {
        separated.disallowedEncounters.push(encounter);
      }
    });
  }
  return separated;
}

function separateAllowedDisallowedVisitTypes(scope, visitTypes) {
  const separated = {
    allowed: [],
    disallowed: []
  };

  if (Array.isArray(visitTypes)) {
    visitTypes.forEach((visit) => {
      visit.encounterTypes = separateAllowedDisallowedEncounterTypes(
        scope,
        visit.encounterTypes
      );
      if (isVisitTypeAllowed(scope, visit)) {
        separated.allowed.push(visit);
      } else {
        separated.disallowed.push(visit);
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
  allProgramsConfig,
  retroSpective,
  visitDate
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
        dataObject.retroSpective = retroSpective;
        dataObject.visitDate = visitDate;
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
