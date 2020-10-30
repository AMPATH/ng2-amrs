var moduleDefinition = {
  getEidViralLoad: getEidViralLoad,
  getAmrsViralLoadObs: getAmrsViralLoadObs,
  getEidDnaPcr: getEidDnaPcr,
  getAmrsEidPcrObs: getAmrsEidPcrObs,
  getEidCd4Panel: getEidCd4Panel,
  getAmrsCd4PanelObs: getAmrsCd4PanelObs
};

module.exports = moduleDefinition;

function getEidViralLoad() {
  return {
    LabID: '173545',
    PatientID: '000910191-6',
    ProviderID: '1289-8',
    MFLCode: '15204',
    AMRslocationID: '14',
    AMRslocation: 'MTRH Module 3',
    PatientNames: 'Test Patient',
    DateCollected: '26-May-2016',
    DateReceived: '26-May-2016',
    DateTested: '30-May-2016',
    Result: '4064 ',
    FinalResult: '4064',
    DateDispatched: '08-Jun-2016'
  };
}

function getAmrsViralLoadObs() {
  return {
    uuid: '64ec8c62-783b-4932-a2ae-5f1e4a9864e8',
    display: 'HIV VIRAL LOAD, QUANTITATIVE: 4064.0',
    concept: {
      uuid: 'a8982474-1350-11df-a1f1-0026b9348838',
      display: 'HIV VIRAL LOAD, QUANTITATIVE',
      name: {
        display: 'HIV VIRAL LOAD, QUANTITATIVE',
        uuid: 'a940d9ca-1350-11df-a1f1-0026b9348838',
        name: 'HIV VIRAL LOAD, QUANTITATIVE',
        locale: 'en',
        localePreferred: true,
        conceptNameType: 'FULLY_SPECIFIED',
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8982474-1350-11df-a1f1-0026b9348838/name/a940d9ca-1350-11df-a1f1-0026b9348838'
          },
          {
            rel: 'full',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8982474-1350-11df-a1f1-0026b9348838/name/a940d9ca-1350-11df-a1f1-0026b9348838?v=full'
          }
        ],
        resourceVersion: '1.9'
      },
      datatype: {
        uuid: '8d4a4488-c2cc-11de-8d13-0010c6dffd0f',
        display: 'Numeric',
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/conceptdatatype/8d4a4488-c2cc-11de-8d13-0010c6dffd0f'
          }
        ]
      },
      conceptClass: {
        uuid: '8d4907b2-c2cc-11de-8d13-0010c6dffd0f',
        display: 'Test',
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/conceptclass/8d4907b2-c2cc-11de-8d13-0010c6dffd0f'
          }
        ]
      },
      set: false,
      version: '0.1',
      retired: false,
      names: [
        {
          uuid: 'a940d9ca-1350-11df-a1f1-0026b9348838',
          display: 'HIV VIRAL LOAD, QUANTITATIVE',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8982474-1350-11df-a1f1-0026b9348838/name/a940d9ca-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a956dbbc-1350-11df-a1f1-0026b9348838',
          display: 'HIV RNA PCR',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8982474-1350-11df-a1f1-0026b9348838/name/a956dbbc-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a95b5c50-1350-11df-a1f1-0026b9348838',
          display: 'VIRAL LOAD',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8982474-1350-11df-a1f1-0026b9348838/name/a95b5c50-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a952ea52-1350-11df-a1f1-0026b9348838',
          display: 'VIRAL LOAD, QUANT',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8982474-1350-11df-a1f1-0026b9348838/name/a952ea52-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a956daea-1350-11df-a1f1-0026b9348838',
          display: 'HIV QUANT',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8982474-1350-11df-a1f1-0026b9348838/name/a956daea-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a956d4fa-1350-11df-a1f1-0026b9348838',
          display: 'HIV MONITOR',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8982474-1350-11df-a1f1-0026b9348838/name/a956d4fa-1350-11df-a1f1-0026b9348838'
            }
          ]
        }
      ],
      descriptions: [
        {
          uuid: 'a8fdeafc-1350-11df-a1f1-0026b9348838',
          display:
            'This is a measure of the number of copies/ml of DNA/RNA in patients with HIV.  This test is used to monitor disease progression/treatment efficacy in patients with established infection.',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8982474-1350-11df-a1f1-0026b9348838/description/a8fdeafc-1350-11df-a1f1-0026b9348838'
            }
          ]
        }
      ],
      mappings: [
        {
          uuid: '07ac4e30-df0a-45a1-9795-5ae89766a8be',
          display: 'MCL/CIEL: 856',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8982474-1350-11df-a1f1-0026b9348838/mapping/07ac4e30-df0a-45a1-9795-5ae89766a8be'
            }
          ]
        },
        {
          uuid: '17c33c09-e09c-4be0-87c1-99c5e31e9d9b',
          display: 'local: 856',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8982474-1350-11df-a1f1-0026b9348838/mapping/17c33c09-e09c-4be0-87c1-99c5e31e9d9b'
            }
          ]
        }
      ],
      answers: [],
      setMembers: [],
      links: [
        {
          rel: 'self',
          uri:
            'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8982474-1350-11df-a1f1-0026b9348838'
        },
        {
          rel: 'full',
          uri:
            'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8982474-1350-11df-a1f1-0026b9348838?v=full'
        }
      ],
      resourceVersion: '1.11'
    },
    person: {},
    obsDatetime: '2016-05-26T00:00:01.000+0300',
    accessionNumber: null,
    obsGroup: null,
    valueCodedName: null,
    groupMembers: null,
    comment: null,
    location: null,
    order: null,
    encounter: null,
    voided: false,
    auditInfo: {
      creator: {
        uuid: 'A4F30A1B-5EB9-11DF-A648-37A07F9C90FB',
        display: 'daemon',
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/user/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB'
          }
        ]
      },
      dateCreated: '2016-06-03T16:04:30.000+0300',
      changedBy: null,
      dateChanged: null
    },
    value: 4064,
    valueModifier: null,
    formFieldPath: null,
    formFieldNamespace: null,
    links: [
      {
        rel: 'self',
        uri:
          'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/64ec8c62-783b-4932-a2ae-5f1e4a9864e8'
      }
    ],
    resourceVersion: '1.11'
  };
}

function getEidDnaPcr() {
  return {
    LabID: '24240',
    PatientID: '277850056-7',
    ProviderID: '1438-1',
    MFLCode: '15204',
    AMRslocationID: '15',
    AMRslocation: 'MTRH Module 4',
    PatientNames: 'Test Patient',
    DateCollected: '17-May-2016',
    DateReceived: '18-May-2016',
    DateTested: '20-May-2016',
    Result: 'Not Detected DBS',
    FinalResult: 'Negative',
    DateDispatched: '23-May-2016'
  };
}

