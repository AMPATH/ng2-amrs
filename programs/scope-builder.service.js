const _ = require('lodash');
const Moment = require('moment');

const def = {
  buildScope: buildScope
};

module.exports = def;

function buildScope(dataDictionary) {
  const scope = {};

  if (dataDictionary.patient) {
    buildPatientScopeMembers(scope, dataDictionary.patient);
  }

  if (dataDictionary.enrollment) {
    buildProgramScopeMembers(scope, dataDictionary.enrollment);
  }

  if (dataDictionary.patientEnrollment) {
    const activeEnrollments = _.filter(dataDictionary.patientEnrollment, {
      dateCompleted: null
    });
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
    buildHivScopeMembers(
      scope,
      dataDictionary.hivLastTenClinicalEncounters,
      dataDictionary.intendedVisitLocationUuid
    );
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

  if (dataDictionary.patientEncounters) {
    scope.patientEncounters = dataDictionary.patientEncounters;
    scope.programUuid = dataDictionary.programUuid;
    buildHivScopeMembers(scope, dataDictionary.patientEncounters);
    buildOncologyScopeMembers(
      scope,
      dataDictionary.patientEncounters,
      dataDictionary.programUuid
    );
  }

  // add other methods to build the scope objects
  return scope;
}

function buildPatientScopeMembers(scope, patient) {
  scope.age = patient.person.age;
  scope.gender = patient.person.gender;
}

function isIntraTransfer(lastTenHivSummary, intendedVisitLocationUuid) {
  if (
    intendedVisitLocationUuid &&
    Array.isArray(lastTenHivSummary) &&
    lastTenHivSummary.length > 0
  ) {
    return intendedVisitLocationUuid !== lastTenHivSummary[0].location_uuid;
  } else {
    return false;
  }
}

function isInitialPrepVisit(patientEncounters) {
  const initialPrEPEncounterUuid = '00ee2fd6-9c95-4ffc-ab31-6b1ce2dede4d';

  let initialPrEPEncounters = _.filter(patientEncounters, (encounter) => {
    return encounter.encounterType.uuid === initialPrEPEncounterUuid;
  });

  return initialPrEPEncounters.length === 0;
}

function isInitialPepVisit(patientEncounters) {
  const initialPEPEncounterUuid = 'c3a78744-f94a-4a25-ac9d-1c48df887895';
  let isInitialPEPVisit = true;

  // get initial pep encounters

  let initialPEPEncounters = _.filter(patientEncounters, (encounter) => {
    return encounter.encounterType.uuid === initialPEPEncounterUuid;
  });

  let orderedPEPEncounters = [];
  let duration = 0;

  if (initialPEPEncounters.length > 0) {
    // order pep initial from the latest pep encounter
    orderedPEPEncounters = initialPEPEncounters.sort((a, b) => {
      var dateA = new Date(a.encounterDatetime);
      var dateB = new Date(b.encounterDatetime);
      return dateB - dateA;
    });
    const today = Moment(new Date());

    let latestPEPEncounter = orderedPEPEncounters[0];

    let latestPEPEncounterDate = Moment(
      latestPEPEncounter.encounterDatetime
    ).format();
    duration = today.diff(latestPEPEncounterDate, 'days');
    // if its more than 60 days since their last PEP Initial then they should see a pep initial visit
    if (duration > 120) {
      isInitialPEPVisit = true;
    } else {
      isInitialPEPVisit = false;
    }
  }

  return isInitialPEPVisit;
}

function isInitialPMTCTVisit(patientEncounters) {
  const initialPMTCTEncounterUuids = [
    '8d5b27bc-c2cc-11de-8d13-0010c6dffd0f', // Adult Initial
    '8d5b2dde-c2cc-11de-8d13-0010c6dffd0f', // Peds Initial
    'fc8c1694-90fc-46a8-962b-73ce9a99a78f' // Youth Initial
  ];

  let initialPMTCTEncounters = _.filter(patientEncounters, (encounter) => {
    return initialPMTCTEncounterUuids.includes(encounter.encounterType.uuid);
  });

  return initialPMTCTEncounters.length === 0;
}

function isInitialOncologyVisit(encounters, programUuid) {
  const oncologyProgramEncounterTypeMap = [
    {
      programUuid: 'e8bc5036-1462-44fa-bcfe-ced21eae2790', // Lung Cancer Treatment Program
      initialEncounterUuid: 'be7b0971-b2ab-4f4d-88c7-e7322aa58dbb' // Lung Cancer Initial
    },
    {
      programUuid: '725b5193-3452-43fc-aca3-6a80432d9bfa', // General Oncology Program
      initialEncounterUuid: 'd17b3adc-0837-4ac6-862b-0953fc664cb8' // General Oncology Initial
    },
    {
      programUuid: '88566621-828f-4569-9af5-c54f8237750a', // Breast Cancer Treatment Program
      initialEncounterUuid: '9ad5292c-14c3-489b-9c14-5f816e839691' // Breast Cancer Initial
    },
    {
      programUuid: 'e48b266e-4d80-41f8-a56a-a8ce5449ebc6', // Sickle Cell Program
      initialEncounterUuid: 'ba5a15eb-576f-496b-a58d-e30b802a5da5' // Sickle Cell Initial
    },
    {
      programUuid: 'a3610ba4-9811-46b3-9628-83ec9310be13', // Hemophilia Program
      initialEncounterUuid: '3945005a-c24f-478b-90ec-4af84ffcdf6b' // Hemophilia Initial
    },
    {
      programUuid: '698b7153-bff3-4931-9638-d279ca47b32e', // Multiple Myeloma Program
      initialEncounterUuid: 'bf762b3e-b60a-436a-a40b-f874c59869ec' // Multiple Myeloma Initial
    },
    {
      programUuid: '418fe011-a903-4862-93d4-5e7c84d9c253', // Anticoagulation Program
      initialEncounterUuid: '4a7450b1-f720-4a0c-b13b-d8a6a83348ee' // Anticoagulation Initial
    }
  ];

  let initialOncologyEncounters = [];
  let initialEncounterType = oncologyProgramEncounterTypeMap.find(
    (e) => e.programUuid === programUuid
  );

  if (initialEncounterType) {
    initialOncologyEncounters = _.filter(encounters, (encounter) => {
      return (
        initialEncounterType.initialEncounterUuid ===
        encounter.encounterType.uuid
      );
    });
  }
  return initialOncologyEncounters.length === 0;
}

function buildProgramScopeMembers(scope, programEnrollment) {
  if (
    programEnrollment &&
    programEnrollment.location &&
    programEnrollment.location.uuid
  ) {
    scope.programLocation = programEnrollment.location.uuid;
  }

  if (programEnrollment && programEnrollment.states) {
    const states = programEnrollment.states;
    const currentState = states.filter((state) => state.endDate === null);

    if (currentState.length > 0) {
      const state = currentState[0].state;
      scope.inCareUuid = state.concept.uuid;
    }
  }
}

function buildHivScopeMembers(
  scope,
  lastTenHivSummary,
  intendedVisitLocationUuid
) {
  if (Array.isArray(lastTenHivSummary) && lastTenHivSummary.length > 0) {
    scope.isFirstAMPATHHIVVisit = false;
    scope.previousHIVClinicallocation = lastTenHivSummary[0].location_uuid;
  } else {
    // its first AMPATH visit if its not an intra transfer
    scope.isFirstAMPATHHIVVisit = !isIntraTransfer(
      lastTenHivSummary,
      intendedVisitLocationUuid
    );
    scope.previousHIVClinicallocation = null;
  }

  scope.isFirstPrEPVisit = isInitialPrepVisit(scope.patientEncounters);
  scope.isFirstPEPVisit = isInitialPepVisit(scope.patientEncounters);
  scope.isFirstPMTCTVisit = isInitialPMTCTVisit(scope.patientEncounters);
}

function buildOncologyScopeMembers(scope, patientEncounters, programUuid) {
  scope.isFirstOncologyVisit = isInitialOncologyVisit(
    scope.patientEncounters,
    programUuid
  );
}
