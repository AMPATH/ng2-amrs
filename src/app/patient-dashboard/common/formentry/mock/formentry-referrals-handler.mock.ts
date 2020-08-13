import { Patient } from '../../../../models/patient.model';

export const testUnenrollmentPayload = {
  dateCompleted: new Date()
};

export const testReferralPayload = {
  dateEnrolled: '2019-06-25',
  encounter: '3a82d53a-55af-4aef-a99b-126b4625632f',
  notificationStatus: null,
  patient: '2b5884f9-a513-4886-8ca3-f0b1395a383a',
  patientProgram: 'f8a0092c-8d10-4298-800ar-80e7336670ac',
  programUuid: '876a154d-310d-4caf-8b58-be9dbcc7e753',
  provider: 'a9cecb3c-b8e2-4ce7-8307-2b622c17d5dd',
  referralReason: '',
  referredFromLocation: 'a9cecb3c-b8e2-4ce7-8307-2b622c17d5dd',
  referredToLocation: '18c343eb-b353-462a-9139-b16606e6b6c2',
  state: null
};

export const testReferralInfo = {
  referralLocation: '18c343eb-b353-462a-9139-b16606e6b6c2',
  referralVisitEncounter: [
    {
      display: 'COEDMINITIAL 25/06/2019',
      encounterDatetime: '2019-06-25T14:52:27.000+0300',
      encounterProviders: [
        {
          display: 'Test Provider: Unknown',
          uuid: '188690c5-1f3a-42ad-95b3-f6c38b159fc9'
        }
      ],
      encounterType: {
        display: 'COEDMINITIAL',
        uuid: '14c3b999-2d5c-4c2e-b173-5212b9170652'
      },
      form: {
        display: 'HTN-DM POC Tertiary Care Level Initial Visit Form V1.1',
        uuid: '3fab21cb-6276-44ed-886e-0def0deacae2'
      },
      location: {
        display: 'Location Test',
        uuid: '18c343eb-b353-462a-9139-b16606e6b6c2'
      },
      obs: [],
      patient: {
        display: '922378077-7 - Test CDM Referral 3',
        uuid: '2b5884f9-a513-4886-8ca3-f0b1395a383a'
      },
      resourceVersion: '1.9',
      uuid: '7c421612-63b4-41ab-a194-06c2bc4952d3',
      visit: {
        display: 'DM-HTN Tertiary visit @ Location Test - 25/06/2019 14:50',
        uuid: 'd5251f9a-ba5f-41a0-900d-44a145a07426'
      },
      voided: false
    }
  ]
};

export const testPatient2 = new Patient({
  allIdentifiers: '880730066-3',
  commonIdentifiers: {
    ampathMrsUId: '880730066-3',
    amrsMrn: '',
    cCC: '',
    kenyaNationalId: ''
  },
  display: '880730066-3 - Test CDM Referral',
  openmrsModel: {
    display: '880730066-3 - Test CDM Referral',
    person: {
      age: 59,
      birthdate: '1960-06-11T00:00:00.000+0300',
      birthdateEstimated: false,
      causeOfDeath: null,
      dead: false,
      deathDate: null,
      display: 'Test CDM Referral',
      gender: 'M',
      uuid: '96b45a63-b04c-4eb0-b122-2bcf384ccff3'
    }
  },
  enrolledPrograms: [
    {
      baseRoute: 'cdm',
      concept: {
        display: 'HTN-DM PRIMARY CARE',
        uuid: '94251af2-c218-4ed2-a578-fd683d5f44e6'
      },
      dateCompleted: null,
      dateEnrolled: '2019-06-25',
      dateEnrolledView: '25-06-2019',
      encounter_uuid: 'c417c963-f878-43ba-b561-59bba0a6bd8d',
      enrolledProgram: {
        dateCompleted: null,
        dateEnrolled: 'Jun 25, 2019',
        display: 'Htn-dm Primary Care',
        openmrsModel: {
          dateCompleted: null,
          dateEnrolled: '2019-06-25T00:00:00.000+0300',
          display: 'HTN-DM Primary Care',
          program: {
            uuid: '876a154d-310d-4caf-8b58-be9dbcc7e753'
          },
          states: [],
          uuid: 'd0534eab-072b-4b19-98ac-5405d35a03f0',
          voided: false
        },
        program: {
          concept: {
            display: 'HTN-DM PRIMARY CARE',
            uuid: '94251af2-c218-4ed2-a578-fd683d5f44e6'
          },
          display: 'HTN-DM PRIMARY CARE',
          openmrsModel: {
            allWorkflows: [
              {
                concept: {
                  display: 'CDM MOH DIABETES AND HYPERTENSION CARE WORKFLOW',
                  uuid: '2e44d319-9194-4e1a-a292-e28e77ec4821'
                },
                uuid: 'd7af3392-6bfc-4bdd-8a5b-0fab0707f46c'
              }
            ],
            concept: {
              display: 'HTN-DM PRIMARY CARE',
              uuid: '94251af2-c218-4ed2-a578-fd683d5f44e6'
            },
            display: 'HTN-DM PRIMARY CARE',
            uuid: '876a154d-310d-4caf-8b58-be9dbcc7e753'
          }
        },
        programUuid: '876a154d-310d-4caf-8b58-be9dbcc7e753',
        states: [],
        uuid: 'd0534eab-072b-4b19-98ac-5405d35a03f0',
        voided: false
      },
      isEdit: false,
      isEnrolled: true,
      isFocused: false,
      programUuid: '876a154d-310d-4caf-8b58-be9dbcc7e753',
      validationError: ''
    },
    {
      baseRoute: 'cdm',
      concept: {
        display: 'HTN-DM TERTIARY CARE',
        uuid: '1c1d2ed4-382c-4088-a936-25910d86a30e'
      },
      dateCompleted: null,
      dateEnrolled: '2019-06-24',
      dateEnrolledView: '24-06-2019',
      encounter_uuid: 'c417c963-f878-43ba-b561-59bba0a78bhg',
      enrolledProgram: {
        dateCompleted: null,
        dateEnrolled: 'Jun 24, 2019',
        display: 'Htn-dm Tertiary Care',
        openmrsModel: {
          dateCompleted: null,
          dateEnrolled: '2019-06-24T00:00:00.000+0300',
          display: 'HTN-DM TERTIARY CARE',
          program: {
            uuid: 'bd9a8b06-73c7-44a8-928c-5e72247f4c1d'
          },
          states: [],
          uuid: '79c8f1b8-30f9-4619-9944-ab06bba61547',
          voided: false
        },
        program: {
          concept: {
            display: 'HTN-DM TERTIARY CARE',
            uuid: '1c1d2ed4-382c-4088-a936-25910d86a30e'
          },
          display: 'HTN-DM TERTIARY CARE'
        },
        programUuid: 'bd9a8b06-73c7-44a8-928c-5e72247f4c1d',
        states: [],
        uuid: '79c8f1b8-30f9-4619-9944-ab06bba61547',
        voided: false
      },
      isEdit: false,
      isEnrolled: true,
      isFocused: false,
      programUuid: 'bd9a8b06-73c7-44a8-928c-5e72247f4c1d',
      validationError: ''
    },
  ],
  uuid: '2b5884f9-a513-4886-8ca3-f0b1395a383a'
});

export const testPatient3 = new Patient({
  allIdentifiers: '880730066-3',
  commonIdentifiers: {
    ampathMrsUId: '880730066-3',
    amrsMrn: '',
    cCC: '',
    kenyaNationalId: ''
  },
  display: '880730066-3 - Test CDM Referral',
  openmrsModel: {
    display: '880730066-3 - Test CDM Referral',
    person: {
      age: 59,
      birthdate: '1960-06-11T00:00:00.000+0300',
      birthdateEstimated: false,
      causeOfDeath: null,
      dead: false,
      deathDate: null,
      display: 'Test CDM Referral',
      gender: 'M',
      uuid: '96b45a63-b04c-4eb0-b122-2bcf384ccff3'
    }
  },
  enrolledPrograms: [
    {
      baseRoute: 'cdm',
      concept: {
        display: 'HTN-DM PRIMARY CARE',
        uuid: '94251af2-c218-4ed2-a578-fd683d5f44e6'
      },
      dateCompleted: null,
      dateEnrolled: '2019-06-25',
      dateEnrolledView: '25-06-2019',
      encounter_uuid: 'c417c963-f878-43ba-b561-59bba0a6bd8d',
      enrolledProgram: {
        dateCompleted: null,
        dateEnrolled: 'Jun 25, 2019',
        display: 'Htn-dm Primary Care',
        openmrsModel: {
          dateCompleted: null,
          dateEnrolled: '2019-06-25T00:00:00.000+0300',
          display: 'HTN-DM Primary Care',
          program: {
            uuid: '876a154d-310d-4caf-8b58-be9dbcc7e753'
          },
          states: [],
          uuid: 'd0534eab-072b-4b19-98ac-5405d35a03f0',
          voided: false
        },
        program: {
          concept: {
            display: 'HTN-DM PRIMARY CARE',
            uuid: '94251af2-c218-4ed2-a578-fd683d5f44e6'
          },
          display: 'HTN-DM PRIMARY CARE',
          openmrsModel: {
            allWorkflows: [
              {
                concept: {
                  display: 'CDM MOH DIABETES AND HYPERTENSION CARE WORKFLOW',
                  uuid: '2e44d319-9194-4e1a-a292-e28e77ec4821'
                },
                uuid: 'd7af3392-6bfc-4bdd-8a5b-0fab0707f46c'
              }
            ],
            concept: {
              display: 'HTN-DM PRIMARY CARE',
              uuid: '94251af2-c218-4ed2-a578-fd683d5f44e6'
            },
            display: 'HTN-DM PRIMARY CARE',
            uuid: '876a154d-310d-4caf-8b58-be9dbcc7e753'
          }
        },
        programUuid: '876a154d-310d-4caf-8b58-be9dbcc7e753',
        states: [],
        uuid: 'd0534eab-072b-4b19-98ac-5405d35a03f0',
        voided: false
      },
      isEdit: false,
      isEnrolled: true,
      isFocused: false,
      programUuid: '876a154d-310d-4caf-8b58-be9dbcc7e753',
      validationError: ''
    },
    {
      baseRoute: 'cdm',
      concept: {
        display: 'HTN-DM TERTIARY CARE',
        uuid: '1c1d2ed4-382c-4088-a936-25910d86a30e'
      },
      dateCompleted: null,
      dateEnrolled: '2019-06-24',
      dateEnrolledView: '24-06-2019',
      encounter_uuid: 'c417c963-f878-43ba-b561-59bba0a78bhg',
      enrolledProgram: {
        dateCompleted: null,
        dateEnrolled: 'Jun 24, 2019',
        display: 'Htn-dm Tertiary Care',
        openmrsModel: {
          dateCompleted: null,
          dateEnrolled: '2019-06-24T00:00:00.000+0300',
          display: 'HTN-DM TERTIARY CARE',
          program: {
            uuid: 'bd9a8b06-73c7-44a8-928c-5e72247f4c1d'
          },
          states: [],
          uuid: '79c8f1b8-30f9-4619-9944-ab06bba61547',
          voided: false
        },
        program: {
          concept: {
            display: 'HTN-DM TERTIARY CARE',
            uuid: '1c1d2ed4-382c-4088-a936-25910d86a30e'
          },
          display: 'HTN-DM TERTIARY CARE'
        },
        programUuid: 'bd9a8b06-73c7-44a8-928c-5e72247f4c1d',
        states: [],
        uuid: '79c8f1b8-30f9-4619-9944-ab06bba61547',
        voided: false
      },
      isEdit: false,
      isEnrolled: true,
      isFocused: false,
      programUuid: 'bd9a8b06-73c7-44a8-928c-5e72247f4c1d',
      validationError: ''
    },
  ],
  uuid: '2b5884f9-a513-4886-8ca3-f0b1395a383a'
});