function getAmrsEidPcrObs() {
  return {
    uuid: '2c8954b9-f842-40b2-8a30-41eb5bfb6fc5',
    display: 'HIV DNA POLYMERASE CHAIN REACTION, QUALITATIVE: NEGATIVE',
    concept: {
      uuid: 'a898fe80-1350-11df-a1f1-0026b9348838',
      display: 'HIV DNA POLYMERASE CHAIN REACTION, QUALITATIVE',
      name: {
        display: 'HIV DNA POLYMERASE CHAIN REACTION, QUALITATIVE',
        uuid: 'a941afc6-1350-11df-a1f1-0026b9348838',
        name: 'HIV DNA POLYMERASE CHAIN REACTION, QUALITATIVE',
        locale: 'en',
        localePreferred: true,
        conceptNameType: 'FULLY_SPECIFIED',
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fe80-1350-11df-a1f1-0026b9348838/name/a941afc6-1350-11df-a1f1-0026b9348838'
          },
          {
            rel: 'full',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fe80-1350-11df-a1f1-0026b9348838/name/a941afc6-1350-11df-a1f1-0026b9348838?v=full'
          }
        ],
        resourceVersion: '1.9'
      },
      datatype: {
        uuid: '8d4a48b6-c2cc-11de-8d13-0010c6dffd0f',
        display: 'Coded',
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/conceptdatatype/8d4a48b6-c2cc-11de-8d13-0010c6dffd0f'
          }
        ]
      },
      conceptClass: {
        uuid: '8d4907b2-c2cc-11de-8d13-0010c6dffd0f',
        display: 'Test',
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/conceptclass/8d4907b2-c2cc-11de-8d13-0010c6dffd0f'
          }
        ]
      },
      set: false,
      version: '',
      retired: false,
      names: [
        {
          uuid: 'a956da0e-1350-11df-a1f1-0026b9348838',
          display: 'HIV QUAL',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fe80-1350-11df-a1f1-0026b9348838/name/a956da0e-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a941afc6-1350-11df-a1f1-0026b9348838',
          display: 'HIV DNA POLYMERASE CHAIN REACTION, QUALITATIVE',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fe80-1350-11df-a1f1-0026b9348838/name/a941afc6-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a95267e4-1350-11df-a1f1-0026b9348838',
          display: 'HIV PCR Qual',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fe80-1350-11df-a1f1-0026b9348838/name/a95267e4-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a956ce2e-1350-11df-a1f1-0026b9348838',
          display: 'HIV DNA PCR',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fe80-1350-11df-a1f1-0026b9348838/name/a956ce2e-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a956cc76-1350-11df-a1f1-0026b9348838',
          display: 'HIV DNA',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fe80-1350-11df-a1f1-0026b9348838/name/a956cc76-1350-11df-a1f1-0026b9348838'
            }
          ]
        }
      ],
      descriptions: [
        {
          uuid: 'a8feb20c-1350-11df-a1f1-0026b9348838',
          display:
            'Qualitiative test to determine HIV infection.  Test which is used to detect genetic information inserted into the DNA of human cells by HIV.  This test is used for diagnosis of infection.',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fe80-1350-11df-a1f1-0026b9348838/description/a8feb20c-1350-11df-a1f1-0026b9348838'
            }
          ]
        }
      ],
      mappings: [
        {
          uuid: '1a010ec8-2308-4947-becc-9e09c405c481',
          display: 'MCL/CIEL: 1030',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fe80-1350-11df-a1f1-0026b9348838/mapping/1a010ec8-2308-4947-becc-9e09c405c481'
            }
          ]
        },
        {
          uuid: 'c9fb8d29-e61e-48a9-af3d-14da09287256',
          display: 'local: 1030',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fe80-1350-11df-a1f1-0026b9348838/mapping/c9fb8d29-e61e-48a9-af3d-14da09287256'
            }
          ]
        }
      ],
      answers: [
        {
          uuid: 'a89a7ae4-1350-11df-a1f1-0026b9348838',
          display: 'INDETERMINATE',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89a7ae4-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a896d2cc-1350-11df-a1f1-0026b9348838',
          display: 'NEGATIVE',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896d2cc-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a896f3a6-1350-11df-a1f1-0026b9348838',
          display: 'POSITIVE',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896f3a6-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a89c3d8e-1350-11df-a1f1-0026b9348838',
          display: 'POOR SAMPLE QUALITY',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c3d8e-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a899ea48-1350-11df-a1f1-0026b9348838',
          display: 'NOT DONE',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a899ea48-1350-11df-a1f1-0026b9348838'
            }
          ]
        }
      ],
      setMembers: [],
      links: [
        {
          rel: 'self',
          uri:
            'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fe80-1350-11df-a1f1-0026b9348838'
        },
        {
          rel: 'full',
          uri:
            'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fe80-1350-11df-a1f1-0026b9348838?v=full'
        }
      ],
      resourceVersion: '1.11'
    },
    person: {},
    obsDatetime: '2016-05-17T00:00:01.000+0300',
    accessionNumber: null,
    obsGroup: null,
    valueCodedName: null,
    groupMembers: null,
    comment: null,
    location: null,
    order: null,
    encounter: null,
    voided: false,
    auditInfo: {
      creator: {
        uuid: 'A4F30A1B-5EB9-11DF-A648-37A07F9C90FB',
        display: 'daemon',
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/user/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB'
          }
        ]
      },
      dateCreated: '2016-05-23T13:21:16.000+0300',
      changedBy: null,
      dateChanged: null
    },
    value: {
      uuid: 'a896d2cc-1350-11df-a1f1-0026b9348838',
      display: 'NEGATIVE',
      name: {
        display: 'NEGATIVE',
        uuid: 'a93f5e24-1350-11df-a1f1-0026b9348838',
        name: 'NEGATIVE',
        locale: 'en',
        localePreferred: true,
        conceptNameType: 'FULLY_SPECIFIED',
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896d2cc-1350-11df-a1f1-0026b9348838/name/a93f5e24-1350-11df-a1f1-0026b9348838'
          },
          {
            rel: 'full',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896d2cc-1350-11df-a1f1-0026b9348838/name/a93f5e24-1350-11df-a1f1-0026b9348838?v=full'
          }
        ],
        resourceVersion: '1.9'
      },
      datatype: {
        uuid: '8d4a4c94-c2cc-11de-8d13-0010c6dffd0f',
        display: 'N/A',
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/conceptdatatype/8d4a4c94-c2cc-11de-8d13-0010c6dffd0f'
          }
        ]
      },
      conceptClass: {
        uuid: '8d492774-c2cc-11de-8d13-0010c6dffd0f',
        display: 'Misc',
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/conceptclass/8d492774-c2cc-11de-8d13-0010c6dffd0f'
          }
        ]
      },
      set: false,
      version: '',
      retired: false,
      names: [
        {
          uuid: 'a952f5ce-1350-11df-a1f1-0026b9348838',
          display: '(-)',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896d2cc-1350-11df-a1f1-0026b9348838/name/a952f5ce-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a9587fc6-1350-11df-a1f1-0026b9348838',
          display: 'NEG',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896d2cc-1350-11df-a1f1-0026b9348838/name/a9587fc6-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a952fcae-1350-11df-a1f1-0026b9348838',
          display: '-',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896d2cc-1350-11df-a1f1-0026b9348838/name/a952fcae-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a93f5e24-1350-11df-a1f1-0026b9348838',
          display: 'NEGATIVE',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896d2cc-1350-11df-a1f1-0026b9348838/name/a93f5e24-1350-11df-a1f1-0026b9348838'
            }
          ]
        }
      ],
      descriptions: [
        {
          uuid: 'a8f78b08-1350-11df-a1f1-0026b9348838',
          display: 'Response to a finding or test result.',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896d2cc-1350-11df-a1f1-0026b9348838/description/a8f78b08-1350-11df-a1f1-0026b9348838'
            }
          ]
        }
      ],
      mappings: [
        {
          uuid: '5efd601b-edbf-4faf-9cd6-25911ff71a11',
          display: 'MCL/CIEL: 664',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896d2cc-1350-11df-a1f1-0026b9348838/mapping/5efd601b-edbf-4faf-9cd6-25911ff71a11'
            }
          ]
        },
        {
          uuid: '65c48593-1fb5-4d63-893b-b1a15725b311',
          display: 'local: 664',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896d2cc-1350-11df-a1f1-0026b9348838/mapping/65c48593-1fb5-4d63-893b-b1a15725b311'
            }
          ]
        }
      ],
      answers: [],
      setMembers: [],
      links: [
        {
          rel: 'self',
          uri:
            'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896d2cc-1350-11df-a1f1-0026b9348838'
        },
        {
          rel: 'full',
          uri:
            'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896d2cc-1350-11df-a1f1-0026b9348838?v=full'
        }
      ],
      resourceVersion: '1.11'
    },
    valueModifier: null,
    formFieldPath: null,
    formFieldNamespace: null,
    links: [
      {
        rel: 'self',
        uri:
          'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/2c8954b9-f842-40b2-8a30-41eb5bfb6fc5'
      }
    ],
    resourceVersion: '1.11'
  };
}

