const _ = require('lodash');
const Moment = require('moment');

const def = {
  buildScope: buildScope
};

module.exports = def;

function buildScope(dataDictionary) {
  const scope = {
    isPatientTransferredOut: false,
    isFirstAMPATHHIVVisit: true,
    qualifiesForStandardVisit: false,
    qualifiesMedicationRefillVisit: false,
    lastCovidScreeningDate: '',
    retroSpective: false,
    screenedForCovidToday: false
  };

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

  if (dataDictionary.dcQualifedVisits) {
    if (dataDictionary.dcQualifedVisits.qualifies_for_standard_visit === 1) {
      scope.qualifiesForStandardVisit = true;
    }
    if (dataDictionary.dcQualifedVisits.qualifies_for_medication_refill === 1) {
      scope.qualifiesMedicationRefillVisit = true;
    }
  }

  if (dataDictionary.intendedVisitLocationUuid) {
    scope.intendedVisitLocationUuid = dataDictionary.intendedVisitLocationUuid;
  }

  if (dataDictionary.patientEncounters) {
    scope.patientEncounters = dataDictionary.patientEncounters;
    scope.programUuid = dataDictionary.programUuid;
    buildHivScopeMembers(
      scope,
      dataDictionary.patientEncounters,
      dataDictionary?.intendedVisitLocationUuid
    );
    buildOncologyScopeMembers(
      scope,
      dataDictionary.patientEncounters,
      dataDictionary.programUuid
    );
  }

  if (dataDictionary.retroSpective) {
    scope.retroSpective = dataDictionary.retroSpective;
  }

  if (dataDictionary.isPatientTransferredOut) {
    scope['isPatientTransferredOut'] = dataDictionary.isPatientTransferredOut;
  }

  if (dataDictionary.latestCovidAssessment) {
    scope['lastCovidScreeningDate'] = dataDictionary.latestCovidAssessment;
    const screeningDate = Moment(dataDictionary.latestCovidAssessment).format(
      'YYYY-MM-DD'
    );
    const visitDate = Moment(dataDictionary.visitDate).format('YYYY-MM-DD');

    if (screeningDate >= visitDate) {
      scope.screenedForCovidToday = true;
    }

    if (dataDictionary.retroSpective === 'true') {
      scope.screenedForCovidToday = true;
    }
  }

  // add other methods to build the scope objects
  return scope;
}

function buildPatientScopeMembers(scope, patient) {
  scope.age = patient.person.age;
  scope.gender = patient.person.gender;
}