export const testProgramVisitConfig = {
  '876a154d-310d-4caf-8b58-be9dbcc7e753': {
    'name': 'HTN-DM PRIMARY CARE',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'incompatibleWith': [
      'b731ba72-cf99-4176-9fcd-37cd186400c7',
      'bd9a8b06-73c7-44a8-928c-5e72247f4c1d'
    ],
    'HidevisibleLocations': [
      {
        'uuid': '0900880a-1352-11df-a1f1-0026b9348838',
        'display': 'Chepsaita'
      },
      {
        'uuid': '96d2964e-8cec-4eca-ad05-a9c1fb29a045',
        'display': 'Cheramei'
      },
      {
        'uuid': '2003e950-5b62-4330-a94c-cf8165f75084',
        'display': 'Murgusi'
      },
      {
        'uuid': '441451e5-aabd-4e71-87dd-8b7c5f651434',
        'display': 'Cheplaskei'
      },
      {
        'uuid': 'f030c7f2-9790-41d0-a704-f5a164909d17',
        'display': 'Sugoi A'
      },
      {
        'uuid': 'a27cec49-110c-41a1-9a6f-964d6ac2359d',
        'display': 'Sugoi B'
      },
      {
        'uuid': 'd09c6925-1e9a-4973-921d-d0014d7825ec',
        'display': 'Chepkemel'
      },
      {
        'uuid': 'e8c7759a-c99a-46de-82f8-d7c9f67eb237',
        'display': 'Sambut'
      },
      {
        'uuid': '00ce435c-3f27-4e89-a7f8-80fd102ff410',
        'display': 'Ngenyilel'
      },
      {
        'uuid': 'e05cbb83-9418-4ebc-9240-ae2512d70321',
        'display': 'Kapyemit'
      },
      {
        'uuid': 'e2546b92-17df-4640-a38b-c4f30b0cfd81',
        'display': 'Murgor Hills'
      },
      {
        'uuid': '3e04788f-6761-412a-8db6-08a713f59afc',
        'display': 'Osorongai'
      },
      {
        'uuid': 'd83e9d9e-8211-414d-8269-7b9308184b82',
        'display': 'West Clinic Health Centre'
      }
    ],
    'stateChangeForms': [
      {
        'type': 'inCare',
        'uuid': '72443cac-4822-4dce-8460-794af7af8167',
        'forms': []
      },
      {
        'type': 'referred',
        'uuid': '0c5565c5-45cf-40ab-aa6d-5694aeabae18',
        'forms': [
          {
            'uuid': '6a50f1d5-9f33-41ae-b2e7-7fd8267c181e',
            'required': true
          }
        ]
      },
      {
        'type': 'referredBack',
        'uuid': '15977097-13b7-4186-80a7-a78535f27866',
        'forms': [
          {
            'uuid': '6a50f1d5-9f33-41ae-b2e7-7fd8267c181e',
            'required': true
          }
        ]
      }
    ],
    'visitTypes': [
      {
        'uuid': '8072afd0-0cd9-409e-914d-1833e83943f7',
        'name': 'DM-HTN Primary Care Visit',
        'transitionStateOnVisitStart': {
          'state': 'inCare',
          'uuid': '72443cac-4822-4dce-8460-794af7af8167'
        },
        'encounterTypes': [
          {
            'uuid': 'f5381269-c889-4c5a-b384-d017441eedae',
            'display': 'CDMTRIAGE'
          },
          {
            'uuid': '1871ce37-7def-4335-972f-9861195ba683',
            'display': 'CDMDispensary'
          }
        ]
      }
    ]
  },
};