function getEidCd4Panel() {
  return {
    LabID: '6304',
    PatientID: '000981160-5',
    ProviderID: '',
    MFLCode: '15753',
    AMRslocationID: '3',
    AMRslocation: 'Turbo',
    PatientNames: 'Test Patient',
    DateCollected: '02-Jun-2016',
    DateReceived: '06-Jun-2016',
    DateTested: '06-Jun-2016',
    Result: '81.49',
    AVGCD3percentLymph: '81.49',
    AVGCD3AbsCnt: '1339.69',
    AVGCD3CD4percentLymph: '26.29',
    AVGCD3CD4AbsCnt: '432.28',
    CD45AbsCnt: '1644.03',
    DateDispatched: ''
  };
}

function getAmrsCd4PanelObs() {
  return {
    uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
    display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
    concept: {
      uuid: 'a896cce6-1350-11df-a1f1-0026b9348838',
      display: 'CD4 PANEL',
      name: {
        display: 'CD4 PANEL',
        uuid: 'a93f5320-1350-11df-a1f1-0026b9348838',
        name: 'CD4 PANEL',
        locale: 'en',
        localePreferred: true,
        conceptNameType: 'FULLY_SPECIFIED',
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896cce6-1350-11df-a1f1-0026b9348838/name/a93f5320-1350-11df-a1f1-0026b9348838'
          },
          {
            rel: 'full',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896cce6-1350-11df-a1f1-0026b9348838/name/a93f5320-1350-11df-a1f1-0026b9348838?v=full'
          }
        ],
        resourceVersion: '1.9'
      },
      datatype: {
        uuid: '8d4a4c94-c2cc-11de-8d13-0010c6dffd0f',
        display: 'N/A',
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/conceptdatatype/8d4a4c94-c2cc-11de-8d13-0010c6dffd0f'
          }
        ]
      },
      conceptClass: {
        uuid: '8d492026-c2cc-11de-8d13-0010c6dffd0f',
        display: 'LabSet',
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/conceptclass/8d492026-c2cc-11de-8d13-0010c6dffd0f'
          }
        ]
      },
      set: true,
      version: '',
      retired: false,
      names: [
        {
          uuid: 'a93f5320-1350-11df-a1f1-0026b9348838',
          display: 'CD4 PANEL',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896cce6-1350-11df-a1f1-0026b9348838/name/a93f5320-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a957a664-1350-11df-a1f1-0026b9348838',
          display: 'LYMPHOCYTE SUBSET PANEL',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896cce6-1350-11df-a1f1-0026b9348838/name/a957a664-1350-11df-a1f1-0026b9348838'
            }
          ]
        }
      ],
      descriptions: [
        {
          uuid: 'a8f782f2-1350-11df-a1f1-0026b9348838',
          display:
            'Breakdown of lymphocytes by surface receptors, including counts, percentiles and ratios.',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896cce6-1350-11df-a1f1-0026b9348838/description/a8f782f2-1350-11df-a1f1-0026b9348838'
            }
          ]
        }
      ],
      mappings: [
        {
          uuid: '66cdb436-97dd-4c44-a82e-ca8e76d6b6f6',
          display: 'MCL/CIEL: 657',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896cce6-1350-11df-a1f1-0026b9348838/mapping/66cdb436-97dd-4c44-a82e-ca8e76d6b6f6'
            }
          ]
        },
        {
          uuid: '0bfe1fc1-2cd7-4d2d-843a-5d8e2a699efb',
          display: 'local: 90',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896cce6-1350-11df-a1f1-0026b9348838/mapping/0bfe1fc1-2cd7-4d2d-843a-5d8e2a699efb'
            }
          ]
        },
        {
          uuid: '28af76e2-0eee-445b-aa43-1d55a3262496',
          display: 'local: 657',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896cce6-1350-11df-a1f1-0026b9348838/mapping/28af76e2-0eee-445b-aa43-1d55a3262496'
            }
          ]
        }
      ],
      answers: [],
      setMembers: [
        {
          uuid: 'a89c4220-1350-11df-a1f1-0026b9348838',
          display: 'CD3%, BY FACS',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4220-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a8970a26-1350-11df-a1f1-0026b9348838',
          display: 'CD4%, BY FACS',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8970a26-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a898fcd2-1350-11df-a1f1-0026b9348838',
          display: 'CD3, BY FACS',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a89821e0-1350-11df-a1f1-0026b9348838',
          display: 'CD8, BY FACS',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89821e0-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a8a8bb18-1350-11df-a1f1-0026b9348838',
          display: 'CD4, BY FACS',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a898fbf6-1350-11df-a1f1-0026b9348838',
          display: 'CD8%, BY FACS',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fbf6-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a89c4914-1350-11df-a1f1-0026b9348838',
          display: 'LYMPHOCYTE COUNT, BY FACS',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4914-1350-11df-a1f1-0026b9348838'
            }
          ]
        },
        {
          uuid: 'a89822bc-1350-11df-a1f1-0026b9348838',
          display: 'CD4/CD8 RATIO, BY FACS',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89822bc-1350-11df-a1f1-0026b9348838'
            }
          ]
        }
      ],
      links: [
        {
          rel: 'self',
          uri:
            'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896cce6-1350-11df-a1f1-0026b9348838'
        },
        {
          rel: 'full',
          uri:
            'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896cce6-1350-11df-a1f1-0026b9348838?v=full'
        }
      ],
      resourceVersion: '1.11'
    },
    person: {},
    obsDatetime: '2016-06-02T00:00:01.000+0300',
    accessionNumber: null,
    obsGroup: null,
    valueCodedName: null,
    groupMembers: [
      {
        uuid: 'f8cd76dc-6afa-4fca-8764-6c1a3d52d699',
        display: 'CD4%, BY FACS: 26.29',
        concept: {
          uuid: 'a8970a26-1350-11df-a1f1-0026b9348838',
          display: 'CD4%, BY FACS',
          name: {
            display: 'CD4%, BY FACS',
            uuid: 'a93fc4ae-1350-11df-a1f1-0026b9348838',
            name: 'CD4%, BY FACS',
            locale: 'en',
            localePreferred: true,
            conceptNameType: 'FULLY_SPECIFIED',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8970a26-1350-11df-a1f1-0026b9348838/name/a93fc4ae-1350-11df-a1f1-0026b9348838'
              },
              {
                rel: 'full',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8970a26-1350-11df-a1f1-0026b9348838/name/a93fc4ae-1350-11df-a1f1-0026b9348838?v=full'
              }
            ],
            resourceVersion: '1.9'
          },
          datatype: {
            uuid: '8d4a4488-c2cc-11de-8d13-0010c6dffd0f',
            display: 'Numeric',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/conceptdatatype/8d4a4488-c2cc-11de-8d13-0010c6dffd0f'
              }
            ]
          },
          conceptClass: {
            uuid: '8d4907b2-c2cc-11de-8d13-0010c6dffd0f',
            display: 'Test',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/conceptclass/8d4907b2-c2cc-11de-8d13-0010c6dffd0f'
              }
            ]
          },
          set: false,
          version: '0.1',
          retired: false,
          names: [
            {
              uuid: 'a95ab692-1350-11df-a1f1-0026b9348838',
              display: 'T-HELPER CELL PERCENT',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8970a26-1350-11df-a1f1-0026b9348838/name/a95ab692-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a93fc4ae-1350-11df-a1f1-0026b9348838',
              display: 'CD4%, BY FACS',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8970a26-1350-11df-a1f1-0026b9348838/name/a93fc4ae-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a954a96e-1350-11df-a1f1-0026b9348838',
              display: 'CD4 PERCENT FLOW',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8970a26-1350-11df-a1f1-0026b9348838/name/a954a96e-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a954a2ca-1350-11df-a1f1-0026b9348838',
              display: 'CD3+CD4+%LYMPH',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8970a26-1350-11df-a1f1-0026b9348838/name/a954a2ca-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a9523e18-1350-11df-a1f1-0026b9348838',
              display: 'CD4%',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8970a26-1350-11df-a1f1-0026b9348838/name/a9523e18-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a954a89c-1350-11df-a1f1-0026b9348838',
              display: 'CD4 PERCENT',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8970a26-1350-11df-a1f1-0026b9348838/name/a954a89c-1350-11df-a1f1-0026b9348838'
                }
              ]
            }
          ],
          descriptions: [
            {
              uuid: 'a8f7f5d4-1350-11df-a1f1-0026b9348838',
              display:
                'Flow cytometry scanning analysis of T-cell population, helper cell subset (CD4 positive) percent of total lymphocytes.  Percentage of T-helper lymphocytes.',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8970a26-1350-11df-a1f1-0026b9348838/description/a8f7f5d4-1350-11df-a1f1-0026b9348838'
                }
              ]
            }
          ],
          mappings: [
            {
              uuid: 'cfa573db-a23f-48ae-9925-96d5fe2bc994',
              display: 'local: 730',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8970a26-1350-11df-a1f1-0026b9348838/mapping/cfa573db-a23f-48ae-9925-96d5fe2bc994'
                }
              ]
            },
            {
              uuid: '4f257118-6537-4fa0-9145-8740abf6af02',
              display: 'MCL/CIEL: 730',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8970a26-1350-11df-a1f1-0026b9348838/mapping/4f257118-6537-4fa0-9145-8740abf6af02'
                }
              ]
            }
          ],
          answers: [],
          setMembers: [],
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8970a26-1350-11df-a1f1-0026b9348838'
            },
            {
              rel: 'full',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8970a26-1350-11df-a1f1-0026b9348838?v=full'
            }
          ],
          resourceVersion: '1.11'
        },
        person: {},
        obsDatetime: '2016-06-02T00:00:01.000+0300',
        accessionNumber: null,
        obsGroup: {
          uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
          display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
          concept: {
            uuid: 'a896cce6-1350-11df-a1f1-0026b9348838',
            display: 'CD4 PANEL',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896cce6-1350-11df-a1f1-0026b9348838'
              }
            ]
          },
          person: {},
          obsDatetime: '2016-06-02T00:00:01.000+0300',
          accessionNumber: null,
          obsGroup: null,
          valueCodedName: null,
          groupMembers: [
            {
              uuid: 'f8cd76dc-6afa-4fca-8764-6c1a3d52d699',
              display: 'CD4%, BY FACS: 26.29',
              concept: {
                uuid: 'a8970a26-1350-11df-a1f1-0026b9348838',
                display: 'CD4%, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8970a26-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {},
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 26.29,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f8cd76dc-6afa-4fca-8764-6c1a3d52d699'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f8cd76dc-6afa-4fca-8764-6c1a3d52d699?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: '1a57c4b7-3b4f-42c5-a7ea-b372d11c3adf',
              display: 'CD3%, BY FACS: 81.49',
              concept: {
                uuid: 'a89c4220-1350-11df-a1f1-0026b9348838',
                display: 'CD3%, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4220-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {},
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 81.49,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/1a57c4b7-3b4f-42c5-a7ea-b372d11c3adf'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/1a57c4b7-3b4f-42c5-a7ea-b372d11c3adf?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: '7b51e86f-fada-46af-819f-c2134d2c35ae',
              display: 'LYMPHOCYTE COUNT, BY FACS: 1644.03',
              concept: {
                uuid: 'a89c4914-1350-11df-a1f1-0026b9348838',
                display: 'LYMPHOCYTE COUNT, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4914-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {},
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 1644.03,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7b51e86f-fada-46af-819f-c2134d2c35ae'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7b51e86f-fada-46af-819f-c2134d2c35ae?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: 'f5744e2b-f678-48cc-ada6-d6d6213f4ccd',
              display: 'CD3, BY FACS: 1339.69',
              concept: {
                uuid: 'a898fcd2-1350-11df-a1f1-0026b9348838',
                display: 'CD3, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {},
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 1339.69,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f5744e2b-f678-48cc-ada6-d6d6213f4ccd'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f5744e2b-f678-48cc-ada6-d6d6213f4ccd?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: '511ed043-3868-45bf-9770-605de9a7a5a1',
              display: 'CD4, BY FACS: 432.28',
              concept: {
                uuid: 'a8a8bb18-1350-11df-a1f1-0026b9348838',
                display: 'CD4, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {},
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 432.28,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/511ed043-3868-45bf-9770-605de9a7a5a1'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/511ed043-3868-45bf-9770-605de9a7a5a1?v=full'
                }
              ],
              resourceVersion: '1.11'
            }
          ],
          comment: null,
          location: null,
          order: null,
          encounter: null,
          voided: false,
          value: null,
          valueModifier: null,
          formFieldPath: null,
          formFieldNamespace: null,
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
            },
            {
              rel: 'full',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97?v=full'
            }
          ],
          resourceVersion: '1.11'
        },
        valueCodedName: null,
        groupMembers: null,
        comment: null,
        location: null,
        order: null,
        encounter: null,
        voided: false,
        auditInfo: {
          creator: {
            uuid: 'A4F30A1B-5EB9-11DF-A648-37A07F9C90FB',
            display: 'daemon',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/user/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB'
              }
            ]
          },
          dateCreated: '2016-06-07T11:00:11.000+0300',
          changedBy: null,
          dateChanged: null
        },
        value: 26.29,
        valueModifier: null,
        formFieldPath: null,
        formFieldNamespace: null,
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f8cd76dc-6afa-4fca-8764-6c1a3d52d699'
          }
        ],
        resourceVersion: '1.11'
      },
      {
        uuid: '1a57c4b7-3b4f-42c5-a7ea-b372d11c3adf',
        display: 'CD3%, BY FACS: 81.49',
        concept: {
          uuid: 'a89c4220-1350-11df-a1f1-0026b9348838',
          display: 'CD3%, BY FACS',
          name: {
            display: 'CD3%, BY FACS',
            uuid: 'a9438396-1350-11df-a1f1-0026b9348838',
            name: 'CD3%, BY FACS',
            locale: 'en',
            localePreferred: true,
            conceptNameType: 'FULLY_SPECIFIED',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4220-1350-11df-a1f1-0026b9348838/name/a9438396-1350-11df-a1f1-0026b9348838'
              },
              {
                rel: 'full',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4220-1350-11df-a1f1-0026b9348838/name/a9438396-1350-11df-a1f1-0026b9348838?v=full'
              }
            ],
            resourceVersion: '1.9'
          },
          datatype: {
            uuid: '8d4a4488-c2cc-11de-8d13-0010c6dffd0f',
            display: 'Numeric',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/conceptdatatype/8d4a4488-c2cc-11de-8d13-0010c6dffd0f'
              }
            ]
          },
          conceptClass: {
            uuid: '8d4907b2-c2cc-11de-8d13-0010c6dffd0f',
            display: 'Test',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/conceptclass/8d4907b2-c2cc-11de-8d13-0010c6dffd0f'
              }
            ]
          },
          set: false,
          version: '0.1',
          retired: false,
          names: [
            {
              uuid: 'a958e204-1350-11df-a1f1-0026b9348838',
              display: 'PERCENT T-CELLS',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4220-1350-11df-a1f1-0026b9348838/name/a958e204-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a9523c74-1350-11df-a1f1-0026b9348838',
              display: 'CD3%',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4220-1350-11df-a1f1-0026b9348838/name/a9523c74-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a9549f6e-1350-11df-a1f1-0026b9348838',
              display: 'CD3 PERCENT',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4220-1350-11df-a1f1-0026b9348838/name/a9549f6e-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a954a11c-1350-11df-a1f1-0026b9348838',
              display: 'CD3+%LYMPH',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4220-1350-11df-a1f1-0026b9348838/name/a954a11c-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a9438396-1350-11df-a1f1-0026b9348838',
              display: 'CD3%, BY FACS',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4220-1350-11df-a1f1-0026b9348838/name/a9438396-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a954a04a-1350-11df-a1f1-0026b9348838',
              display: 'CD3 PERCENT FLOW',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4220-1350-11df-a1f1-0026b9348838/name/a954a04a-1350-11df-a1f1-0026b9348838'
                }
              ]
            }
          ],
          descriptions: [
            {
              uuid: 'a9006d18-1350-11df-a1f1-0026b9348838',
              display:
                'Flow cytometry scanning analysis of T-cell population, percent of total lymphocytes.  Percentage of t-cells which express the CD3 surface receptor.',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4220-1350-11df-a1f1-0026b9348838/description/a9006d18-1350-11df-a1f1-0026b9348838'
                }
              ]
            }
          ],
          mappings: [
            {
              uuid: '16e79b3b-af28-450a-9ebd-230b01625cbf',
              display: 'MCL/CIEL: 1310',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4220-1350-11df-a1f1-0026b9348838/mapping/16e79b3b-af28-450a-9ebd-230b01625cbf'
                }
              ]
            },
            {
              uuid: 'fb823cff-b089-4f7b-ab89-9d7325bb3dcf',
              display: 'local: 1310',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4220-1350-11df-a1f1-0026b9348838/mapping/fb823cff-b089-4f7b-ab89-9d7325bb3dcf'
                }
              ]
            }
          ],
          answers: [],
          setMembers: [],
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4220-1350-11df-a1f1-0026b9348838'
            },
            {
              rel: 'full',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4220-1350-11df-a1f1-0026b9348838?v=full'
            }
          ],
          resourceVersion: '1.11'
        },
        person: {},
        obsDatetime: '2016-06-02T00:00:01.000+0300',
        accessionNumber: null,
        obsGroup: {
          uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
          display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
          concept: {
            uuid: 'a896cce6-1350-11df-a1f1-0026b9348838',
            display: 'CD4 PANEL',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896cce6-1350-11df-a1f1-0026b9348838'
              }
            ]
          },
          person: {},
          obsDatetime: '2016-06-02T00:00:01.000+0300',
          accessionNumber: null,
          obsGroup: null,
          valueCodedName: null,
          groupMembers: [
            {
              uuid: 'f8cd76dc-6afa-4fca-8764-6c1a3d52d699',
              display: 'CD4%, BY FACS: 26.29',
              concept: {
                uuid: 'a8970a26-1350-11df-a1f1-0026b9348838',
                display: 'CD4%, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8970a26-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {},
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 26.29,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f8cd76dc-6afa-4fca-8764-6c1a3d52d699'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f8cd76dc-6afa-4fca-8764-6c1a3d52d699?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: '1a57c4b7-3b4f-42c5-a7ea-b372d11c3adf',
              display: 'CD3%, BY FACS: 81.49',
              concept: {
                uuid: 'a89c4220-1350-11df-a1f1-0026b9348838',
                display: 'CD3%, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4220-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {},
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 81.49,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/1a57c4b7-3b4f-42c5-a7ea-b372d11c3adf'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/1a57c4b7-3b4f-42c5-a7ea-b372d11c3adf?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: '7b51e86f-fada-46af-819f-c2134d2c35ae',
              display: 'LYMPHOCYTE COUNT, BY FACS: 1644.03',
              concept: {
                uuid: 'a89c4914-1350-11df-a1f1-0026b9348838',
                display: 'LYMPHOCYTE COUNT, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4914-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {},
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 1644.03,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7b51e86f-fada-46af-819f-c2134d2c35ae'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7b51e86f-fada-46af-819f-c2134d2c35ae?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: 'f5744e2b-f678-48cc-ada6-d6d6213f4ccd',
              display: 'CD3, BY FACS: 1339.69',
              concept: {
                uuid: 'a898fcd2-1350-11df-a1f1-0026b9348838',
                display: 'CD3, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {},
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 1339.69,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f5744e2b-f678-48cc-ada6-d6d6213f4ccd'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f5744e2b-f678-48cc-ada6-d6d6213f4ccd?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: '511ed043-3868-45bf-9770-605de9a7a5a1',
              display: 'CD4, BY FACS: 432.28',
              concept: {
                uuid: 'a8a8bb18-1350-11df-a1f1-0026b9348838',
                display: 'CD4, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {},
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 432.28,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/511ed043-3868-45bf-9770-605de9a7a5a1'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/511ed043-3868-45bf-9770-605de9a7a5a1?v=full'
                }
              ],
              resourceVersion: '1.11'
            }
          ],
          comment: null,
          location: null,
          order: null,
          encounter: null,
          voided: false,
          value: null,
          valueModifier: null,
          formFieldPath: null,
          formFieldNamespace: null,
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
            },
            {
              rel: 'full',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97?v=full'
            }
          ],
          resourceVersion: '1.11'
        },
        valueCodedName: null,
        groupMembers: null,
        comment: null,
        location: null,
        order: null,
        encounter: null,
        voided: false,
        auditInfo: {
          creator: {
            uuid: 'A4F30A1B-5EB9-11DF-A648-37A07F9C90FB',
            display: 'daemon',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/user/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB'
              }
            ]
          },
          dateCreated: '2016-06-07T11:00:11.000+0300',
          changedBy: null,
          dateChanged: null
        },
        value: 81.49,
        valueModifier: null,
        formFieldPath: null,
        formFieldNamespace: null,
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/1a57c4b7-3b4f-42c5-a7ea-b372d11c3adf'
          }
        ],
        resourceVersion: '1.11'
      },
      {
        uuid: '7b51e86f-fada-46af-819f-c2134d2c35ae',
        display: 'LYMPHOCYTE COUNT, BY FACS: 1644.03',
        concept: {
          uuid: 'a89c4914-1350-11df-a1f1-0026b9348838',
          display: 'LYMPHOCYTE COUNT, BY FACS',
          name: {
            display: 'LYMPHOCYTE COUNT, BY FACS',
            uuid: 'a9438b0c-1350-11df-a1f1-0026b9348838',
            name: 'LYMPHOCYTE COUNT, BY FACS',
            locale: 'en',
            localePreferred: true,
            conceptNameType: 'FULLY_SPECIFIED',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4914-1350-11df-a1f1-0026b9348838/name/a9438b0c-1350-11df-a1f1-0026b9348838'
              },
              {
                rel: 'full',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4914-1350-11df-a1f1-0026b9348838/name/a9438b0c-1350-11df-a1f1-0026b9348838?v=full'
              }
            ],
            resourceVersion: '1.9'
          },
          datatype: {
            uuid: '8d4a4488-c2cc-11de-8d13-0010c6dffd0f',
            display: 'Numeric',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/conceptdatatype/8d4a4488-c2cc-11de-8d13-0010c6dffd0f'
              }
            ]
          },
          conceptClass: {
            uuid: '8d4907b2-c2cc-11de-8d13-0010c6dffd0f',
            display: 'Test',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/conceptclass/8d4907b2-c2cc-11de-8d13-0010c6dffd0f'
              }
            ]
          },
          set: false,
          version: '0.1',
          retired: false,
          names: [
            {
              uuid: 'a9531d38-1350-11df-a1f1-0026b9348838',
              display: 'ABSOLUTE LYMPHOCYTES BY FACS',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4914-1350-11df-a1f1-0026b9348838/name/a9531d38-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a957a4c0-1350-11df-a1f1-0026b9348838',
              display: 'LYMPHOCYTE CELL COUNT BY FACS',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4914-1350-11df-a1f1-0026b9348838/name/a957a4c0-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a957a592-1350-11df-a1f1-0026b9348838',
              display: 'LYMPHOCYTE COUNT FLOW',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4914-1350-11df-a1f1-0026b9348838/name/a957a592-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a9438b0c-1350-11df-a1f1-0026b9348838',
              display: 'LYMPHOCYTE COUNT, BY FACS',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4914-1350-11df-a1f1-0026b9348838/name/a9438b0c-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a954ab1c-1350-11df-a1f1-0026b9348838',
              display: 'CD45+ABS CNT',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4914-1350-11df-a1f1-0026b9348838/name/a954ab1c-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a9528378-1350-11df-a1f1-0026b9348838',
              display: 'LYMPHOCYTES',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4914-1350-11df-a1f1-0026b9348838/name/a9528378-1350-11df-a1f1-0026b9348838'
                }
              ]
            }
          ],
          descriptions: [
            {
              uuid: 'a9006e9e-1350-11df-a1f1-0026b9348838',
              display:
                'Flow cytometry scanning analysis of total lymphocyte population.  Immunology Test - CD45 plus lymphocyte count.',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4914-1350-11df-a1f1-0026b9348838/description/a9006e9e-1350-11df-a1f1-0026b9348838'
                }
              ]
            }
          ],
          mappings: [
            {
              uuid: '90eefc4c-9e93-46ea-881c-34e469504035',
              display: 'MCL/CIEL: 1319',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4914-1350-11df-a1f1-0026b9348838/mapping/90eefc4c-9e93-46ea-881c-34e469504035'
                }
              ]
            },
            {
              uuid: '973fb281-68af-4c05-85a3-4f32fe4b147c',
              display: 'local: 1319',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4914-1350-11df-a1f1-0026b9348838/mapping/973fb281-68af-4c05-85a3-4f32fe4b147c'
                }
              ]
            }
          ],
          answers: [],
          setMembers: [],
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4914-1350-11df-a1f1-0026b9348838'
            },
            {
              rel: 'full',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4914-1350-11df-a1f1-0026b9348838?v=full'
            }
          ],
          resourceVersion: '1.11'
        },
        person: {},
        obsDatetime: '2016-06-02T00:00:01.000+0300',
        accessionNumber: null,
        obsGroup: {
          uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
          display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
          concept: {
            uuid: 'a896cce6-1350-11df-a1f1-0026b9348838',
            display: 'CD4 PANEL',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896cce6-1350-11df-a1f1-0026b9348838'
              }
            ]
          },
          person: {},
          obsDatetime: '2016-06-02T00:00:01.000+0300',
          accessionNumber: null,
          obsGroup: null,
          valueCodedName: null,
          groupMembers: [
            {
              uuid: 'f8cd76dc-6afa-4fca-8764-6c1a3d52d699',
              display: 'CD4%, BY FACS: 26.29',
              concept: {
                uuid: 'a8970a26-1350-11df-a1f1-0026b9348838',
                display: 'CD4%, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8970a26-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {},
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 26.29,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f8cd76dc-6afa-4fca-8764-6c1a3d52d699'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f8cd76dc-6afa-4fca-8764-6c1a3d52d699?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: '1a57c4b7-3b4f-42c5-a7ea-b372d11c3adf',
              display: 'CD3%, BY FACS: 81.49',
              concept: {
                uuid: 'a89c4220-1350-11df-a1f1-0026b9348838',
                display: 'CD3%, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4220-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {},
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 81.49,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/1a57c4b7-3b4f-42c5-a7ea-b372d11c3adf'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/1a57c4b7-3b4f-42c5-a7ea-b372d11c3adf?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: '7b51e86f-fada-46af-819f-c2134d2c35ae',
              display: 'LYMPHOCYTE COUNT, BY FACS: 1644.03',
              concept: {
                uuid: 'a89c4914-1350-11df-a1f1-0026b9348838',
                display: 'LYMPHOCYTE COUNT, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4914-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {},
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 1644.03,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7b51e86f-fada-46af-819f-c2134d2c35ae'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7b51e86f-fada-46af-819f-c2134d2c35ae?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: 'f5744e2b-f678-48cc-ada6-d6d6213f4ccd',
              display: 'CD3, BY FACS: 1339.69',
              concept: {
                uuid: 'a898fcd2-1350-11df-a1f1-0026b9348838',
                display: 'CD3, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {},
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 1339.69,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f5744e2b-f678-48cc-ada6-d6d6213f4ccd'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f5744e2b-f678-48cc-ada6-d6d6213f4ccd?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: '511ed043-3868-45bf-9770-605de9a7a5a1',
              display: 'CD4, BY FACS: 432.28',
              concept: {
                uuid: 'a8a8bb18-1350-11df-a1f1-0026b9348838',
                display: 'CD4, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {},
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 432.28,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/511ed043-3868-45bf-9770-605de9a7a5a1'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/511ed043-3868-45bf-9770-605de9a7a5a1?v=full'
                }
              ],
              resourceVersion: '1.11'
            }
          ],
          comment: null,
          location: null,
          order: null,
          encounter: null,
          voided: false,
          value: null,
          valueModifier: null,
          formFieldPath: null,
          formFieldNamespace: null,
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
            },
            {
              rel: 'full',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97?v=full'
            }
          ],
          resourceVersion: '1.11'
        },
        valueCodedName: null,
        groupMembers: null,
        comment: null,
        location: null,
        order: null,
        encounter: null,
        voided: false,
        auditInfo: {
          creator: {
            uuid: 'A4F30A1B-5EB9-11DF-A648-37A07F9C90FB',
            display: 'daemon',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/user/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB'
              }
            ]
          },
          dateCreated: '2016-06-07T11:00:11.000+0300',
          changedBy: null,
          dateChanged: null
        },
        value: 1644.03,
        valueModifier: null,
        formFieldPath: null,
        formFieldNamespace: null,
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7b51e86f-fada-46af-819f-c2134d2c35ae'
          }
        ],
        resourceVersion: '1.11'
      },
      {
        uuid: 'f5744e2b-f678-48cc-ada6-d6d6213f4ccd',
        display: 'CD3, BY FACS: 1339.69',
        concept: {
          uuid: 'a898fcd2-1350-11df-a1f1-0026b9348838',
          display: 'CD3, BY FACS',
          name: {
            display: 'CD3, BY FACS',
            uuid: 'a941ae22-1350-11df-a1f1-0026b9348838',
            name: 'CD3, BY FACS',
            locale: 'en',
            localePreferred: true,
            conceptNameType: 'FULLY_SPECIFIED',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838/name/a941ae22-1350-11df-a1f1-0026b9348838'
              },
              {
                rel: 'full',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838/name/a941ae22-1350-11df-a1f1-0026b9348838?v=full'
              }
            ],
            resourceVersion: '1.9'
          },
          datatype: {
            uuid: '8d4a4488-c2cc-11de-8d13-0010c6dffd0f',
            display: 'Numeric',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/conceptdatatype/8d4a4488-c2cc-11de-8d13-0010c6dffd0f'
              }
            ]
          },
          conceptClass: {
            uuid: '8d4907b2-c2cc-11de-8d13-0010c6dffd0f',
            display: 'Test',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/conceptclass/8d4907b2-c2cc-11de-8d13-0010c6dffd0f'
              }
            ]
          },
          set: false,
          version: '0.1',
          retired: false,
          names: [
            {
              uuid: 'a9523ba2-1350-11df-a1f1-0026b9348838',
              display: 'CD3 COUNT',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838/name/a9523ba2-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a9549e9c-1350-11df-a1f1-0026b9348838',
              display: 'CD3 COUNT FLOW',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838/name/a9549e9c-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a9531e00-1350-11df-a1f1-0026b9348838',
              display: 'ABSOLUTE T-CELLS',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838/name/a9531e00-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a954a1f8-1350-11df-a1f1-0026b9348838',
              display: 'CD3+ABS CNT',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838/name/a954a1f8-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a941ae22-1350-11df-a1f1-0026b9348838',
              display: 'CD3, BY FACS',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838/name/a941ae22-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a9549cee-1350-11df-a1f1-0026b9348838',
              display: 'CD3',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838/name/a9549cee-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a95ab4da-1350-11df-a1f1-0026b9348838',
              display: 'T-CELL COUNT',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838/name/a95ab4da-1350-11df-a1f1-0026b9348838'
                }
              ]
            }
          ],
          descriptions: [
            {
              uuid: 'a8feaf50-1350-11df-a1f1-0026b9348838',
              display:
                'Flow cytometry scanning count of T-cell population.  Count of t-cells which express the CD3 surface receptor.',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838/description/a8feaf50-1350-11df-a1f1-0026b9348838'
                }
              ]
            }
          ],
          mappings: [
            {
              uuid: '9d65337b-5a54-4e2e-8100-1df76cbc133b',
              display: 'local: 1028',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838/mapping/9d65337b-5a54-4e2e-8100-1df76cbc133b'
                }
              ]
            },
            {
              uuid: '525971db-70d9-42ec-a30a-871ddf7ad0f0',
              display: 'MCL/CIEL: 1028',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838/mapping/525971db-70d9-42ec-a30a-871ddf7ad0f0'
                }
              ]
            }
          ],
          answers: [],
          setMembers: [],
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838'
            },
            {
              rel: 'full',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838?v=full'
            }
          ],
          resourceVersion: '1.11'
        },
        person: {},
        obsDatetime: '2016-06-02T00:00:01.000+0300',
        accessionNumber: null,
        obsGroup: {
          uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
          display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
          concept: {
            uuid: 'a896cce6-1350-11df-a1f1-0026b9348838',
            display: 'CD4 PANEL',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896cce6-1350-11df-a1f1-0026b9348838'
              }
            ]
          },
          person: {
            uuid: 'bb4d8538-e986-47bd-a44b-4bffa6e39c22',
            display: 'test patient',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/patient/bb4d8538-e986-47bd-a44b-4bffa6e39c22'
              }
            ]
          },
          obsDatetime: '2016-06-02T00:00:01.000+0300',
          accessionNumber: null,
          obsGroup: null,
          valueCodedName: null,
          groupMembers: [
            {
              uuid: 'f8cd76dc-6afa-4fca-8764-6c1a3d52d699',
              display: 'CD4%, BY FACS: 26.29',
              concept: {
                uuid: 'a8970a26-1350-11df-a1f1-0026b9348838',
                display: 'CD4%, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8970a26-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {
                uuid: 'bb4d8538-e986-47bd-a44b-4bffa6e39c22',
                display: 'test patient',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/patient/bb4d8538-e986-47bd-a44b-4bffa6e39c22'
                  }
                ]
              },
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 26.29,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f8cd76dc-6afa-4fca-8764-6c1a3d52d699'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f8cd76dc-6afa-4fca-8764-6c1a3d52d699?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: '1a57c4b7-3b4f-42c5-a7ea-b372d11c3adf',
              display: 'CD3%, BY FACS: 81.49',
              concept: {
                uuid: 'a89c4220-1350-11df-a1f1-0026b9348838',
                display: 'CD3%, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4220-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {
                uuid: 'bb4d8538-e986-47bd-a44b-4bffa6e3c22',
                display: 'test patient',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/patient/bb4d8538-e986-47bd-a44b-4bffa6e39c22'
                  }
                ]
              },
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 81.49,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/1a57c4b7-3b4f-42c5-a7ea-b372d11c3adf'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/1a57c4b7-3b4f-42c5-a7ea-b372d11c3adf?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: '7b51e86f-fada-46af-819f-c2134d2c35ae',
              display: 'LYMPHOCYTE COUNT, BY FACS: 1644.03',
              concept: {
                uuid: 'a89c4914-1350-11df-a1f1-0026b9348838',
                display: 'LYMPHOCYTE COUNT, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4914-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {
                uuid: 'bb4d8538-e986-47bd-a44b-4bffa6e39c22',
                display: 'test patient',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/patient/bb4d8538-e986-47bd-a44b-4bffa6e39c22'
                  }
                ]
              },
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 1644.03,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7b51e86f-fada-46af-819f-c2134d2c35ae'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7b51e86f-fada-46af-819f-c2134d2c35ae?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: 'f5744e2b-f678-48cc-ada6-d6d6213f4ccd',
              display: 'CD3, BY FACS: 1339.69',
              concept: {
                uuid: 'a898fcd2-1350-11df-a1f1-0026b9348838',
                display: 'CD3, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {
                uuid: 'bb4d8538-e986-47bd-a44b-4bffa6e39c22',
                display: 'test patient',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/patient/bb4d8538-e986-47bd-a44b-4bffa6e39c22'
                  }
                ]
              },
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 1339.69,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f5744e2b-f678-48cc-ada6-d6d6213f4ccd'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f5744e2b-f678-48cc-ada6-d6d6213f4ccd?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: '511ed043-3868-45bf-9770-605de9a7a5a1',
              display: 'CD4, BY FACS: 432.28',
              concept: {
                uuid: 'a8a8bb18-1350-11df-a1f1-0026b9348838',
                display: 'CD4, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {
                uuid: 'bb4d8538-e986-47bd-a44b-4bffa6e39c22',
                display: 'test patient',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/patient/bb4d8538-e986-47bd-a44b-4bffa6e39c22'
                  }
                ]
              },
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 432.28,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/511ed043-3868-45bf-9770-605de9a7a5a1'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/511ed043-3868-45bf-9770-605de9a7a5a1?v=full'
                }
              ],
              resourceVersion: '1.11'
            }
          ],
          comment: null,
          location: null,
          order: null,
          encounter: null,
          voided: false,
          value: null,
          valueModifier: null,
          formFieldPath: null,
          formFieldNamespace: null,
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
            },
            {
              rel: 'full',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97?v=full'
            }
          ],
          resourceVersion: '1.11'
        },
        valueCodedName: null,
        groupMembers: null,
        comment: null,
        location: null,
        order: null,
        encounter: null,
        voided: false,
        auditInfo: {
          creator: {
            uuid: 'A4F30A1B-5EB9-11DF-A648-37A07F9C90FB',
            display: 'daemon',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/user/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB'
              }
            ]
          },
          dateCreated: '2016-06-07T11:00:11.000+0300',
          changedBy: null,
          dateChanged: null
        },
        value: 1339.69,
        valueModifier: null,
        formFieldPath: null,
        formFieldNamespace: null,
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f5744e2b-f678-48cc-ada6-d6d6213f4ccd'
          }
        ],
        resourceVersion: '1.11'
      },
      {
        uuid: '511ed043-3868-45bf-9770-605de9a7a5a1',
        display: 'CD4, BY FACS: 432.28',
        concept: {
          uuid: 'a8a8bb18-1350-11df-a1f1-0026b9348838',
          display: 'CD4, BY FACS',
          name: {
            display: 'CD4, BY FACS',
            uuid: 'a94b37ee-1350-11df-a1f1-0026b9348838',
            name: 'CD4, BY FACS',
            locale: 'en',
            localePreferred: true,
            conceptNameType: 'FULLY_SPECIFIED',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838/name/a94b37ee-1350-11df-a1f1-0026b9348838'
              },
              {
                rel: 'full',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838/name/a94b37ee-1350-11df-a1f1-0026b9348838?v=full'
              }
            ],
            resourceVersion: '1.9'
          },
          datatype: {
            uuid: '8d4a4488-c2cc-11de-8d13-0010c6dffd0f',
            display: 'Numeric',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/conceptdatatype/8d4a4488-c2cc-11de-8d13-0010c6dffd0f'
              }
            ]
          },
          conceptClass: {
            uuid: '8d4907b2-c2cc-11de-8d13-0010c6dffd0f',
            display: 'Test',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/conceptclass/8d4907b2-c2cc-11de-8d13-0010c6dffd0f'
              }
            ]
          },
          set: false,
          version: '0.1',
          retired: false,
          names: [
            {
              uuid: 'a9531630-1350-11df-a1f1-0026b9348838',
              display: 'ABSOLUTE CD4',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838/name/a9531630-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a954a39c-1350-11df-a1f1-0026b9348838',
              display: 'CD3+CD4+ABS CNT',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838/name/a954a39c-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a954a61c-1350-11df-a1f1-0026b9348838',
              display: 'CD4',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838/name/a954a61c-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a9523d46-1350-11df-a1f1-0026b9348838',
              display: 'CD4 COUNT',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838/name/a9523d46-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a94b37ee-1350-11df-a1f1-0026b9348838',
              display: 'CD4, BY FACS',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838/name/a94b37ee-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a954a7ca-1350-11df-a1f1-0026b9348838',
              display: 'CD4 COUNT FLOW',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838/name/a954a7ca-1350-11df-a1f1-0026b9348838'
                }
              ]
            },
            {
              uuid: 'a95ab5b6-1350-11df-a1f1-0026b9348838',
              display: 'T-HELPER CELL COUNT',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838/name/a95ab5b6-1350-11df-a1f1-0026b9348838'
                }
              ]
            }
          ],
          descriptions: [
            {
              uuid: 'a90763d4-1350-11df-a1f1-0026b9348838',
              display:
                'Flow cytometry scanning count of T-cell population, helper cell subset (CD4 positive).  Measure of CD4 (T-helper cells) in blood',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838/description/a90763d4-1350-11df-a1f1-0026b9348838'
                }
              ]
            }
          ],
          mappings: [
            {
              uuid: 'c9687a91-3201-4591-9e4b-f2d5471e0b25',
              display: 'local: 5497',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838/mapping/c9687a91-3201-4591-9e4b-f2d5471e0b25'
                }
              ]
            },
            {
              uuid: '4822eba1-807e-4242-9585-97e389a36f37',
              display: 'MCL/CIEL: 5497',
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838/mapping/4822eba1-807e-4242-9585-97e389a36f37'
                }
              ]
            }
          ],
          answers: [],
          setMembers: [],
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838'
            },
            {
              rel: 'full',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838?v=full'
            }
          ],
          resourceVersion: '1.11'
        },
        person: {
          uuid: 'bb4d8538-e986-47bd-a44b-4bffa6e39c22',
          display: 'test patient',
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/patient/bb4d8538-e986-47bd-a44b-4bffa6e39c22'
            }
          ]
        },
        obsDatetime: '2016-06-02T00:00:01.000+0300',
        accessionNumber: null,
        obsGroup: {
          uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
          display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
          concept: {
            uuid: 'a896cce6-1350-11df-a1f1-0026b9348838',
            display: 'CD4 PANEL',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a896cce6-1350-11df-a1f1-0026b9348838'
              }
            ]
          },
          person: {
            uuid: 'bb4d8538-e986-47bd-a44b-4bffa6e39c22',
            display: 'test patient',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/patient/bb4d8538-e986-47bd-a44b-4bffa6e39c22'
              }
            ]
          },
          obsDatetime: '2016-06-02T00:00:01.000+0300',
          accessionNumber: null,
          obsGroup: null,
          valueCodedName: null,
          groupMembers: [
            {
              uuid: 'f8cd76dc-6afa-4fca-8764-6c1a3d52d699',
              display: 'CD4%, BY FACS: 26.29',
              concept: {
                uuid: 'a8970a26-1350-11df-a1f1-0026b9348838',
                display: 'CD4%, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8970a26-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {
                uuid: 'bb4d8538-e986-47bd-a44b-4bffa6e39c22',
                display: 'test patient',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/patient/bb4d8538-e986-47bd-a44b-4bffa6e39c22'
                  }
                ]
              },
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 26.29,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f8cd76dc-6afa-4fca-8764-6c1a3d52d699'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f8cd76dc-6afa-4fca-8764-6c1a3d52d699?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: '1a57c4b7-3b4f-42c5-a7ea-b372d11c3adf',
              display: 'CD3%, BY FACS: 81.49',
              concept: {
                uuid: 'a89c4220-1350-11df-a1f1-0026b9348838',
                display: 'CD3%, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4220-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {
                uuid: 'bb4d8538-e986-47bd-a44b-4bffa6e39c22',
                display: 'test patient',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/patient/bb4d8538-e986-47bd-a44b-4bffa6e39c22'
                  }
                ]
              },
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 81.49,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/1a57c4b7-3b4f-42c5-a7ea-b372d11c3adf'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/1a57c4b7-3b4f-42c5-a7ea-b372d11c3adf?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: '7b51e86f-fada-46af-819f-c2134d2c35ae',
              display: 'LYMPHOCYTE COUNT, BY FACS: 1644.03',
              concept: {
                uuid: 'a89c4914-1350-11df-a1f1-0026b9348838',
                display: 'LYMPHOCYTE COUNT, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89c4914-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {
                uuid: 'bb4d8538-e986-47bd-a44b-4bffa6e39c22',
                display: 'test patient',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/patient/bb4d8538-e986-47bd-a44b-4bffa6e39c22'
                  }
                ]
              },
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 1644.03,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7b51e86f-fada-46af-819f-c2134d2c35ae'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7b51e86f-fada-46af-819f-c2134d2c35ae?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: 'f5744e2b-f678-48cc-ada6-d6d6213f4ccd',
              display: 'CD3, BY FACS: 1339.69',
              concept: {
                uuid: 'a898fcd2-1350-11df-a1f1-0026b9348838',
                display: 'CD3, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a898fcd2-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {
                uuid: 'bb4d8538-e986-47bd-a44b-4bffa6e39c22',
                display: 'test patient',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/patient/bb4d8538-e986-47bd-a44b-4bffa6e39c22'
                  }
                ]
              },
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 1339.69,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f5744e2b-f678-48cc-ada6-d6d6213f4ccd'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/f5744e2b-f678-48cc-ada6-d6d6213f4ccd?v=full'
                }
              ],
              resourceVersion: '1.11'
            },
            {
              uuid: '511ed043-3868-45bf-9770-605de9a7a5a1',
              display: 'CD4, BY FACS: 432.28',
              concept: {
                uuid: 'a8a8bb18-1350-11df-a1f1-0026b9348838',
                display: 'CD4, BY FACS',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a8a8bb18-1350-11df-a1f1-0026b9348838'
                  }
                ]
              },
              person: {
                uuid: 'bb4d8538-e986-47bd-a44b-4bffa6e39c22',
                display: 'test patient',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/patient/bb4d8538-e986-47bd-a44b-4bffa6e39c22'
                  }
                ]
              },
              obsDatetime: '2016-06-02T00:00:01.000+0300',
              accessionNumber: null,
              obsGroup: {
                uuid: '7e55fc57-05a7-4cfa-938d-58e0aa3aeb97',
                display: 'CD4 PANEL: 26.29, 81.49, 1644.03, 1339.69, 432.28',
                links: [
                  {
                    rel: 'self',
                    uri:
                      'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
                  }
                ]
              },
              valueCodedName: null,
              groupMembers: null,
              comment: null,
              location: null,
              order: null,
              encounter: null,
              voided: false,
              value: 432.28,
              valueModifier: null,
              formFieldPath: null,
              formFieldNamespace: null,
              links: [
                {
                  rel: 'self',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/511ed043-3868-45bf-9770-605de9a7a5a1'
                },
                {
                  rel: 'full',
                  uri:
                    'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/511ed043-3868-45bf-9770-605de9a7a5a1?v=full'
                }
              ],
              resourceVersion: '1.11'
            }
          ],
          comment: null,
          location: null,
          order: null,
          encounter: null,
          voided: false,
          value: null,
          valueModifier: null,
          formFieldPath: null,
          formFieldNamespace: null,
          links: [
            {
              rel: 'self',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
            },
            {
              rel: 'full',
              uri:
                'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97?v=full'
            }
          ],
          resourceVersion: '1.11'
        },
        valueCodedName: null,
        groupMembers: null,
        comment: null,
        location: null,
        order: null,
        encounter: null,
        voided: false,
        auditInfo: {
          creator: {
            uuid: 'A4F30A1B-5EB9-11DF-A648-37A07F9C90FB',
            display: 'daemon',
            links: [
              {
                rel: 'self',
                uri:
                  'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/user/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB'
              }
            ]
          },
          dateCreated: '2016-06-07T11:00:11.000+0300',
          changedBy: null,
          dateChanged: null
        },
        value: 432.28,
        valueModifier: null,
        formFieldPath: null,
        formFieldNamespace: null,
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/511ed043-3868-45bf-9770-605de9a7a5a1'
          }
        ],
        resourceVersion: '1.11'
      }
    ],
    comment: null,
    location: null,
    order: null,
    encounter: null,
    voided: false,
    auditInfo: {
      creator: {
        uuid: 'A4F30A1B-5EB9-11DF-A648-37A07F9C90FB',
        display: 'daemon',
        links: [
          {
            rel: 'self',
            uri:
              'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/user/A4F30A1B-5EB9-11DF-A648-37A07F9C90FB'
          }
        ]
      },
      dateCreated: '2016-06-07T11:00:11.000+0300',
      changedBy: null,
      dateChanged: null
    },
    value: null,
    valueModifier: null,
    formFieldPath: null,
    formFieldNamespace: null,
    links: [
      {
        rel: 'self',
        uri:
          'https://amrs.ampath.or.ke:8443/amrs/ws/rest/v1/obs/7e55fc57-05a7-4cfa-938d-58e0aa3aeb97'
      }
    ],
    resourceVersion: '1.11'
  };
}