function getPreviousHIVClinicallocation(patientEncounters) {
  const hivClinicalEncounterTypeUuids = [
    '8d5b27bc-c2cc-11de-8d13-0010c6dffd0f', // adult initial
    '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f', // Adult Return
    '8d5b2dde-c2cc-11de-8d13-0010c6dffd0f', // Peds Initial
    '8d5b3108-c2cc-11de-8d13-0010c6dffd0f', //peds return
    'df553c4a-1350-11df-a1f1-0026b9348838', // PMTCTANC
    'df55406e-1350-11df-a1f1-0026b9348838', // ADULTNONCLINICALMEDICATION
    'df55417c-1350-11df-a1f1-0026b9348838', // PEDSNONCLINICALMEDICATION
    'df554398-1350-11df-a1f1-0026b9348838', // ECSTABLE
    'df5545aa-1350-11df-a1f1-0026b9348838', // ECHIGHRISK
    'df555306-1350-11df-a1f1-0026b9348838', // ECPeds
    'df555950-1350-11df-a1f1-0026b9348838', // ANCINITIAL
    'df555a5e-1350-11df-a1f1-0026b9348838', // ANCRETURN
    'df555b62-1350-11df-a1f1-0026b9348838', // POSTNATAL
    'b1e9ed0f-5222-4d47-98f7-5678b8a21ebd', // PMTCTPOSTNATAL
    'fc8c1694-90fc-46a8-962b-73ce9a99a78f', // YOUTHINITIAL
    '4e7553b4-373d-452f-bc89-3f4ad9a01ce7', // YOUTHRETURN
    '56b6a3cf-4552-45f9-a80b-bd8ab61a232f', // GENERALNOTE
    '485ba2f3-8529-4255-804e-278c3a14f6ef', // CLINICREVIEW
    '8e942fd1-135d-42bd-9701-04560f180ec5', // MOH257BLUECARD
    '425ee5d1-bf39-4e09-b372-fc86abfea0c1', // RESISTANCECLINIC
    '386eedd9-e835-48e5-9da9-59b2641ea742', // NONCLINICALMEDICATION
    'e3202a01-8cd5-4224-b0dd-760557f85310', // DIFFERENTIATEDCARE
    'fb8aa28d-ca10-4f9a-a913-3233afb4c22a', // HIVCOMMUNITYBASEDRESEARCH
    '3c8cd5d4-cdc2-4136-8326-224b682b6543', // MDTFORM
    '0ea8bfc4-fd3b-40bb-bb34-d5c5d9199c96', // DIFFERENTIATEDCARECLINICIAN
    'b70a7e18-9ed1-4bf5-800e-740d7eaa3514', // DIFFERENTIATEDCARERETENTION
    '693559d3-4e44-4d33-83f9-bc70ca56fe34', // TXSUPPORTERMEDREFILL
    'fed9ffa5-da88-484a-8259-bee7daa6d6f2', // PEDSTHIRDLINE
    'b690e24a-6dc7-40a8-8cbd-0924dd507dca', // YOUTHTHIRDLINE
    'de78a6be-bfc5-4634-adc3-5f1a280455cc', // HIV Enrollment
    'a0034eee-1940-4e35-847f-97537a35d05e' // HIV Consultation
  ];
  const encountersFromLatest = patientEncounters.reverse();
  const latestHivClinicalLocation = [
    encountersFromLatest.find((e) => {
      const encounterType = e?.encounterType?.uuid;
      return hivClinicalEncounterTypeUuids.includes(encounterType);
    })
  ].map((r) => {
    return r?.encounterType?.uuid;
  });
  return latestHivClinicalLocation[0] ? latestHivClinicalLocation[0] : null;
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
  patientEncounters,
  intendedVisitLocationUuid
) {
  scope.isFirstPrEPVisit = isInitialPrepVisit(patientEncounters);
  scope.isFirstPEPVisit = isInitialPepVisit(patientEncounters);
  scope.isFirstPMTCTVisit = isInitialPMTCTVisit(patientEncounters);
  scope.isFirstAMPATHHIVVisit = !isInitialHivVisit(patientEncounters);
  scope.previousHIVClinicallocation = getPreviousHIVClinicallocation(
    patientEncounters
  );
}

function buildOncologyScopeMembers(scope, patientEncounters, programUuid) {
  scope.isFirstOncologyVisit = isInitialOncologyVisit(
    patientEncounters,
    programUuid
  );
}
function isInitialHivVisit(patientEncounters) {
  const adultInitial = '8d5b27bc-c2cc-11de-8d13-0010c6dffd0f';
  const youthInitial = 'fc8c1694-90fc-46a8-962b-73ce9a99a78f';
  const pedsInitial = '8d5b2dde-c2cc-11de-8d13-0010c6dffd0f';
  const adultReturn = '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f';
  const youthReturn = '4e7553b4-373d-452f-bc89-3f4ad9a01ce7';
  const pedsReturn = '8d5b3108-c2cc-11de-8d13-0010c6dffd0f';

  const initialEncounters = [
    youthInitial,
    adultInitial,
    pedsInitial,
    adultReturn,
    youthReturn,
    pedsReturn
  ];
  const hasInitial = patientEncounters.some((e) => {
    const encounterType = e?.encounterType?.uuid;
    return initialEncounters.some((i) => {
      return i === encounterType;
    });
  });
  return hasInitial;
}
