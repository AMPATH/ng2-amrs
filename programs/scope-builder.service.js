var def = {
    buildScope: buildScope
};

module.exports = def;

function buildScope(dataDictionary) {
    var scope = {};
    if (dataDictionary.patient) {
        buildPatientScopeMembers(scope, dataDictionary.patient);
    }

    if (dataDictionary.enrollment) {
        buildProgramScopeMembers(scope, dataDictionary.enrollment);
    }

    if (dataDictionary.hivLastTenClinicalEncounters) {
        buildHivScopeMembers(scope, dataDictionary.hivLastTenClinicalEncounters);
    }

    if (dataDictionary.intendedVisitLocationUuid) {
        scope.intendedVisitLocationUuid = dataDictionary.intendedVisitLocationUuid;
    }

    // add other methods to build the scope objects
    return scope;
}

function buildPatientScopeMembers(scope, patient) {
    scope.age = patient.person.age;
    scope.gender = patient.person.gender;
}

function buildProgramScopeMembers(scope, programEnrollment) {
    if (programEnrollment && programEnrollment.location &&
        programEnrollment.location.uuid) {
        scope.programLocation = programEnrollment.location.uuid;
    }
    
    if(programEnrollment && programEnrollment.states) {
      var states = programEnrollment.states;
      var currentState = states.filter(function(state){
        return state.endDate === null;
      });
      if(currentState.length > 0) {
        var state = currentState[0].state;
        scope.inCareUuid = state.concept.uuid;
      }
    }
}

function buildHivScopeMembers(scope, lastTenHivSummary) {
    if (Array.isArray(lastTenHivSummary) && lastTenHivSummary.length > 0) {
        scope.isFirstAMPATHHIVVisit = false;
        scope.previousHIVClinicallocation = lastTenHivSummary[0].location_uuid;
    } else {
        scope.isFirstAMPATHHIVVisit = true;
    }
}