export let programVisitConfigs = {
  '781d85b0-1359-11df-a1f1-0026b9348838': {
    'name': 'Standard HIV TREATMENT',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'enrollmentOptions': {
      'requiredProgramQuestions': [
        {
          'qtype': 'hivStatus',
          'name': 'Patient HIV status',
          'enrollIf': 'positive',
          'value': null,
          'answers': [
            {
              'value': 'positive',
              'label': 'Positive'
            },
            {
              'value': 'negative',
              'label': 'Negative'
            },
            {
              'value': 'exposed',
              'label': 'Exposed'
            }
          ]
        }
      ],
      'allowMultipleEnrollment': false,
      'stateChangeEncounterTypes': {
        'enrollment': [
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'name': 'AMPATH POC Know Your Status Form v1.0',
            'required': false
          }
        ],
        'intraAmpath': [

        ],
        'discharge': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ],
        'nonAmpath': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ]
      }
    },
    'incompatibleWith': [
      '781d897a-1359-11df-a1f1-0026b9348838',
      '96047aaf-7ab3-45e9-be6a-b61810fe617d',
      'c19aec66-1a40-4588-9b03-b6be55a8dd1d',
      '334c9e98-173f-4454-a8ce-f80b20b7fdf0',
      '96ba279b-b23b-4e78-aba9-dcbd46a96b7b',
      '781d8880-1359-11df-a1f1-0026b9348838',
      '0904172d-0b6a-40df-b8a2-b3653d16dc45',
      'a8e7c30d-6d2f-401c-bb52-d4433689a36b',
      'f7793d42-11ac-4cfd-9b35-e0a21a7a7c31',
      'c4246ff0-b081-460c-bcc5-b0678012659e'
    ],
    'visitTypes': [
      {
        'uuid': '33d13ffb-5f0e-427e-ab80-637491fb6526',
        'name': 'Adult HIV Initial Visit ',
        'allowedIf': 'age >= 20 && programLocation === intendedVisitLocationUuid && isFirstAMPATHHIVVisit',
        // tslint:disable-next-line: max-line-length
        'message': 'Patient has to be 20yrs and above, in the location he enrolled into the HIV Care and Treatment program and there must not be prior clinical encounter.',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': '8d5b27bc-c2cc-11de-8d13-0010c6dffd0f',
            'display': 'ADULTINITIAL'
          },
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': '0ae56e8a-93ed-4071-82f1-0eaf3eb592ff',
        'name': 'Adult Transfer In Visit ',
        // tslint:disable-next-line: max-line-length
        'allowedIf': 'age >= 20 && programLocation === intendedVisitLocationUuid && !isFirstAMPATHHIVVisit && previousHIVClinicallocation !== programLocation',
        // tslint:disable-next-line: max-line-length
        'message': 'Patient has to be 20yrs and above , patient\'s program location should be equal to the last HIV clinical encounter location and should not be the first clinical encounter',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
            'display': 'ADULTRETURN'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': 'd4ac2aa5-2899-42fb-b08a-d40161815b48',
        'name': 'Adult HIV Return Visit ',
        'allowedIf': 'age >= 20 && programLocation === intendedVisitLocationUuid && !isFirstAMPATHHIVVisit',
        // tslint:disable-next-line: max-line-length
        'message': 'Patient has to be 20yrs and above, in the location he enrolled into the HIV Care and Treatment program  and there must be a prior clinical encounter.',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
            'display': 'LABORDERENCOUNTER'
          },
          {
            'uuid': '5544894d-8add-4521-a0ea-c124c5886c8b',
            'display': 'POCLAB'
          },
          {
            'uuid': '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
            'display': 'ADULTRETURN'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': '18faa058-4eea-4339-a959-84b3e5cb30be',
        'name': 'Pediatric HIV Initial Visit ',
        'allowedIf': 'age <= 14 && programLocation === intendedVisitLocationUuid && isFirstAMPATHHIVVisit',
        // tslint:disable-next-line: max-line-length
        'message': 'Patient has to be 14rs and below ,in the location he enrolled into the HIV Care and Treatment program and there must not be prior clinical encounter.',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': '8d5b2dde-c2cc-11de-8d13-0010c6dffd0f',
            'display': 'PEDSINITIAL'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': '2e67b87c-8843-45b7-a380-3a0e8bd58e4d',
        'name': 'Pediatric Transfer In Visit ',
        // tslint:disable-next-line: max-line-length
        'allowedIf': 'age <= 14 && programLocation === intendedVisitLocationUuid && !isFirstAMPATHHIVVisit && previousHIVClinicallocation !== programLocation',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': '8d5b3108-c2cc-11de-8d13-0010c6dffd0f',
            'display': 'PEDSRETURN'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': 'edb7c6aa-fc69-4470-936d-3d484d3708aa',
        'name': 'Pediatric HIV Return Visit ',
        'allowedIf': 'age <= 14 && programLocation === intendedVisitLocationUuid && !isFirstAMPATHHIVVisit',
        // tslint:disable-next-line: max-line-length
        'message': 'Patient has to be 14yrs and below, in the location enrolled into the HIV Care and Treatment program and it must not be the initial clinical encounter.',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': '8d5b3108-c2cc-11de-8d13-0010c6dffd0f',
            'display': 'PEDSRETURN'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': '03f5b165-c577-4e1e-b7ae-acfc3ba18ebf',
        'name': 'Youth HIV Initial Visit ',
        'allowedIf': 'age >= 10 && age <= 24 && programLocation === intendedVisitLocationUuid && isFirstAMPATHHIVVisit',
        // tslint:disable-next-line: max-line-length
        'message': 'Patient has to between 10 and 24yrs , in the location he enrolled into the HIV Care and Treatment program and must not have a prior clinical encounter',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': 'fc8c1694-90fc-46a8-962b-73ce9a99a78f',
            'display': 'YOUTHINITIAL'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': 'b27e13f7-7118-4c0d-b9d6-b759495991d6',
        'name': 'Youth Transfer In Visit ',
        // tslint:disable-next-line: max-line-length
        'allowedIf': 'age >= 10 && age <= 24 && programLocation === intendedVisitLocationUuid && !isFirstAMPATHHIVVisit && previousHIVClinicallocation !== programLocation',
        // tslint:disable-next-line: max-line-length
        'message': 'Patient has to between 10 and 24yrs , in the location he enrolled into the HIV Care and Treatment program, must have a prior clinical encounter.The program location should be different from the previous encounter location',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': '4e7553b4-373d-452f-bc89-3f4ad9a01ce7',
            'display': 'YOUTHRETURN'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': '824cf3e6-dd16-4767-ba41-2e04dede349e',
        'name': 'Youth HIV Return Visit ',
        'allowedIf': 'age >= 10 && age <= 24 && programLocation === intendedVisitLocationUuid && !isFirstAMPATHHIVVisit',
        // tslint:disable-next-line: max-line-length
        'message': 'Patient has to between 10 and 24yrs , in the location he enrolled into the HIV Care and Treatment program and must have a prior clinical encounter',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': '4e7553b4-373d-452f-bc89-3f4ad9a01ce7',
            'display': 'YOUTHRETURN'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': '43ec2bb7-ec8e-4a66-a29d-db6281399ea5',
        'name': 'Between Care Visit ',
        'allowedIf': 'programLocation !== intendedVisitLocationUuid && !isFirstAMPATHHIVVisit',
        // tslint:disable-next-line: max-line-length
        'message': 'Patient has to be in a different location from location he was enrolled into HIV care and treatment program and must have a prior clinical encounter',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': 'db9f6a5c-e141-49fc-ad2b-bdce3f9a6c80',
            'display': 'BETWEENCAREVISIT'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          },
          {
            'uuid': '987009c6-6f24-43f7-9640-c285d6553c63',
            'display': 'DRUGPICKUP'
          }
        ]
      },
      {
        'uuid': '578a6132-4686-4190-809f-3f8f49bdd1c6',
        'allowedIf': 'programLocation === intendedVisitLocationUuid && isFirstAMPATHHIVVisit',
        'name': 'Linkage Visit',
        'encounterTypes': [
          {
            'uuid': '93b4c47b-ce5c-4d83-bef2-f941199e999d',
            'display': 'PHCTLINKAGE'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': 'fcc9a836-0200-45f2-81b4-b4a687a10247',
        'name': 'Treatment Supporter Visit',
        'encounterTypes': [
          {
            'uuid': '693559d3-4e44-4d33-83f9-bc70ca56fe34',
            'display': 'TXSUPPORTERMEDREFILL'
          },
          {
            'uuid': '987009c6-6f24-43f7-9640-c285d6553c63',
            'display': 'DRUGPICKUP'
          }
        ]
      },
      {
        'uuid': '06eca2a8-1da9-4ac4-95c6-15afedd4de21',
        'name': 'HIV Lab Visit',
        'encounterTypes': [
          {
            'uuid': '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
            'display': 'LABORDERENCOUNTER'
          },
          {
            'uuid': '5544894d-8add-4521-a0ea-c124c5886c8b',
            'display': 'POCLAB'
          }
        ]
      },
      {
        'uuid': '40353c46-cd54-4629-a5d1-0a1f1108b19f',
        'name': 'Inpatient peer visit',
        'encounterTypes': [
          {
            'uuid': '10a86a62-b771-44d1-b1ad-3b8496c7bc47',
            'display': 'INPATIENTPEER'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '987009c6-6f24-43f7-9640-c285d6553c63',
            'display': 'DRUGPICKUP'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  '725b5193-3452-43fc-aca3-6a80432d9bfa': {
    'name': ' GENERAL ONCOLOGY PROGRAM',
    'incompatibleWith': [

    ],
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'visitTypes': [
      {
        'uuid': '70fd5ca8-ff05-4145-b8f2-60eab41ee7f2',
        'name': 'General Oncology Treatment Visit',
        'encounterTypes': [
          {
            'uuid': '5fa823ce-7592-482f-a0aa-361abf326ade',
            'display': 'HematOncologyTriage'
          },
          {
            'uuid': 'd17b3adc-0837-4ac6-862b-0953fc664cb8',
            'display': 'OncologyInitial'
          },
          {
            'uuid': 'eeb9600c-314f-4071-9122-133ff3da37bb',
            'display': 'OncologyReturn'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': '81166f83-1ee6-486e-8f56-aca528fc0fc0',
            'display': 'GENCONSULTATION'
          }
        ]
      }
    ]
  },
  '2114265d-dcc4-4440-9059-fe194a5f23a6': {
    'name': 'HYPERTENSION REFERRAL PROGRAM',
    'incompatibleWith': [

    ],
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'visitTypes': [
      {
        'uuid': '5033fbfc-ddc9-4f7f-853d-379659e48bdd',
        'name': 'DM-HTN Health Center visit',
        'allowedIf': 'inCareUuid === \'496cf7a6-eb2c-40b2-85e6-fbd7a885e66e\'',
        'message': 'Patient must be `in care` state',
        'encounterTypes': [
          {
            'uuid': 'f5381269-c889-4c5a-b384-d017441eedae',
            'display': 'CDMTRIAGE'
          },
          {
            'uuid': '4f5d5b20-083b-4686-be5f-5f2cc71d74e5',
            'display': 'HTNDMRETRUN'
          },
          {
            'uuid': '9af62145-1114-4711-a2b4-1c23ae69eb46',
            'display': 'HTNDMINITIAL'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          }
        ]
      }
    ]
  },
  'fc15ac01-5381-4854-bf5e-917c907aa77f': {
    'name': 'CDM PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'incompatibleWith': [

    ],
    'visitTypes': [
      {
        'uuid': '8072afd0-0cd9-409e-914d-1833e83943f7',
        'name': 'CDM Visit',
        'encounterTypes': [

        ]
      }
    ]
  },
  'bd9a8b06-73c7-44a8-928c-5e72247f4c1d': {
    'name': 'HTN-DM TERTIARY CARE',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'incompatibleWith': [
      'b731ba72-cf99-4176-9fcd-37cd186400c7',
      '876a154d-310d-4caf-8b58-be9dbcc7e753'
    ],
    'visitTypes': [
      {
        'uuid': '67da2bee-70de-451c-8002-75429c71c46c',
        'name': 'DM-HTN Tertiary visit',
        'encounterTypes': [
          {
            'uuid': 'f5381269-c889-4c5a-b384-d017441eedae',
            'display': 'CDMTRIAGE'
          },
          {
            'uuid': '14c3b999-2d5c-4c2e-b173-5212b9170652',
            'display': 'COEDMINITIAL'
          },
          {
            'uuid': '0d2ff377-a3df-453e-ae20-e92da3aa3a17',
            'display': 'COEDMRETURN'
          },
          {
            'uuid': 'db9b637c-6289-4259-a66a-326b2d2f2a5d',
            'display': 'HTNDMPEDINITIAL'
          },
          {
            'uuid': 'f26104d5-45bc-4b19-acf9-8207e414a579',
            'display': 'HTNDMPEDRETURN'
          }
        ]
      }
    ]
  },
  'b731ba72-cf99-4176-9fcd-37cd186400c7': {
    'name': 'HTN-DM SECONDARY CARE',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'HidevisibleLocations': [
      {
        'uuid': '08feb2dc-1352-11df-a1f1-0026b9348838',
        'display': 'Turbo'
      },
      {
        'uuid': '0900948a-1352-11df-a1f1-0026b9348838',
        'display': 'Huruma SDH'
      }
    ],
    'enrollmentOptions': {
      'requiredProgramQuestions': [

      ],
      'allowMultipleEnrollment': false,
      'stateChangeEncounterTypes': {
        'enrollment': [
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'name': 'AMPATH POC Know Your Status Form v1.0',
            'required': false
          }
        ],
        'referral': [
          {
            'uuid': '6a50f1d5-9f33-41ae-b2e7-7fd8267c181e',
            'name': 'CDM DM-HTN Referral Form v1.1',
            'required': true
          }
        ],
        'incompatible': [
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'name': 'AMPATH POC Know Your Status Form v1.0',
            'required': false
          }
        ]
      }
    },
    'incompatibleWith': [
      '876a154d-310d-4caf-8b58-be9dbcc7e753',
      'bd9a8b06-73c7-44a8-928c-5e72247f4c1d'
    ],
    'visitTypes': [
      {
        'uuid': '5033fbfc-ddc9-4f7f-853d-379659e48bdd',
        'name': 'DM-HTN Secondary Visit',
        'transitionStateOnVisitStart': {
          'state': 'inCare',
          'uuid': '72443cac-4822-4dce-8460-794af7af8167'
        },
        'encounterTypes': [
          {
            'uuid': 'f5381269-c889-4c5a-b384-d017441eedae',
            'display': 'CDMTRIAGE'
          },
          {
            'uuid': '9af62145-1114-4711-a2b4-1c23ae69eb46',
            'display': 'HTNDMINITIAL'
          },
          {
            'uuid': '4f5d5b20-083b-4686-be5f-5f2cc71d74e5',
            'display': 'HTNDMRETRUN'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  '876a154d-310d-4caf-8b58-be9dbcc7e753': {
    'name': 'HTN-DM PRIMARY CARE',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'incompatibleWith': [
      'b731ba72-cf99-4176-9fcd-37cd186400c7',
      'bd9a8b06-73c7-44a8-928c-5e72247f4c1d'
    ],
    'HidevisibleLocations': [
      {
        'uuid': '0900880a-1352-11df-a1f1-0026b9348838',
        'display': 'Chepsaita'
      },
      {
        'uuid': '96d2964e-8cec-4eca-ad05-a9c1fb29a045',
        'display': 'Cheramei'
      },
      {
        'uuid': '2003e950-5b62-4330-a94c-cf8165f75084',
        'display': 'Murgusi'
      },
      {
        'uuid': '441451e5-aabd-4e71-87dd-8b7c5f651434',
        'display': 'Cheplaskei'
      },
      {
        'uuid': 'f030c7f2-9790-41d0-a704-f5a164909d17',
        'display': 'Sugoi A'
      },
      {
        'uuid': 'a27cec49-110c-41a1-9a6f-964d6ac2359d',
        'display': 'Sugoi B'
      },
      {
        'uuid': 'd09c6925-1e9a-4973-921d-d0014d7825ec',
        'display': 'Chepkemel'
      },
      {
        'uuid': 'e8c7759a-c99a-46de-82f8-d7c9f67eb237',
        'display': 'Sambut'
      },
      {
        'uuid': '00ce435c-3f27-4e89-a7f8-80fd102ff410',
        'display': 'Ngenyilel'
      },
      {
        'uuid': 'e05cbb83-9418-4ebc-9240-ae2512d70321',
        'display': 'Kapyemit'
      },
      {
        'uuid': 'e2546b92-17df-4640-a38b-c4f30b0cfd81',
        'display': 'Murgor Hills'
      },
      {
        'uuid': '3e04788f-6761-412a-8db6-08a713f59afc',
        'display': 'Osorongai'
      },
      {
        'uuid': 'd83e9d9e-8211-414d-8269-7b9308184b82',
        'display': 'West Clinic Health Centre'
      }
    ],
    'stateChangeForms': [
      {
        'type': 'inCare',
        'uuid': '72443cac-4822-4dce-8460-794af7af8167',
        'forms': [

        ]
      },
      {
        'type': 'referred',
        'uuid': '0c5565c5-45cf-40ab-aa6d-5694aeabae18',
        'forms': [
          {
            'uuid': '6a50f1d5-9f33-41ae-b2e7-7fd8267c181e',
            'required': true
          }
        ]
      },
      {
        'type': 'referredBack',
        'uuid': '15977097-13b7-4186-80a7-a78535f27866',
        'forms': [
          {
            'uuid': '6a50f1d5-9f33-41ae-b2e7-7fd8267c181e',
            'required': true
          }
        ]
      }
    ],
    'visitTypes': [
      {
        'uuid': '8072afd0-0cd9-409e-914d-1833e83943f7',
        'name': 'DM-HTN Primary Care Visit',
        'transitionStateOnVisitStart': {
          'state': 'inCare',
          'uuid': '72443cac-4822-4dce-8460-794af7af8167'
        },
        'encounterTypes': [
          {
            'uuid': 'f5381269-c889-4c5a-b384-d017441eedae',
            'display': 'CDMTRIAGE'
          },
          {
            'uuid': '1871ce37-7def-4335-972f-9861195ba683',
            'display': 'CDMDispensary'
          }
        ]
      }
    ]
  },
  '781d897a-1359-11df-a1f1-0026b9348838': {
    'name': 'PREVENTION OF MOTHER-TO-CHILD TRANSMISSION OF HIV(pMTCT)',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'enrollmentOptions': {
      'requiredProgramQuestions': [
        {
          'qtype': 'hivStatus',
          'name': 'Patient HIV status',
          'enrollIf': 'positive',
          'value': null,
          'answers': [
            {
              'value': 'positive',
              'label': 'Positive'
            },
            {
              'value': 'negative',
              'label': 'Negative'
            },
            {
              'value': 'exposed',
              'label': 'Exposed'
            }
          ]
        },
        {
          'qtype': 'pregnancyStatus',
          'name': 'Pregnancy Status',
          'enrollIf': 'positive',
          'value': null,
          'answers': [
            {
              'value': 'positive',
              'label': 'Pregnant'
            },
            {
              'value': 'negative',
              'label': 'Not Pregnant'
            },
            {
              'value': 'positive',
              'label': 'Not applicable(child)'
            }
          ],
          'relatedQuestions': [
            {
              'qtype': 'motherStatus',
              'name': 'Does the mother have a child <2 years?',
              'enrollIf': 'yes',
              'showIfParent': 'negative',
              'value': null,
              'answers': [
                {
                  'value': 'yes',
                  'label': 'Yes'
                },
                {
                  'value': 'no',
                  'label': 'No'
                }
              ]
            }
          ]
        }
      ],
      'stateChangeEncounterTypes': {
        'enrollment': [
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'name': 'AMPATH POC Know Your Status Form v1.0',
            'required': false
          }
        ],
        'intraAmpath': [

        ],
        'discharge': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ],
        'nonAmpath': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ]
      }
    },
    'incompatibleWith': [
      '781d85b0-1359-11df-a1f1-0026b9348838',
      '96047aaf-7ab3-45e9-be6a-b61810fe617d',
      'c19aec66-1a40-4588-9b03-b6be55a8dd1d',
      '334c9e98-173f-4454-a8ce-f80b20b7fdf0',
      '96ba279b-b23b-4e78-aba9-dcbd46a96b7b',
      '781d8880-1359-11df-a1f1-0026b9348838',
      '0904172d-0b6a-40df-b8a2-b3653d16dc45',
      'a8e7c30d-6d2f-401c-bb52-d4433689a36b'
    ],
    'visitTypes': [
      {
        'uuid': '42de8e7e-24b2-4c16-b62b-137eb2c55ede',
        'message': 'Patient must not have prior clinical encounter.',
        'allowedIf': 'age > 2 && !hasPreviousInitialVisit',
        'name': 'PMTCT Antenatal Initial Visit',
        'encounterTypes': [
          {
            'uuid': '8d5b27bc-c2cc-11de-8d13-0010c6dffd0f',
            'display': 'ADULTINITIAL'
          },
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': '02e3ce61-fa24-445e-a1f0-6e3299142966',
        'message': 'Patient must have prior clinical encounter.',
        'allowedIf': 'hasPreviousInitialVisit',
        'name': 'PMTCT Antenatal Return Visit',
        'encounterTypes': [
          {
            'uuid': '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
            'display': 'ADULTRETURN'
          },
          {
            'uuid': '8e942fd1-135d-42bd-9701-04560f180ec5',
            'display': 'MOH257BLUECARD'
          },
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': 'b1a978ca-9315-4ba2-ac2b-84efb9a68c5c',
        'message': 'Patient must not have prior clinical encounter.',
        'allowedIf': '!hasPreviousInitialVisit',
        'name': 'PMTCT Postnatal Initial Visit',
        'encounterTypes': [
          {
            'uuid': '8d5b27bc-c2cc-11de-8d13-0010c6dffd0f',
            'display': 'ADULTINITIAL'
          },
          {
            'uuid': '8d5b2dde-c2cc-11de-8d13-0010c6dffd0f',
            'display': 'PEDSINITIAL'
          },
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': '0b1b6194-d2d5-4e4b-9f7c-c3b778ccc354',
        'message': 'Patient must have prior clinical encounter.',
        'allowedIf': 'hasPreviousInitialVisit',
        'name': 'PMTCT Postnatal Return Visit',
        'encounterTypes': [
          {
            'uuid': '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
            'display': 'ADULTRETURN'
          },
          {
            'uuid': '8e942fd1-135d-42bd-9701-04560f180ec5',
            'display': 'MOH257BLUECARD'
          },
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': '9ff9cf16-1f9c-4e9b-8471-de19ce1906e6',
        'message': 'Patient must have no prior clinical encounter.',
        'allowedIf': 'age >= 0 && age <= 2 && programLocation === intendedVisitLocationUuid && isFirstAMPATHHIVVisit',
        'name': 'Pediatric PMTCT Initial Visit',
        'encounterTypes': [
          {
            'uuid': '8d5b2dde-c2cc-11de-8d13-0010c6dffd0f',
            'display': 'PEDSINITIAL'
          },
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': 'fcc9a836-0200-45f2-81b4-b4a687a10247',
        'name': 'Treatment Supporter Visit',
        'encounterTypes': [
          {
            'uuid': '693559d3-4e44-4d33-83f9-bc70ca56fe34',
            'display': 'TXSUPPORTERMEDREFILL'
          },
          {
            'uuid': '987009c6-6f24-43f7-9640-c285d6553c63',
            'display': 'DRUGPICKUP'
          }
        ]
      },
      {
        'uuid': '06eca2a8-1da9-4ac4-95c6-15afedd4de21',
        'name': 'HIV Lab Visit',
        'encounterTypes': [
          {
            'uuid': '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
            'display': 'LABORDERENCOUNTER'
          },
          {
            'uuid': '5544894d-8add-4521-a0ea-c124c5886c8b',
            'display': 'POCLAB'
          }
        ]
      },
      {
        'uuid': '40353c46-cd54-4629-a5d1-0a1f1108b19f',
        'name': 'Inpatient peer visit',
        'encounterTypes': [
          {
            'uuid': '10a86a62-b771-44d1-b1ad-3b8496c7bc47',
            'display': 'INPATIENTPEER'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  '781d8768-1359-11df-a1f1-0026b9348838': {
    'name': 'OVC PROGRAM',
    'enrollmentOptions': {
      'stateChangeEncounterTypes': {
        'enrollment': [
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'name': 'AMPATH POC Know Your Status Form v1.0',
            'required': false
          }
        ],
        'intraAmpath': [

        ],
        'discharge': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ],
        'nonAmpath': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ]
      }
    },
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'incompatibleWith': [

    ],
    'visitTypes': [
      {
        'uuid': '0883d972-4122-454d-a746-9d28ecb23b66',
        'name': 'OVC Referral Visit',
        'allowedIf': 'inCareUuid === \'72443cac-4822-4dce-8460-794af7af8167\'',
        'message': 'Patient must be `in care` state',
        'encounterTypes': [
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': 'df554398-1350-11df-a1f1-0026b9348838',
            'display': 'ECSTABLE'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          }
        ]
      },
      {
        'uuid': 'e2c37c46-3ee9-4cff-9af6-aa5c41fb30da',
        'name': 'OVC Visit ',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': 'df554398-1350-11df-a1f1-0026b9348838',
            'display': 'ECSTABLE'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  '781d8768-1359-11df-a1f1-0026b9348837': {
    'name': 'DERMATOLOGY PROGRAM',
    'enrollmentOptions': {
      'stateChangeEncounterTypes': {
        'enrollment': [

        ],
        'intraAmpath': [

        ],
        'discharge': [

        ],
        'nonAmpath': [

        ]
      }
    },
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'incompatibleWith': [

    ],
    'visitTypes': [

    ],
    'enrollmentAllowed': true
  },
  '781d8a88-1359-11df-a1f1-0026b9348838': {
    'name': 'BSG PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'enrollmentOptions': {
      'stateChangeEncounterTypes': {
        'enrollment': [

        ],
        'intraAmpath': [

        ],
        'discharge': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ],
        'nonAmpath': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ]
      }
    },
    'incompatibleWith': [

    ],
    'visitTypes': [

    ],
    'enrollmentAllowed': true
  },
  '96047aaf-7ab3-45e9-be6a-b61810fe617d': {
    'name': 'PEP PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'enrollmentOptions': {
      'requiredProgramQuestions': [
        {
          'qtype': 'hivStatus',
          'name': 'Patient HIV status',
          'enrollIf': 'negative',
          'value': null,
          'answers': [
            {
              'value': 'positive',
              'label': 'Positive'
            },
            {
              'value': 'negative',
              'label': 'Negative'
            },
            {
              'value': 'exposed',
              'label': 'Exposed'
            }
          ]
        }
      ],
      'stateChangeEncounterTypes': {
        'enrollment': [
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'name': 'AMPATH POC Know Your Status Form v1.0',
            'required': false
          }
        ],
        'intraAmpath': [

        ],
        'discharge': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ],
        'nonAmpath': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ]
      }
    },
    'incompatibleWith': [
      '781d85b0-1359-11df-a1f1-0026b9348838',
      '781d897a-1359-11df-a1f1-0026b9348838',
      'c19aec66-1a40-4588-9b03-b6be55a8dd1d',
      '334c9e98-173f-4454-a8ce-f80b20b7fdf0',
      '96ba279b-b23b-4e78-aba9-dcbd46a96b7b',
      '781d8880-1359-11df-a1f1-0026b9348838',
      '0904172d-0b6a-40df-b8a2-b3653d16dc45',
      'a8e7c30d-6d2f-401c-bb52-d4433689a36b'
    ],
    'visitTypes': [
      {
        'uuid': '58f20c53-aac7-4e73-bd7a-97986435e570',
        'name': 'PEP Visit ',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': 'c3a78744-f94a-4a25-ac9d-1c48df887895',
            'display': 'PEPINITIAL'
          },
          {
            'uuid': 'f091b833-9e1a-4eef-8364-fc289095a832',
            'display': 'PEPRETURN'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': '06eca2a8-1da9-4ac4-95c6-15afedd4de21',
        'name': 'HIV Lab Visit',
        'encounterTypes': [
          {
            'uuid': '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
            'display': 'LABORDERENCOUNTER'
          },
          {
            'uuid': '5544894d-8add-4521-a0ea-c124c5886c8b',
            'display': 'POCLAB'
          }
        ]
      },
      {
        'uuid': '40353c46-cd54-4629-a5d1-0a1f1108b19f',
        'name': 'Inpatient peer visit',
        'encounterTypes': [
          {
            'uuid': '10a86a62-b771-44d1-b1ad-3b8496c7bc47',
            'display': 'INPATIENTPEER'
          },
          {
            'uuid': '987009c6-6f24-43f7-9640-c285d6553c63',
            'display': 'DRUGPICKUP'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  'c19aec66-1a40-4588-9b03-b6be55a8dd1d': {
    'name': 'PrEP PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'enrollmentOptions': {
      'requiredProgramQuestions': [
        {
          'qtype': 'hivStatus',
          'name': 'Patient HIV status',
          'enrollIf': 'negative',
          'value': null,
          'answers': [
            {
              'value': 'positive',
              'label': 'Positive'
            },
            {
              'value': 'negative',
              'label': 'Negative'
            },
            {
              'value': 'exposed',
              'label': 'Exposed'
            }
          ]
        }
      ],
      'stateChangeEncounterTypes': {
        'enrollment': [
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'name': 'AMPATH POC Know Your Status Form v1.0',
            'required': false
          }
        ],
        'intraAmpath': [

        ],
        'discharge': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ],
        'nonAmpath': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ]
      }
    },
    'incompatibleWith': [
      '781d85b0-1359-11df-a1f1-0026b9348838',
      '781d897a-1359-11df-a1f1-0026b9348838',
      '96047aaf-7ab3-45e9-be6a-b61810fe617d',
      '334c9e98-173f-4454-a8ce-f80b20b7fdf0',
      '96ba279b-b23b-4e78-aba9-dcbd46a96b7b',
      '781d8880-1359-11df-a1f1-0026b9348838',
      '0904172d-0b6a-40df-b8a2-b3653d16dc45',
      'a8e7c30d-6d2f-401c-bb52-d4433689a36b'
    ],
    'visitTypes': [
      {
        'uuid': '330d9739-833d-48a8-8986-f1069c320194',
        'name': 'PrEP Visit ',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': '00ee2fd6-9c95-4ffc-ab31-6b1ce2dede4d',
            'display': 'PREPINITIAL'
          },
          {
            'uuid': 'ddd96f1c-524f-4caa-81a6-1a6f9789a4bc',
            'display': 'PREPRETURN'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          },
          {
            'uuid': 'df5547bc-1350-11df-a1f1-0026b9348838',
            'display': 'OUTREACHFIELDFU'
          }
        ]
      },
      {
        'uuid': '06eca2a8-1da9-4ac4-95c6-15afedd4de21',
        'name': 'HIV Lab Visit',
        'encounterTypes': [
          {
            'uuid': '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
            'display': 'LABORDERENCOUNTER'
          },
          {
            'uuid': '5544894d-8add-4521-a0ea-c124c5886c8b',
            'display': 'POCLAB'
          }
        ]
      },
      {
        'uuid': '40353c46-cd54-4629-a5d1-0a1f1108b19f',
        'name': 'Inpatient peer visit',
        'encounterTypes': [
          {
            'uuid': '10a86a62-b771-44d1-b1ad-3b8496c7bc47',
            'display': 'INPATIENTPEER'
          },
          {
            'uuid': '987009c6-6f24-43f7-9640-c285d6553c63',
            'display': 'DRUGPICKUP'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  'f7793d42-11ac-4cfd-9b35-e0a21a7a7c31': {
    'name': 'RESISTANCE CLINIC PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'enrollmentOptions': {
      'requiredProgramQuestions': [
        {
          'qtype': 'hivStatus',
          'name': 'Patient HIV status',
          'enrollIf': 'positive',
          'value': null,
          'answers': [
            {
              'value': 'positive',
              'label': 'Positive'
            },
            {
              'value': 'negative',
              'label': 'Negative'
            },
            {
              'value': 'exposed',
              'label': 'Exposed'
            }
          ]
        }
      ],
      'stateChangeEncounterTypes': {
        'enrollment': [
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'name': 'AMPATH POC Know Your Status Form v1.0',
            'required': false
          }
        ],
        'intraAmpath': [

        ],
        'discharge': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ],
        'nonAmpath': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ]
      }
    },
    'incompatibleWith': [
      '781d85b0-1359-11df-a1f1-0026b9348838'
    ],
    'visitTypes': [
      {
        'uuid': 'dcdefd27-82b9-48e3-821b-3ffc6463564e',
        'name': 'Resistance Clinic Visit ',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
            'display': 'ADULTRETURN'
          },
          {
            'uuid': 'b690e24a-6dc7-40a8-8cbd-0924dd507dca',
            'display': 'YOUTHTHIRDLINE'
          },
          {
            'uuid': 'fed9ffa5-da88-484a-8259-bee7daa6d6f2',
            'display': 'PEDSTHIRDLINE'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': '06eca2a8-1da9-4ac4-95c6-15afedd4de21',
        'name': 'HIV Lab Visit',
        'encounterTypes': [
          {
            'uuid': '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
            'display': 'LABORDERENCOUNTER'
          },
          {
            'uuid': '5544894d-8add-4521-a0ea-c124c5886c8b',
            'display': 'POCLAB'
          }
        ]
      },
      {
        'uuid': '40353c46-cd54-4629-a5d1-0a1f1108b19f',
        'name': 'Inpatient peer visit',
        'encounterTypes': [
          {
            'uuid': '10a86a62-b771-44d1-b1ad-3b8496c7bc47',
            'display': 'INPATIENTPEER'
          },
          {
            'uuid': '987009c6-6f24-43f7-9640-c285d6553c63',
            'display': 'DRUGPICKUP'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  'a685c057-d475-42ef-bb33-8b0c1d73b122': {
    'name': 'HIV SOCIAL WORK PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'enrollmentOptions': {
      'requiredProgramQuestions': [

      ],
      'allowMultipleEnrollment': false,
      'stateChangeEncounterTypes': {
        'enrollment': [
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'name': 'AMPATH POC Know Your Status Form v1.0',
            'required': false
          }
        ],
        'intraAmpath': [

        ],
        'discharge': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ],
        'nonAmpath': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ]
      }
    },
    'incompatibleWith': [

    ],
    'visitTypes': [
      {
        'uuid': '404e44e7-f2b0-4f20-bf14-bfb98bac75df',
        'name': 'HIV Social Work Visit ',
        'encounterTypes': [
          {
            'uuid': '7cc419d5-b145-4315-a0a8-4614b710ff5f',
            'display': 'SOCIALWORKSUPPORT'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  '334c9e98-173f-4454-a8ce-f80b20b7fdf0': {
    'name': 'HIV DIFFERENTIATED CARE PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters',
      'hivLastEncounter'
    ],
    'enrollmentOptions': {
      'requiredProgramQuestions': [
        {
          'qtype': 'hivStatus',
          'name': 'Patient HIV status',
          'enrollIf': 'positive',
          'value': null,
          'answers': [
            {
              'value': 'positive',
              'label': 'Positive'
            },
            {
              'value': 'negative',
              'label': 'Negative'
            },
            {
              'value': 'exposed',
              'label': 'Exposed'
            }
          ]
        },
        {
          'qtype': 'enrollToGroup',
          'name': 'Enroll to community group',
          'enrollIf': '',
          'value': '',
          'answers': [
            {
              'value': true,
              'label': 'Yes'
            },
            {
              'value': false,
              'label': 'No'
            }
          ]
        }
      ],
      'stateChangeEncounterTypes': {
        'enrollment': [
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'name': 'AMPATH POC Know Your Status Form v1.0',
            'required': false
          }
        ],
        'intraAmpath': [

        ],
        'discharge': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ],
        'nonAmpath': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ]
      }
    },
    'incompatibleWith': [
      '781d85b0-1359-11df-a1f1-0026b9348838',
      '781d897a-1359-11df-a1f1-0026b9348838',
      '96047aaf-7ab3-45e9-be6a-b61810fe617d',
      'c19aec66-1a40-4588-9b03-b6be55a8dd1d',
      '96ba279b-b23b-4e78-aba9-dcbd46a96b7b',
      '781d8880-1359-11df-a1f1-0026b9348838',
      '0904172d-0b6a-40df-b8a2-b3653d16dc45',
      'a8e7c30d-6d2f-401c-bb52-d4433689a36b',
      'c4246ff0-b081-460c-bcc5-b0678012659e'
    ],
    'visitTypes': [
      {
        'uuid': '0d608b80-1cb5-4c85-835a-29072683ca27',
        'name': 'Community Visit for Differentiated Care',
        'groupVisit': true,
        'encounterTypes': [
          {
            'uuid': '0e9e0b44-5650-4d07-8ccc-77c3dca9cbbf',
            'display': 'DIFFERENTIATEDCARECOMMUNITY'
          },
          {
            'uuid': '987009c6-6f24-43f7-9640-c285d6553c63',
            'display': 'DRUGPICKUP'
          }
        ]
      },
      {
        'uuid': '9bf3fadd-4938-40fa-a093-4e01bf197876',
        'name': 'Differentiated Care Facility Visit ',
        'allowedIf': 'programLocation === intendedVisitLocationUuid && !qualifiesForStandardVisit',
        'message': 'Patient has to be in the location he enrolled into the HIV Care and Treatment program ',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': '0ea8bfc4-fd3b-40bb-bb34-d5c5d9199c96',
            'display': 'DIFFERENTIATEDCARECLINICIAN'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          },
          {
            'uuid': '5544894d-8add-4521-a0ea-c124c5886c8b',
            'display': 'POCLAB'
          },
          {
            'uuid': '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
            'display': 'ADULTRETURN'
          },
          {
            'uuid': '987009c6-6f24-43f7-9640-c285d6553c63',
            'display': 'DRUGPICKUP'
          },
          {
            'uuid': '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
            'display': 'LABORDERENCOUNTER'
          }
        ]
      },
      {
        'uuid': '06eca2a8-1da9-4ac4-95c6-15afedd4de21',
        'name': 'HIV Lab Visit',
        'encounterTypes': [
          {
            'uuid': '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
            'display': 'LABORDERENCOUNTER'
          },
          {
            'uuid': '5544894d-8add-4521-a0ea-c124c5886c8b',
            'display': 'POCLAB'
          }
        ]
      },
      {
        'uuid': '380d79a7-6fb0-41bf-be3d-aa3d25da187c',
        'name': 'Standard HIV Visit for Differentiated Care ',
        'allowedIf': 'age >= 10 && programLocation === intendedVisitLocationUuid && !isFirstAMPATHHIVVisit',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
            'display': 'ADULTRETURN'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          },
          {
            'uuid': '4e7553b4-373d-452f-bc89-3f4ad9a01ce7',
            'display': 'YOUTHRETURN'
          },
          {
            'uuid': '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
            'display': 'LABORDERENCOUNTER'
          },
          {
            'uuid': '5544894d-8add-4521-a0ea-c124c5886c8b',
            'display': 'POCLAB'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  '96ba279b-b23b-4e78-aba9-dcbd46a96b7b': {
    'name': 'HIV TRANSIT PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'enrollmentOptions': {
      'requiredProgramQuestions': [
        {
          'qtype': 'hivStatus',
          'name': 'Patient HIV status',
          'enrollIf': 'positive',
          'value': null,
          'answers': [
            {
              'value': 'positive',
              'label': 'Positive'
            },
            {
              'value': 'negative',
              'label': 'Negative'
            },
            {
              'value': 'exposed',
              'label': 'Exposed'
            }
          ]
        }
      ],
      'stateChangeEncounterTypes': {
        'enrollment': [
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'name': 'AMPATH POC Know Your Status Form v1.0',
            'required': false
          }
        ],
        'intraAmpath': [

        ],
        'discharge': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ],
        'nonAmpath': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ]
      }
    },
    'incompatibleWith': [
      '781d85b0-1359-11df-a1f1-0026b9348838',
      '781d897a-1359-11df-a1f1-0026b9348838',
      '96047aaf-7ab3-45e9-be6a-b61810fe617d',
      'c19aec66-1a40-4588-9b03-b6be55a8dd1d',
      '334c9e98-173f-4454-a8ce-f80b20b7fdf0',
      '781d8880-1359-11df-a1f1-0026b9348838',
      '0904172d-0b6a-40df-b8a2-b3653d16dc45',
      'a8e7c30d-6d2f-401c-bb52-d4433689a36b'
    ],
    'visitTypes': [
      {
        'uuid': '52e67f49-4ec3-41b2-bfe2-93144ea03eb2',
        'name': 'Transit Care Visit ',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': '95f5847a-8952-4a3a-8610-caee271d351a',
            'display': 'TRANSITMEDICATION'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          },
          {
            'uuid': '987009c6-6f24-43f7-9640-c285d6553c63',
            'display': 'DRUGPICKUP'
          }
        ]
      },
      {
        'uuid': '06eca2a8-1da9-4ac4-95c6-15afedd4de21',
        'name': 'HIV Lab Visit',
        'encounterTypes': [
          {
            'uuid': '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
            'display': 'LABORDERENCOUNTER'
          },
          {
            'uuid': '5544894d-8add-4521-a0ea-c124c5886c8b',
            'display': 'POCLAB'
          }
        ]
      },
      {
        'uuid': '40353c46-cd54-4629-a5d1-0a1f1108b19f',
        'name': 'Inpatient peer visit',
        'encounterTypes': [
          {
            'uuid': '10a86a62-b771-44d1-b1ad-3b8496c7bc47',
            'display': 'INPATIENTPEER'
          },
          {
            'uuid': '987009c6-6f24-43f7-9640-c285d6553c63',
            'display': 'DRUGPICKUP'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  '142939b0-28a9-4649-baf9-a9d012bf3b3d': {
    'name': 'BREAST CANCER SCREENING PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'visitTypes': [
      {
        'uuid': '55d8d186-3f74-43ad-9e40-eb16bb52b596',
        'name': 'Breast Cancer Screening ',
        'encounterTypes': [
          {
            'uuid': 'e856b2ac-fe35-41d6-a9aa-2b2679092763',
            'display': 'BREASTCANCERSCREENING'
          },
          {
            'uuid': 'f8e35989-74b7-4a18-87ac-31e98b8d9004',
            'display': 'ONCOLOGYSCREENINGTRIAGE'
          },
          {
            'uuid': 'a4c4dacc-11ff-4301-99a4-88d52c1390d5',
            'display': 'ONCOLOGYCASEMANAGEMENT'
          },
          {
            'uuid': '5bdb1b5d-9b2d-4c62-a4cd-752f203d6e5b',
            'display': 'CLINICALBREASTEXAM'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'e49a203a-068a-4d6b-b351-f40d9384170e',
            'display': 'BREASTCANCERASSESSMENT'
          }
        ]
      }
    ]
  },
  'cad71628-692c-4d8f-8dac-b2e20bece27f': {
    'name': 'CERVICAL CANCER SCREENING PROGRAM',
    'dataDependencies': [
      'patient'
    ],
    'enrollmentOptions': {
      'enrollIf': 'gender != \'M\''
    },
    'incompatibleWith': [

    ],
    'visitTypes': [
      {
        'uuid': '8103a0f3-a3d3-4453-ac3e-aaecd542ccd1',
        'name': 'Cervical Cancer Screening ',
        'encounterTypes': [
          {
            'uuid': '9bc0fa73-474e-45ab-bdac-7282e95d856f',
            'display': 'ONCOLOGYDYSPLASIA'
          },
          {
            'uuid': '00da8227-e7da-43c2-99b2-a4f237dd3924',
            'display': 'GYNPATHOLOGYRESULTS '
          },
          {
            'uuid': 'f8e35989-74b7-4a18-87ac-31e98b8d9004',
            'display': 'ONCOLOGYSCREENINGTRIAGE'
          },
          {
            'uuid': '238625fc-8a25-44b2-aa5a-8bf48fa0e18d',
            'display': 'ONCOLOGYVIA'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          }
        ]
      }
    ],
    'enrollmentAllowed': false
  },
  '43b42170-b3ce-4e03-9390-6bd78384ac06': {
    'name': 'GYN-ONCOLOGY TREATMENT PROGRAM',
    'dataDependencies': [
      'patient'
    ],
    'enrollmentOptions': {
      'enrollIf': 'gender != \'M\''
    },
    'incompatibleWith': [

    ],
    'visitTypes': [
      {
        'uuid': 'b12cb85e-0c1e-4372-92ed-3bedcec1b105',
        'name': 'Cervical Cancer Treatment ',
        'encounterTypes': [
          {
            'uuid': '5fa823ce-7592-482f-a0aa-361abf326ade',
            'display': 'HematOncologyTriage'
          },
          {
            'uuid': 'c87c5b9a-9bb6-4afe-88c6-2deb7fb49320',
            'display': 'GYNONCOLOGYINITIAL '
          },
          {
            'uuid': '57bd19b1-d64c-4cde-b436-0167f1276d9a',
            'display': 'GYNONCOLOGYOVARIAN'
          },
          {
            'uuid': 'd84854b0-e9a9-4953-8888-3dbc701771f0',
            'display': 'GYNONCOLOGYCERVICAL'
          },
          {
            'uuid': '9b763f62-7d2b-4fde-9de6-e6162422b17d',
            'display': 'GYNONCOLOGYCERVICALSURGICAL'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          }
        ]
      }
    ],
    'enrollmentAllowed': false
  },
  '88566621-828f-4569-9af5-c54f8237750a': {
    'name': 'BREAST CANCER TREATMENT PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'incompatibleWith': [

    ],
    'visitTypes': [
      {
        'uuid': 'e0d41d1c-47b5-4c97-b3c7-ba4e4268d9e6',
        'name': 'Breast Cancer Treatment ',
        'encounterTypes': [
          {
            'uuid': '9ad5292c-14c3-489b-9c14-5f816e839691',
            'display': 'BreastCancerInitial'
          },
          {
            'uuid': 'e58469f1-f6be-4e53-a843-fb06f93c60ba',
            'display': 'BreastCancerReturn'
          },
          {
            'uuid': '5fa823ce-7592-482f-a0aa-361abf326ade',
            'display': 'HematOncologyTriage'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          }
        ]
      }
    ]
  },
  'e8bc5036-1462-44fa-bcfe-ced21eae2790': {
    'name': 'LUNG CANCER TREATMENT PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'incompatibleWith': [

    ],
    'visitTypes': [
      {
        'uuid': '9c9a8308-631e-4b2b-98d1-5bcd72f9f6f9',
        'name': 'Lung Cancer Visit',
        'encounterTypes': [
          {
            'uuid': 'be7b0971-b2ab-4f4d-88c7-e7322aa58dbb',
            'display': 'LUNGCANCERINITIAL'
          },
          {
            'uuid': 'eca95bb1-b651-45b7-85f8-2d3ce7e8313e',
            'display': 'LUNGCANCERRETURN'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': '7c21df85-c928-4dc9-93d9-5dd1e8101d32',
            'display': 'LUNGCANCERSCREENING'
          },
          {
            'uuid': 'c01fba63-0c54-43c9-8769-af7f48aefb5c',
            'display': 'LUNGCANCERSCREENINGRESULT'
          }
        ]
      }
    ]
  },
  'e48b266e-4d80-41f8-a56a-a8ce5449ebc6': {
    'name': 'SICKLE CELL PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'incompatibleWith': [

    ],
    'visitTypes': [
      {
        'uuid': 'ba3bd879-c66d-4288-80d4-8302d2b823a8',
        'name': 'Sickle cell ',
        'encounterTypes': [
          {
            'uuid': '5fa823ce-7592-482f-a0aa-361abf326ade',
            'display': 'HematOncologyTriage'
          },
          {
            'uuid': 'ba5a15eb-576f-496b-a58d-e30b802a5da5',
            'display': 'SICKLECELLINITIAL'
          },
          {
            'uuid': '3a0e7e4e-426e-4dc7-8f60-9114c43432eb',
            'display': 'SICKLECELLRETURN'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'bb1ad67a-5363-42fd-a53e-ba0047eb431c',
            'display': 'SICKLECELLSCREENING'
          }
        ]
      }
    ]
  },
  '698b7153-bff3-4931-9638-d279ca47b32e': {
    'name': 'MULTIPLE MYELOMA PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'incompatibleWith': [

    ],
    'visitTypes': [
      {
        'uuid': '055436f7-cdc5-4e74-bef9-a8a06c746c3a',
        'name': 'Multiple Myeloma ',
        'encounterTypes': [
          {
            'uuid': '5fa823ce-7592-482f-a0aa-361abf326ade',
            'display': 'HematOncologyTriage'
          },
          {
            'uuid': 'bf762b3e-b60a-436a-a40b-f874c59869ec',
            'display': 'MULTIPLEMYELOMAINITIAL'
          },
          {
            'uuid': '50f307c4-b92e-4a41-bbbb-5cee1bd1c561',
            'display': 'MULTIPLEMYELOMARETURN'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          }
        ]
      }
    ]
  },
  'a3610ba4-9811-46b3-9628-83ec9310be13': {
    'name': 'HEMOPHILIA PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'incompatibleWith': [

    ],
    'visitTypes': [
      {
        'uuid': '4c5cd268-0986-444e-8122-1160c4605884',
        'name': 'Hemophilia ',
        'encounterTypes': [
          {
            'uuid': '5fa823ce-7592-482f-a0aa-361abf326ade',
            'display': 'HematOncologyTriage'
          },
          {
            'uuid': '3945005a-c24f-478b-90ec-4af84ffcdf6b',
            'display': 'HEMOPHILIAINITIAL'
          },
          {
            'uuid': '36927b3c-db32-4063-90df-e45640e9aabc',
            'display': 'HEMOPHILIARETURN'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          }
        ]
      }
    ]
  },
  '781d8880-1359-11df-a1f1-0026b9348838': {
    'name': 'EXPRESS CARE PROGRAM',
    'enrollmentOptions': {
      'allowMultipleEnrollment': true,
      'requiredProgramEnrollment': [

      ]
    },
    'stateChangeForms': [
      {
        'type': 'inCare',
        'uuid': '72443cac-4822-4dce-8460-794af7af8167',
        'forms': [

        ]
      },
      {
        'type': 'switchProgram',
        'uuid': 'eee00e63-a565-4f60-9fae-416abd8a6d3c',
        'forms': [

        ]
      },
      {
        'type': 'discharge',
        'uuid': '4e6d4fd4-d923-439e-9b6e-6baaffd20bfa',
        'forms': [
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'required': true
          }
        ]
      },
      {
        'type': 'referred',
        'uuid': '0c5565c5-45cf-40ab-aa6d-5694aeabae18',
        'forms': [
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'required': true
          }
        ]
      },
      {
        'type': 'referredBack',
        'uuid': '15977097-13b7-4186-80a7-a78535f27866',
        'forms': [
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'required': true
          }
        ]
      },
      {
        'type': 'pendingTransfer',
        'uuid': '3f16fc88-d7b7-4a6d-bd3e-6e9b43bf2f51',
        'forms': [
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'required': true
          }
        ]
      },
      {
        'type': 'transferOut',
        'uuid': '5520f234-258e-49f0-97ab-701b98fab608',
        'forms': [
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'required': true
          }
        ]
      },
      {
        'type': 'transferIn',
        'uuid': 'e293229b-4e74-445c-bfd2-602bbe4a91fb',
        'forms': [

        ]
      },
      {
        'type': 'referIn',
        'uuid': '78526af3-ef12-4f53-94de-51c455ef0a88',
        'forms': [
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'required': true
          }
        ]
      },
      {
        'type': 'referOut',
        'uuid': '24a2769a-296b-44bc-b50c-70089e0958db',
        'forms': [
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'required': true
          }
        ]
      }
    ],
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'incompatibleWith': [
      '781d85b0-1359-11df-a1f1-0026b9348838',
      '781d897a-1359-11df-a1f1-0026b9348838',
      '96047aaf-7ab3-45e9-be6a-b61810fe617d',
      'c19aec66-1a40-4588-9b03-b6be55a8dd1d',
      '334c9e98-173f-4454-a8ce-f80b20b7fdf0',
      '96ba279b-b23b-4e78-aba9-dcbd46a96b7b',
      'a8e7c30d-6d2f-401c-bb52-d4433689a36b'
    ],
    'visitTypes': [
      {
        'uuid': '0883d972-4122-454d-a746-9d28ecb23b66',
        'name': 'Express Care Program Referral Visit',
        'allowedIf': 'inCareUuid === \'72443cac-4822-4dce-8460-794af7af8167\'',
        'message': 'Patient must be `in care` state',
        'encounterTypes': [
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': 'df554398-1350-11df-a1f1-0026b9348838',
            'display': 'ECSTABLE'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          }
        ]
      },
      {
        'uuid': 'e2c37c46-3ee9-4cff-9af6-aa5c41fb30da',
        'name': 'Express Care Visit ',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': 'df554398-1350-11df-a1f1-0026b9348838',
            'display': 'ECSTABLE'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  'c6bf3625-de80-4a88-a913-38273e300a55': {
    'name': 'HIV RETENTION PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'enrollmentOptions': {
      'requiredProgramQuestions': [
        {
          'qtype': 'hivStatus',
          'name': 'Patient HIV status',
          'enrollIf': 'positive',
          'value': null,
          'answers': [
            {
              'value': 'positive',
              'label': 'Positive'
            },
            {
              'value': 'negative',
              'label': 'Negative'
            },
            {
              'value': 'exposed',
              'label': 'Exposed'
            }
          ]
        }
      ],
      'stateChangeEncounterTypes': {
        'enrollment': [
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'name': 'AMPATH POC Know Your Status Form v1.0',
            'required': false
          }
        ],
        'intraAmpath': [

        ],
        'discharge': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ],
        'nonAmpath': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ]
      }
    },
    'incompatibleWith': [

    ],
    'visitTypes': [
      {
        'uuid': '260c2535-f946-44ea-a038-34cc4f8174be',
        'name': 'Outreach Visit ',
        'encounterTypes': [
          {
            'uuid': 'df5547bc-1350-11df-a1f1-0026b9348838',
            'display': 'OUTREACHFIELDFU'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          },
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          }
        ]
      },
      {
        'uuid': '06eca2a8-1da9-4ac4-95c6-15afedd4de21',
        'name': 'HIV Lab Visit',
        'encounterTypes': [
          {
            'uuid': '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
            'display': 'LABORDERENCOUNTER'
          },
          {
            'uuid': '5544894d-8add-4521-a0ea-c124c5886c8b',
            'display': 'POCLAB'
          }
        ]
      },
      {
        'uuid': '40353c46-cd54-4629-a5d1-0a1f1108b19f',
        'name': 'Inpatient peer visit',
        'encounterTypes': [
          {
            'uuid': '10a86a62-b771-44d1-b1ad-3b8496c7bc47',
            'display': 'INPATIENTPEER'
          },
          {
            'uuid': '987009c6-6f24-43f7-9640-c285d6553c63',
            'display': 'DRUGPICKUP'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  '4480c782-ef05-4d88-b2f8-c892c99438f6': {
    'name': 'ACTG PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'enrollmentOptions': {
      'requiredProgramQuestions': [
        {
          'qtype': 'hivStatus',
          'name': 'Patient HIV status',
          'enrollIf': 'positive',
          'value': null,
          'answers': [
            {
              'value': 'positive',
              'label': 'Positive'
            },
            {
              'value': 'negative',
              'label': 'Negative'
            },
            {
              'value': 'exposed',
              'label': 'Exposed'
            }
          ]
        }
      ],
      'stateChangeEncounterTypes': {
        'enrollment': [
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'name': 'AMPATH POC Know Your Status Form v1.0',
            'required': false
          }
        ],
        'intraAmpath': [

        ],
        'discharge': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ],
        'nonAmpath': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ]
      }
    },
    'incompatibleWith': [
      '781d897a-1359-11df-a1f1-0026b9348838',
      '96047aaf-7ab3-45e9-be6a-b61810fe617d',
      'c19aec66-1a40-4588-9b03-b6be55a8dd1d',
      '334c9e98-173f-4454-a8ce-f80b20b7fdf0',
      '96ba279b-b23b-4e78-aba9-dcbd46a96b7b',
      '781d8880-1359-11df-a1f1-0026b9348838',
      '781d85b0-1359-11df-a1f1-0026b9348838',
      'c6bf3625-de80-4a88-a913-38273e300a55',
      'a8e7c30d-6d2f-401c-bb52-d4433689a36b'
    ],
    'visitTypes': [
      {
        'uuid': 'b8516e6e-17c6-4f28-bc3d-ec58d591e455',
        'name': 'ACTG Visit',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
            'display': 'ADULTRETURN'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': '06eca2a8-1da9-4ac4-95c6-15afedd4de21',
        'name': 'HIV Lab Visit',
        'encounterTypes': [
          {
            'uuid': '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
            'display': 'LABORDERENCOUNTER'
          },
          {
            'uuid': '5544894d-8add-4521-a0ea-c124c5886c8b',
            'display': 'POCLAB'
          }
        ]
      },
      {
        'uuid': '40353c46-cd54-4629-a5d1-0a1f1108b19f',
        'name': 'Inpatient peer visit',
        'encounterTypes': [
          {
            'uuid': '10a86a62-b771-44d1-b1ad-3b8496c7bc47',
            'display': 'INPATIENTPEER'
          },
          {
            'uuid': '987009c6-6f24-43f7-9640-c285d6553c63',
            'display': 'DRUGPICKUP'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  'c37ca57d-5f7e-41e3-93e0-2cd6cd01de91': {
    'name': 'COMMUNITY BASED CARE RESEARCH PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'enrollmentOptions': {
      'requiredProgramQuestions': [
        {
          'qtype': 'hivStatus',
          'name': 'Patient HIV status',
          'enrollIf': 'positive',
          'value': null,
          'answers': [
            {
              'value': 'positive',
              'label': 'Positive'
            },
            {
              'value': 'negative',
              'label': 'Negative'
            },
            {
              'value': 'exposed',
              'label': 'Exposed'
            }
          ]
        }
      ],
      'stateChangeEncounterTypes': {
        'enrollment': [
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'name': 'AMPATH POC Know Your Status Form v1.0',
            'required': false
          }
        ],
        'intraAmpath': [

        ],
        'discharge': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ],
        'nonAmpath': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ]
      }
    },
    'incompatibleWith': [
      '781d897a-1359-11df-a1f1-0026b9348838',
      '96047aaf-7ab3-45e9-be6a-b61810fe617d',
      'c19aec66-1a40-4588-9b03-b6be55a8dd1d',
      '334c9e98-173f-4454-a8ce-f80b20b7fdf0',
      '96ba279b-b23b-4e78-aba9-dcbd46a96b7b',
      '781d8880-1359-11df-a1f1-0026b9348838',
      '781d85b0-1359-11df-a1f1-0026b9348838',
      'a8e7c30d-6d2f-401c-bb52-d4433689a36b'
    ],
    'visitTypes': [
      {
        'uuid': '82704ad1-5ba8-419c-b245-ef5758fd51e7',
        'name': 'Community Based Care Visit ',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': 'fb8aa28d-ca10-4f9a-a913-3233afb4c22a',
            'display': 'COMMUNITYBASEDCARE'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  'b3575274-1850-429b-bb8f-2ff83faedbaf': {
    'name': 'DERMATOLOGY',
    'enrollmentOptions': {
      'allowMultipleEnrollment': false,
      'requiredProgramEnrollment': [

      ]
    },
    'stateChangeForms': [
      {
        'type': 'inCare',
        'uuid': '72443cac-4822-4dce-8460-794af7af8167',
        'forms': [

        ]
      },
      {
        'type': 'switchProgram',
        'uuid': 'eee00e63-a565-4f60-9fae-416abd8a6d3c',
        'forms': [

        ]
      },
      {
        'type': 'discharge',
        'uuid': '4e6d4fd4-d923-439e-9b6e-6baaffd20bfa',
        'forms': [

        ]
      },
      {
        'type': 'referred',
        'uuid': '0c5565c5-45cf-40ab-aa6d-5694aeabae18',
        'forms': [
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'required': true
          }
        ]
      },
      {
        'type': 'referredBack',
        'uuid': '15977097-13b7-4186-80a7-a78535f27866',
        'forms': [
          {
            'uuid': 'a70681eb-2238-48c6-b135-4ac9d9afea51',
            'required': true
          }
        ]
      },
      {
        'type': 'pendingTransfer',
        'uuid': '3f16fc88-d7b7-4a6d-bd3e-6e9b43bf2f51',
        'forms': [

        ]
      },
      {
        'type': 'transferOut',
        'uuid': '5520f234-258e-49f0-97ab-701b98fab608',
        'forms': [
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'required': true
          }
        ]
      },
      {
        'type': 'referOut',
        'uuid': '24a2769a-296b-44bc-b50c-70089e0958db',
        'forms': [
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'required': true
          }
        ]
      }
    ],
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'visitTypes': [
      {
        'uuid': '567e4bde-cc1f-45d7-9c5c-93d0b04d8ced',
        'name': 'Dermatology Encounter Visit',
        'encounterTypes': [
          {
            'uuid': '4587a5ab-0aad-4312-9eaa-b57151599729',
            'display': 'DERMATOLOGY'
          },
          {
            'uuid': '9150f9e5-d284-45e0-9702-faf8d2bcd1f9',
            'display': 'DERMRETURN'
          },
          {
            'uuid': 'fa49ec8b-1f19-41b2-ade2-e31ae291196b',
            'display': 'DERMINITIAL'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  '0904172d-0b6a-40df-b8a2-b3653d16dc45': {
    'name': 'TURBO DIFFERENTIATED CARE PILOT PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'enrollmentOptions': {
      'requiredProgramQuestions': [
        {
          'qtype': 'hivStatus',
          'name': 'Patient HIV status',
          'enrollIf': 'positive',
          'value': null,
          'answers': [
            {
              'value': 'positive',
              'label': 'Positive'
            },
            {
              'value': 'negative',
              'label': 'Negative'
            },
            {
              'value': 'exposed',
              'label': 'Exposed'
            }
          ]
        }
      ],
      'stateChangeEncounterTypes': {
        'enrollment': [
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'name': 'AMPATH POC Know Your Status Form v1.0',
            'required': false
          }
        ],
        'intraAmpath': [

        ],
        'discharge': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ],
        'nonAmpath': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ]
      }
    },
    'incompatibleWith': [
      '781d85b0-1359-11df-a1f1-0026b9348838',
      '781d897a-1359-11df-a1f1-0026b9348838',
      '96047aaf-7ab3-45e9-be6a-b61810fe617d',
      'c19aec66-1a40-4588-9b03-b6be55a8dd1d',
      'f7793d42-11ac-4cfd-9b35-e0a21a7a7c31',
      '96ba279b-b23b-4e78-aba9-dcbd46a96b7b',
      '781d8880-1359-11df-a1f1-0026b9348838',
      '334c9e98-173f-4454-a8ce-f80b20b7fdf0',
      'a8e7c30d-6d2f-401c-bb52-d4433689a36b'
    ],
    'visitTypes': [
      {
        'uuid': 'b8efc179-aa42-42c3-a732-04f98519b2db',
        'name': 'HIV Turbo DC Retention Worker Visit',
        'allowedIf': 'programLocation === intendedVisitLocationUuid',
        'message': 'Patient has to be in the location he enrolled into the HIV Care and Treatment program ',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': 'b70a7e18-9ed1-4bf5-800e-740d7eaa3514',
            'display': 'DIFFERENTIATEDCARERETENTION'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': 'e0537114-631a-47c9-9585-63cd8f6e8186',
        'name': 'HIV Turbo DC Clinician Visit ',
        'allowedIf': 'programLocation === intendedVisitLocationUuid',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
            'display': 'TRANSFERENCOUNTER'
          },
          {
            'uuid': '0ea8bfc4-fd3b-40bb-bb34-d5c5d9199c96',
            'display': 'DIFFERENTIATEDCARECLINICIAN'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': '06eca2a8-1da9-4ac4-95c6-15afedd4de21',
        'name': 'HIV Lab Visit',
        'encounterTypes': [
          {
            'uuid': '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
            'display': 'LABORDERENCOUNTER'
          },
          {
            'uuid': '5544894d-8add-4521-a0ea-c124c5886c8b',
            'display': 'POCLAB'
          }
        ]
      },
      {
        'uuid': '40353c46-cd54-4629-a5d1-0a1f1108b19f',
        'name': 'Inpatient peer visit',
        'encounterTypes': [
          {
            'uuid': '10a86a62-b771-44d1-b1ad-3b8496c7bc47',
            'display': 'INPATIENTPEER'
          },
          {
            'uuid': '987009c6-6f24-43f7-9640-c285d6553c63',
            'display': 'DRUGPICKUP'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  'c4246ff0-b081-460c-bcc5-b0678012659e': {
    'name': 'VIREMIA PROGRAM',
    'incompatibleWith': [
      '781d85b0-1359-11df-a1f1-0026b9348838',
      '334c9e98-173f-4454-a8ce-f80b20b7fdf0'
    ],
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'enrollmentOptions': {
      'requiredProgramQuestions': [
        {
          'qtype': 'hivStatus',
          'name': 'Patient HIV status',
          'enrollIf': 'positive',
          'value': null,
          'answers': [
            {
              'value': 'positive',
              'label': 'Positive'
            },
            {
              'value': 'negative',
              'label': 'Negative'
            },
            {
              'value': 'exposed',
              'label': 'Exposed'
            }
          ]
        }
      ],
      'stateChangeEncounterTypes': {
        'enrollment': [
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'name': 'AMPATH POC Know Your Status Form v1.0',
            'required': false
          }
        ],
        'intraAmpath': [

        ],
        'discharge': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ],
        'nonAmpath': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ]
      }
    },
    'visitTypes': [
      {
        'uuid': '6c5d74f4-943f-489a-b1c4-b2accfae92fb',
        'name': 'MDT Visit',
        'encounterTypes': [
          {
            'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            'display': 'HIVTRIAGE'
          },
          {
            'uuid': '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
            'display': 'ADULTRETURN'
          },
          {
            'uuid': '4e7553b4-373d-452f-bc89-3f4ad9a01ce7',
            'display': 'YOUTHRETURN'
          },
          {
            'uuid': '8d5b3108-c2cc-11de-8d13-0010c6dffd0f',
            'display': 'PEDSRETURN'
          },
          {
            'uuid': '282033e8-67f1-4edd-8bff-74829e8ee2b0',
            'display': 'MDTFORM'
          },
          {
            'uuid': 'df55584c-1350-11df-a1f1-0026b9348838',
            'display': 'DEATHREPORT'
          },
          {
            'uuid': '1469e5fe-ad76-4041-9aa7-650e6afbe3a1',
            'display': 'DERMATOLOGYREFERRAL'
          },
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'display': 'FAMILYSTATUS'
          }
        ]
      },
      {
        'uuid': '06eca2a8-1da9-4ac4-95c6-15afedd4de21',
        'name': 'HIV Lab Visit',
        'encounterTypes': [
          {
            'uuid': '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
            'display': 'LABORDERENCOUNTER'
          },
          {
            'uuid': '5544894d-8add-4521-a0ea-c124c5886c8b',
            'display': 'POCLAB'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  '6ff0a6dc-ef8f-467a-86fc-9d9b263d8761': {
    'name': 'DTG PHARMACO-VIGILANCE',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'enrollmentOptions': {
      'stateChangeEncounterTypes': {
        'enrollment': [
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'name': 'AMPATH POC Know Your Status Form v1.0',
            'required': false
          }
        ],
        'intraAmpath': [

        ],
        'discharge': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ],
        'nonAmpath': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ]
      }
    },
    'incompatibleWith': [

    ],
    'visitTypes': [
      {
        'uuid': '62b3d72c-a00b-46a8-af7b-e8f0c3186664',
        'name': 'DTG Pharmaco-vigilance visit',
        'encounterTypes': [
          {
            'uuid': '85523cbc-6b8c-4b9d-91a6-a9e6ae012e7f',
            'display': 'PHARMACOVIGILANCECLINICAL'
          },
          {
            'uuid': '655c3451-172e-4c85-960a-392e4284ef92',
            'display': 'PHARMACOVIGILANCEPEER'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  'a8e7c30d-6d2f-401c-bb52-d4433689a36b': {
    'name': 'HEI PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'enrollmentOptions': {
      'requiredProgramQuestions': [
        {
          'qtype': 'hivStatus',
          'name': 'Mother\'s HIV status',
          'enrollIf': 'positive',
          'value': null,
          'answers': [
            {
              'value': 'positive',
              'label': 'Positive'
            },
            {
              'value': 'negative',
              'label': 'Negative'
            },
            {
              'value': 'exposed',
              'label': 'Exposed'
            }
          ]
        }
      ],
      'stateChangeEncounterTypes': {
        'enrollment': [
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'name': 'AMPATH POC Know Your Status Form v1.0',
            'required': false
          }
        ],
        'intraAmpath': [

        ],
        'discharge': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ],
        'nonAmpath': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ]
      }
    },
    'incompatibleWith': [
      '781d85b0-1359-11df-a1f1-0026b9348838',
      '781d897a-1359-11df-a1f1-0026b9348838',
      '96047aaf-7ab3-45e9-be6a-b61810fe617d',
      'c19aec66-1a40-4588-9b03-b6be55a8dd1d',
      '334c9e98-173f-4454-a8ce-f80b20b7fdf0',
      '96ba279b-b23b-4e78-aba9-dcbd46a96b7b',
      '781d8880-1359-11df-a1f1-0026b9348838',
      '0904172d-0b6a-40df-b8a2-b3653d16dc45'
    ],
    'visitTypes': [
      {
        'uuid': '097e4a13-f874-4ecc-b5c9-122ade250f99',
        'name': 'HEI Visit',
        'encounterTypes': [
          {
            'uuid': '5e019c94-0f80-49b7-8593-28100eb4f787',
            'display': 'HEIFOLLOWUP'
          }
        ]
      },
      {
        'uuid': 'fcc9a836-0200-45f2-81b4-b4a687a10247',
        'name': 'Treatment Supporter Visit',
        'encounterTypes': [
          {
            'uuid': '693559d3-4e44-4d33-83f9-bc70ca56fe34',
            'display': 'TXSUPPORTERMEDREFILL'
          },
          {
            'uuid': '987009c6-6f24-43f7-9640-c285d6553c63',
            'display': 'DRUGPICKUP'
          }
        ]
      },
      {
        'uuid': '06eca2a8-1da9-4ac4-95c6-15afedd4de21',
        'name': 'HIV Lab Visit',
        'encounterTypes': [
          {
            'uuid': '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
            'display': 'LABORDERENCOUNTER'
          },
          {
            'uuid': '5544894d-8add-4521-a0ea-c124c5886c8b',
            'display': 'POCLAB'
          }
        ]
      },
      {
        'uuid': '40353c46-cd54-4629-a5d1-0a1f1108b19f',
        'name': 'Inpatient peer visit',
        'encounterTypes': [
          {
            'uuid': '10a86a62-b771-44d1-b1ad-3b8496c7bc47',
            'display': 'INPATIENTPEER'
          },
          {
            'uuid': '987009c6-6f24-43f7-9640-c285d6553c63',
            'display': 'DRUGPICKUP'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  '03552f68-8233-4793-8353-3db1847bb617': {
    'name': 'NUTRITION PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'incompatibleWith': [

    ],
    'enrollmentOptions': {
      'stateChangeEncounterTypes': {
        'enrollment': [
          {
            'uuid': 'ae35ed69-e07c-4209-93ce-f23733aa816b',
            'name': 'AMPATH POC Know Your Status Form v1.0',
            'required': false
          }
        ],
        'intraAmpath': [

        ],
        'discharge': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ],
        'nonAmpath': [
          {
            'uuid': '9765992c-6279-46cc-915b-452a73e7dab5',
            'name': 'AMPATH POC HIV Exit Care Form v1.1',
            'required': true
          }
        ]
      }
    },
    'visitTypes': [
      {
        'uuid': '540444dc-5dc1-436b-90f0-0dceb7c7df89',
        'name': 'Nutrition Visit',
        'encounterTypes': [
          {
            'uuid': '3cd9dd0a-a5d1-4482-9f45-a0fea4f5e556',
            'display': 'NUTRITIONENCOUNTER'
          }
        ]
      }
    ],
    'enrollmentAllowed': true
  },
  'da0c184e-751c-4b7e-a761-a60dc2d3f798': {
    'name': 'INTEGRATED SCREENING PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'incompatibleWith': [

    ],
    'visitTypes': [
      {
        'uuid': 'c7fd1d31-da42-4a5b-ba76-80c1439b1865',
        'name': 'Integrated Screening Visit',
        'encounterTypes': [
          {
            'uuid': '344719af-b526-46d3-b7f1-64e9ae618619',
            'display': 'HTNDMSCREENING'
          },
          {
            'uuid': 'a8ab57df-a539-4a37-9eba-8f9ebd96809e',
            'display': 'FPSCREENING'
          },
          {
            'uuid': '30787193-3a03-443e-b025-f55c126793eb',
            'display': 'MENTALHEALTHSCREENING'
          }
        ]
      }
    ]
  },
  'f5cbf61f-eadc-4fe6-999c-2dfe9556df95': {
    'name': 'BIGPIC PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'incompatibleWith': [

    ],
    'visitTypes': [
      {
        'uuid': 'f13f49ca-36b3-4abb-a24e-1776803ca69b',
        'name': 'GROUP CARE VISIT',
        'encounterTypes': [
          {
            'uuid': '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
            'display': 'ADULTRETURN'
          }
        ]
      }
    ]
  },
  '62741bb8-949e-4acc-9e38-50d9d874c1fb': {
    'name': 'BI KUZA AFYA PROGRAM',
    'dataDependencies': [
      'patient',
      'enrollment',
      'hivLastTenClinicalEncounters'
    ],
    'incompatibleWith': [

    ],
    'visitTypes': [
      {
        'uuid': '6deaadcf-a347-4af9-9b08-5ddba646d64e',
        'name': 'Primary Care Level Visit',
        'encounterTypes': [
          {
            'uuid': 'f5381269-c889-4c5a-b384-d017441eedae',
            'display': 'CDMTRIAGE'
          },
          {
            'uuid': '1871ce37-7def-4335-972f-9861195ba683',
            'display': 'CDMDispensary'
          }
        ]
      },
      {
        'uuid': '031044cf-441f-48f7-9374-629852b403d2',
        'name': 'Secondary Care Level Visit',
        'encounterTypes': [
          {
            'uuid': 'f5381269-c889-4c5a-b384-d017441eedae',
            'display': 'CDMTRIAGE'
          },
          {
            'uuid': '9af62145-1114-4711-a2b4-1c23ae69eb46',
            'display': 'HTNDMINITIAL'
          },
          {
            'uuid': '4f5d5b20-083b-4686-be5f-5f2cc71d74e5',
            'display': 'HTNDMRETRUN'
          }
        ]
      },
      {
        'uuid': '4a68cc05-11b4-4c4d-9808-b924db52cd04',
        'name': 'Tertiary Care Level Visit ',
        'encounterTypes': [
          {
            'uuid': 'f5381269-c889-4c5a-b384-d017441eedae',
            'display': 'CDMTRIAGE'
          },
          {
            'uuid': '14c3b999-2d5c-4c2e-b173-5212b9170652',
            'display': 'COEDMINITIAL'
          },
          {
            'uuid': '0d2ff377-a3df-453e-ae20-e92da3aa3a17',
            'display': 'COEDMRETURN'
          }
        ]
      }
    ]
  },
  'a15a58a4-0daa-4195-bf29-b4bccd5df01e': {
    'name': 'REFERRAL PEER NAVIGATOR PROGRAM',
    'dataDependencies': [

    ],
    'incompatibleWith': [

    ],
    'visitTypes': [
      {
        'uuid': '0af25783-0446-48ac-9690-d4277793183d',
        'name': 'Referral Peer Navigator Visit',
        'encounterTypes': [
          {
            'uuid': '39a7e338-427a-4f95-82bd-e4ff4b65f283',
            'display': 'PEERNAVIGATORINITIAL'
          },
          {
            'uuid': '02e75e2d-a809-4458-a77e-c1883e897c36',
            'display': 'PEERNAVIGATORFOLLOWUP'
          }
        ]
      }
    ]
  }
};
