const _ = require('lodash');

const def = {
  buildScope: buildScope
};

module.exports = def;

function buildScope(dataDictionary) {
  const scope = {
    hasPreviousInitialVisit: false
  };
  
  if (dataDictionary.patient) {
    buildPatientScopeMembers(scope, dataDictionary.patient);
  }

  if (dataDictionary.enrollment) {
    buildProgramScopeMembers(scope, dataDictionary.enrollment);
  }

  if (dataDictionary.patientEnrollment) {
    const activeEnrollments = _.filter(dataDictionary.patientEnrollment, { dateCompleted: null});
    let isEnrolledInPMTCT = false;
    let isEnrolledInViremia = false;
    
    activeEnrollments.forEach((item) => {
      if (item.program.uuid === 'c4246ff0-b081-460c-bcc5-b0678012659e') {
        isEnrolledInViremia = true;
      }
      
      if (item.program.uuid === '781d897a-1359-11df-a1f1-0026b9348838') {
        isEnrolledInPMTCT = true;
      }
    });

    if (isEnrolledInPMTCT && isEnrolledInViremia) {
      scope.isEnrolledInViremiaPMTCT = true;
    } else {
      scope.isEnrolledInViremiaPMTCT = false;
    }
  }

  if (dataDictionary.hivLastTenClinicalEncounters) {
    buildHivScopeMembers(scope, dataDictionary.hivLastTenClinicalEncounters,
    dataDictionary.intendedVisitLocationUuid);
  }

  if (dataDictionary.hivLastEncounter) {
    if (dataDictionary.hivLastEncounter.months_from_last_visit >= 5) {
      scope.qualifiesForStandardVisit = true;
    } else {
      scope.qualifiesForStandardVisit = false;
    }
  }

  if (dataDictionary.intendedVisitLocationUuid) {
    scope.intendedVisitLocationUuid = dataDictionary.intendedVisitLocationUuid;
  }

  if (dataDictionary.hasPreviousInitialVisit) {
    scope.hasPreviousInitialVisit = dataDictionary.hasPreviousInitialVisit;
  }
 
  if (dataDictionary.patientEncounters) {
    scope.patientEncounters = dataDictionary.patientEncounters;
    buildHivScopeMembers(scope, dataDictionary.patientEncounters);
  }

  // add other methods to build the scope objects
  return scope;
}

function buildPatientScopeMembers(scope, patient) {
  scope.age = patient.person.age;
  scope.gender = patient.person.gender;
}

function isIntraTransfer(lastTenHivSummary, intendedVisitLocationUuid) {
  if (intendedVisitLocationUuid && Array.isArray(lastTenHivSummary) && lastTenHivSummary.length > 0) {
    return intendedVisitLocationUuid !== lastTenHivSummary[0].location_uuid;
  } else {
    return false;
  }
}

function isInitialPrepVisit(patientEncounters) {
  const initialPrEPEncounterUuid = '00ee2fd6-9c95-4ffc-ab31-6b1ce2dede4d';
  let previousPrEPEncounters = [];

  previousPrEPEncounters = _.filter(patientEncounters, (encounter) => {
    return encounter.encounterType.uuid === initialPrEPEncounterUuid;
  });

  return previousPrEPEncounters.length === 0;
}

function buildProgramScopeMembers(scope, programEnrollment) {
  if (programEnrollment && programEnrollment.location &&
    programEnrollment.location.uuid) {
    scope.programLocation = programEnrollment.location.uuid;
  }
  
  if (programEnrollment && programEnrollment.states) {
    const states = programEnrollment.states;
    const currentState = states.filter(state => state.endDate === null);
    
    if (currentState.length > 0) {
      const state = currentState[0].state;
      scope.inCareUuid = state.concept.uuid;
    }
  }
}

function buildHivScopeMembers(scope, lastTenHivSummary, intendedVisitLocationUuid) {
  if (Array.isArray(lastTenHivSummary) && lastTenHivSummary.length > 0) {
    scope.isFirstAMPATHHIVVisit = false;
    scope.previousHIVClinicallocation = lastTenHivSummary[0].location_uuid;
  } else {
    // its first AMPATH visit if its not an intra transfer
    scope.isFirstAMPATHHIVVisit = !isIntraTransfer(lastTenHivSummary, intendedVisitLocationUuid);
    scope.previousHIVClinicallocation = null;
  }
  // It's a first PrEP visit if the patient has no previous PrEP encounters
  scope.isFirstPrEPVisit = isInitialPrepVisit(scope.patientEncounters);
}
