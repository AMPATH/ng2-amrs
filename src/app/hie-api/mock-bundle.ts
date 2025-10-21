import { FhirBundle } from '../models/hie-shr.model';

export const mockBundle: FhirBundle = {
  resourceType: 'Bundle',
  type: 'collection',
  timestamp: '2025-10-21T10:56:25.698Z',
  entry: [
    {
      fullUrl:
        'https://kenya-shr.kenya-hie.health/fhir/Patient/CR2630078966873-7',
      resource: {
        resourceType: 'Patient',
        id: 'CR2630078966873-7',
        meta: {
          versionId: '5',
          lastUpdated: '2025-09-11T15:04:12.607+00:00',
          source: '#e54e5f2ad5c3f08e',
          profile: [
            'https://mis.apeiro-digital.com/fhir/StructureDefinition/patient%7C1.0.0'
          ]
        },
        identifier: [
          {
            use: 'official',
            value: 'CR2630078966873-7'
          }
        ],
        name: [
          {
            text: 'Faith Wanjiru Kamau',
            family: 'Kamau',
            given: ['Faith', 'Wanjiru']
          }
        ],
        gender: 'female',
        birthDate: '1989-11-07'
      },
      request: {
        method: 'POST',
        url: 'Patient'
      }
    },
    {
      fullUrl:
        'https://kenya-shr.kenya-hie.health/fhir/ServiceRequest/13596068',
      resource: {
        resourceType: 'ServiceRequest',
        id: '13596068',
        meta: {
          versionId: '1',
          lastUpdated: '2025-09-10T19:43:30.158+00:00',
          source: '#435f150eae5dd247'
        },
        identifier: [
          {
            system: 'http://api:5988/#/reports',
            value: 'ada32034-9fc7-4d31-b811-5a4745a58972'
          }
        ],
        status: 'active',
        intent: 'order',
        category: [
          {
            coding: [
              {
                system:
                  'https://nhts.dha.go.ke/orgs/WHO/sources/ICHI/concepts/',
                code: '28023',
                display: 'Outpatient Department'
              }
            ],
            text: 'Triage'
          }
        ],
        priority: 'urgent',
        subject: {
          reference: 'Patient/CR2630078966873-7',
          type: 'Patient',
          identifier: {
            use: 'official',
            system: 'https://uat.dha.go.ke/v1/ref/client-registry/fetch-client',
            value: 'CR2630078966873-7'
          },
          display: 'Faith Wanjiru Kamau'
        },
        occurrencePeriod: {
          start: '2025-09-10',
          end: '2025-09-13'
        },
        authoredOn: '2025-08-29T00:00:00.000000Z',
        requester: {
          reference: 'Organization/123457',
          type: 'Organization',
          identifier: {
            use: 'official',
            system:
              'https://kmhfr.health.go.ke/api/chul/units/?format=JSON&code=123457',
            value: '123457'
          },
          display: 'Karatina'
        },
        performer: [
          {
            reference: 'Organization/FID-47-118374-5',
            type: 'Organization',
            identifier: {
              use: 'official',
              system: 'https://uat.dha.go.ke/v1/ref/facility-search',
              value: 'FID-47-118374-5'
            },
            display: 'Tiberbu Dev Hospital'
          }
        ],
        reasonCode: [
          {
            coding: [
              {
                system:
                  'https://nhts.dha.go.ke/orgs/WHO/sources/ICHI/concepts/',
                code: '386661006',
                display: 'Blood Pressure'
              }
            ],
            text: 'Blood Pressure'
          },
          {
            coding: [
              {
                system:
                  'https://nhts.dha.go.ke/orgs/WHO/sources/ICHI/concepts/',
                code: '405729008',
                display: 'Hematochezia'
              }
            ],
            text: 'Hematochezia'
          }
        ],
        supportingInfo: [
          {
            reference: 'Person/placeholder-chp-id',
            identifier: {
              system: 'https://chpregistry.echis.go.ke/chp_registry/apis/',
              value: 'placeholder-chp-id'
            },
            display: 'CHP'
          }
        ],
        note: [
          {
            text: 'fever duration: 14, diarrhea duration: 14'
          }
        ]
      },
      request: {
        method: 'POST',
        url: 'ServiceRequest'
      }
    },
    {
      fullUrl:
        'https://kenya-shr.kenya-hie.health/fhir/ServiceRequest/13596073',
      resource: {
        resourceType: 'ServiceRequest',
        id: '13596073',
        meta: {
          versionId: '1',
          lastUpdated: '2025-09-10T19:47:08.614+00:00',
          source: '#a698c155952ab12d'
        },
        identifier: [
          {
            system: 'https://hmis.tiberbu.app/app/patient-referral',
            value: '1loup0baqs'
          }
        ],
        basedOn: [
          {
            type: 'CarePlan',
            identifier: {
              system: 'http://api:5988/#/reports',
              value: 'ada32034-9fc7-4d31-b811-5a4745a58972'
            }
          }
        ],
        status: 'active',
        intent: 'order',
        category: [
          {
            coding: [
              {
                system:
                  'https://nhdd-api.health.go.ke/orgs/MOH-KENYA/sources/nhdd/concepts/',
                code: 'Maternal and Child Health',
                display: 'Maternal and Child Health'
              }
            ],
            text: 'Maternal and Child Health'
          }
        ],
        priority: 'urgent',
        subject: {
          reference: 'Patient/CR2630078966873-7',
          type: 'Patient',
          identifier: {
            use: 'official',
            system:
              'https://dhpstagingapi.health.go.ke/partners/registry/search/upi/CR2630078966873-7',
            value: 'CR2630078966873-7'
          },
          display: 'CR2630078966873-7'
        },
        occurrencePeriod: {
          start: '2025-09-10',
          end: '2025-09-13'
        },
        authoredOn: '2025-09-10',
        requester: {
          reference: 'Organization/FID-29-116783-1',
          type: 'Organization',
          identifier: {
            use: 'official',
            system:
              ' https://uat.dha.go.ke/v1/ref/facility-searchFID-29-116783-1',
            value: 'FID-29-116783-1'
          }
        },
        performer: [
          {
            reference: 'Organization/123457',
            type: 'Organization',
            identifier: {
              use: 'official',
              system:
                'https://api.kmhfl.health.go.ke/api/chul/units/?format=JSON&code=123457',
              value: '123457'
            },
            display: 'Karatina'
          }
        ],
        reasonCode: [
          {
            coding: [
              {
                system:
                  'https://nhdd-api.health.go.ke/orgs/MOH-KENYA/sources/nhdd/concepts/',
                code: 'MCH',
                display: 'MCH'
              }
            ],
            text: 'MCH'
          }
        ],
        supportingInfo: [
          {
            reference: 'Organization/FID-29-116783-1',
            type: 'Organization',
            identifier: {
              use: 'official',
              system:
                ' https://uat.dha.go.ke/v1/ref/facility-searchFID-29-116783-1',
              value: 'FID-29-116783-1'
            }
          },
          {
            type: 'Practitioner',
            identifier: {
              system: 'https://api.dha.go.ke/v2/fhir/Practitioner',
              value: 'PUID-0004038-7 - Duncan N'
            }
          }
        ],
        note: [
          {
            text: 'Test at night for tomorrows presentation'
          }
        ]
      },
      request: {
        method: 'POST',
        url: 'ServiceRequest'
      }
    },
    {
      fullUrl: 'https://kenya-shr.kenya-hie.health/fhir/Encounter/13596220',
      resource: {
        resourceType: 'Encounter',
        id: '13596220',
        meta: {
          versionId: '1',
          lastUpdated: '2025-09-10T19:45:01.018+00:00',
          source: '#2e08436a00523b57'
        },
        identifier: [
          {
            system: 'https://hmis.tiberbu.app',
            value: 'Patient-Appointment-HLC-APP-250910-495192-8737-07378'
          }
        ],
        status: 'finished',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'OP',
          display: 'outpatient encounter'
        },
        type: [
          {
            coding: [
              {
                system: 'https://shr.kenya-hie.health/encounter-types',
                code: '367336001',
                display: 'MCH - TDH'
              }
            ]
          }
        ],
        priority: {
          coding: [
            {
              system: 'https://hl7.org/fhir/R4/v3/ActPriority/vs.html',
              code: 'routine',
              display: 'routine'
            }
          ]
        },
        subject: {
          reference: 'Patient/CR2630078966873-7',
          identifier: {
            system: 'https://cr.kenya-hie.health/api/v4/Patient',
            value: 'CR2630078966873-7'
          }
        },
        participant: [
          {
            individual: {
              identifier: {
                system: 'https://hwr.kenya-hie.health/api/v4/Practitioner',
                value: 'PUID-0010424-1'
              }
            }
          }
        ],
        period: {
          start: '2025-09-10',
          end: '2025-09-11T00:00:00'
        },
        serviceProvider: {
          reference:
            'https://fr.kenya-hie.health/api/v4/Organization/FID-14-114892-9',
          identifier: {
            system: 'https://fr.kenya-hie.health/api/v4/Organization',
            value: 'FID-14-114892-9'
          }
        }
      },
      request: {
        method: 'POST',
        url: 'Encounter'
      }
    },
    {
      fullUrl:
        'https://kenya-shr.kenya-hie.health/fhir/ServiceRequest/13598613',
      resource: {
        resourceType: 'ServiceRequest',
        id: '13598613',
        meta: {
          versionId: '2',
          lastUpdated: '2025-10-21T10:01:39.163+00:00',
          source: '#f200ee460594dac7'
        },
        identifier: [
          {
            system: 'https://hmis.tiberbu.app/app/patient-referral',
            value: '3bl8oct7bj'
          }
        ],
        status: 'completed',
        intent: 'order',
        category: [
          {
            coding: [
              {
                system:
                  'https://nhdd-api.health.go.ke/orgs/MOH-KENYA/sources/nhdd/concepts/',
                code: 'Triage',
                display: 'Triage'
              }
            ],
            text: 'Triage'
          }
        ],
        priority: 'urgent',
        subject: {
          reference: 'Patient/CR2630078966873-7',
          type: 'Patient',
          identifier: {
            use: 'official',
            system: 'https://uat.dha.go.ke/v1/ref/patient/CR2630078966873-7',
            value: 'CR2630078966873-7'
          },
          display: 'Faith Wanjiru Kamau'
        },
        occurrencePeriod: {
          start: '2025-10-21',
          end: '2025-10-24'
        },
        authoredOn: '2025-10-21',
        requester: {
          reference: 'Organization/FID-20-114817-8',
          type: 'Organization',
          identifier: {
            use: 'official',
            system:
              'https://uat.dha.go.ke/v1/ref/facility-search/FID-20-114817-8',
            value: 'FID-20-114817-8'
          },
          display: 'KUTUS HEALTH CENTRE'
        },
        performer: [
          {
            reference: 'Organization/123457',
            type: 'Organization',
            identifier: {
              use: 'official',
              system:
                'https://api.kmhfl.health.go.ke/api/facilities/facilities/?format=JSON&code=123457',
              value: '123457'
            },
            display: 'Tiberbu Dev Hospital'
          }
        ],
        reasonCode: [
          {
            coding: [
              {
                system:
                  'https://nhdd-api.health.go.ke/orgs/MOH-KENYA/sources/nhdd/concepts/',
                code: 'Blood Pressure',
                display: 'Blood Pressure'
              }
            ],
            text: 'Blood Pressure'
          }
        ],
        note: [
          {
            text: 'fever duration: 14, diarrhea duration: 14'
          }
        ]
      },
      request: {
        method: 'POST',
        url: 'ServiceRequest'
      }
    },
    {
      fullUrl: 'https://kenya-shr.kenya-hie.health/fhir/Encounter/13635968',
      resource: {
        resourceType: 'Encounter',
        id: '13635968',
        meta: {
          versionId: '1',
          lastUpdated: '2025-09-11T15:00:52.874+00:00',
          source: '#27d8aac89d25b966'
        },
        identifier: [
          {
            system: 'https://hmis.tiberbu.app',
            value: 'Patient-Appointment-HLC-APP-250911-845737-8737-07378'
          }
        ],
        status: 'finished',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'OP',
          display: 'outpatient encounter'
        },
        type: [
          {
            coding: [
              {
                system: 'https://shr.kenya-hie.health/encounter-types',
                code: '367336001',
                display: 'MCH - TDH'
              }
            ]
          }
        ],
        priority: {
          coding: [
            {
              system: 'https://hl7.org/fhir/R4/v3/ActPriority/vs.html',
              code: 'routine',
              display: 'routine'
            }
          ]
        },
        subject: {
          reference: 'Patient/CR2630078966873-7',
          identifier: {
            system: 'https://cr.kenya-hie.health/api/v4/Patient',
            value: 'CR2630078966873-7'
          }
        },
        participant: [
          {
            individual: {
              identifier: {
                system: 'https://hwr.kenya-hie.health/api/v4/Practitioner',
                value: 'PUID-0010424-1'
              }
            }
          }
        ],
        period: {
          start: '2025-09-11',
          end: '2025-09-12T00:00:00'
        },
        serviceProvider: {
          reference:
            'https://fr.kenya-hie.health/api/v4/Organization/FID-14-114892-9',
          identifier: {
            system: 'https://fr.kenya-hie.health/api/v4/Organization',
            value: 'FID-14-114892-9'
          }
        }
      },
      request: {
        method: 'POST',
        url: 'Encounter'
      }
    },
    {
      fullUrl:
        'https://kenya-shr.kenya-hie.health/fhir/ServiceRequest/13635969',
      resource: {
        resourceType: 'ServiceRequest',
        id: '13635969',
        meta: {
          versionId: '1',
          lastUpdated: '2025-09-11T15:04:14.652+00:00',
          source: '#856b814cc1d2e05d'
        },
        identifier: [
          {
            system: 'https://hmis.tiberbu.app/app/patient-referral',
            value: '9rpa0h63vl'
          }
        ],
        basedOn: [
          {
            type: 'CarePlan',
            identifier: {
              system: 'http://api:5988/#/reports',
              value: 'ada32034-9fc7-4d31-b811-5a4745a58972'
            }
          }
        ],
        status: 'active',
        intent: 'order',
        category: [
          {
            coding: [
              {
                system:
                  'https://nhdd-api.health.go.ke/orgs/MOH-KENYA/sources/nhdd/concepts/',
                code: 'Disease Prevention',
                display: 'Disease Prevention'
              }
            ],
            text: 'Disease Prevention'
          }
        ],
        priority: 'urgent',
        subject: {
          reference: 'Patient/CR2630078966873-7',
          type: 'Patient',
          identifier: {
            use: 'official',
            system: 'https://uat.dha.go.ke/v1/ref/patient/CR2630078966873-7',
            value: 'CR2630078966873-7'
          },
          display: 'Faith Wanjiru Kamau'
        },
        occurrencePeriod: {
          start: '2025-09-11',
          end: '2025-09-14'
        },
        authoredOn: '2025-09-11',
        requester: {
          reference: 'Organization/FID-29-116783-1',
          type: 'Organization',
          identifier: {
            use: 'official',
            system:
              'https://uat.dha.go.ke/v1/ref/facility-search/FID-29-116783-1',
            value: 'FID-29-116783-1'
          },
          display: 'SANGALO DISPENSARY'
        },
        performer: [
          {
            reference: 'Organization/FID-14-114892-9',
            type: 'Organization',
            identifier: {
              use: 'official',
              system:
                'https://api.kmhfl.health.go.ke/api/chul/units/?format=JSON&code=FID-14-114892-9',
              value: 'FID-14-114892-9'
            },
            display: 'Mwea'
          }
        ],
        reasonCode: [
          {
            coding: [
              {
                system:
                  'https://nhdd-api.health.go.ke/orgs/MOH-KENYA/sources/nhdd/concepts/',
                code: 'DP',
                display: 'DP'
              }
            ],
            text: 'DP'
          }
        ],
        supportingInfo: [
          {
            reference: 'Practitioner/PUID-0195231-7',
            type: 'Practitioner',
            identifier: {
              use: 'official',
              system:
                'https://uat.dha.go.ke/v1/ref/practitioner/PUID-0195231-7',
              value: 'PUID-0195231-7'
            },
            display: 'Mark N'
          }
        ],
        note: [
          {
            text: 'Make sure the dose is complete. Check her pressure regularly'
          }
        ]
      },
      request: {
        method: 'POST',
        url: 'ServiceRequest'
      }
    },
    {
      fullUrl: 'https://kenya-shr.kenya-hie.health/fhir/Encounter/14281885',
      resource: {
        resourceType: 'Encounter',
        id: '14281885',
        meta: {
          versionId: '1',
          lastUpdated: '2025-10-04T01:56:01.386+00:00',
          source: '#e80ddf971c667709'
        },
        identifier: [
          {
            system: 'https://training.tiberbu.app/',
            value: 'Patient-Appointment-HLC-APP-251002-978453-8737-29205'
          }
        ],
        status: 'finished',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'OP',
          display: 'outpatient encounter'
        },
        type: [
          {
            coding: [
              {
                system: 'https://shr.kenya-hie.health/encounter-types',
                code: '367336001',
                display: 'MCH - THNET'
              }
            ]
          }
        ],
        priority: {
          coding: [
            {
              system: 'https://hl7.org/fhir/R4/v3/ActPriority/vs.html',
              code: 'routine',
              display: 'routine'
            }
          ]
        },
        subject: {
          reference: 'Patient/CR2630078966873-7',
          identifier: {
            system: 'https://cr.kenya-hie.health/api/v4/Patient',
            value: 'CR2630078966873-7'
          }
        },
        participant: [
          {
            individual: {
              identifier: {
                system: 'https://hwr.kenya-hie.health/api/v4/Practitioner',
                value: 'PUID-0010701-2'
              }
            }
          }
        ],
        period: {
          start: '2025-10-02',
          end: '2025-10-05T00:00:00'
        },
        serviceProvider: {
          reference:
            'https://fr.kenya-hie.health/api/v4/Organization/FID-20-114807-9',
          identifier: {
            system: 'https://fr.kenya-hie.health/api/v4/Organization',
            value: 'FID-20-114807-9'
          }
        }
      },
      request: {
        method: 'POST',
        url: 'Encounter'
      }
    },
    {
      fullUrl: 'https://kenya-shr.kenya-hie.health/fhir/Encounter/14579491',
      resource: {
        resourceType: 'Encounter',
        id: '14579491',
        meta: {
          versionId: '1',
          lastUpdated: '2025-10-21T09:25:15.794+00:00',
          source: '#797f9340c0236890'
        },
        identifier: [
          {
            system: 'https://hmis.tiberbu.app',
            value: 'Patient-Appointment-HLC-APP-251021-712245-8737-07378'
          }
        ],
        status: 'finished',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'OP',
          display: 'outpatient encounter'
        },
        type: [
          {
            coding: [
              {
                system: 'https://shr.kenya-hie.health/encounter-types',
                code: '367336001',
                display: 'MCH - TDH'
              }
            ]
          }
        ],
        priority: {
          coding: [
            {
              system: 'https://hl7.org/fhir/R4/v3/ActPriority/vs.html',
              code: 'routine',
              display: 'routine'
            }
          ]
        },
        subject: {
          reference: 'Patient/CR2630078966873-7',
          identifier: {
            system: 'https://cr.kenya-hie.health/api/v4/Patient',
            value: 'CR2630078966873-7'
          }
        },
        participant: [
          {
            individual: {
              identifier: {
                system: 'https://hwr.kenya-hie.health/api/v4/Practitioner',
                value: 'PUID-0010424-1'
              }
            }
          }
        ],
        period: {
          start: '2025-10-21',
          end: '2025-10-22T00:00:00'
        },
        serviceProvider: {
          reference:
            'https://fr.kenya-hie.health/api/v4/Organization/FID-20-114817-8',
          identifier: {
            system: 'https://fr.kenya-hie.health/api/v4/Organization',
            value: 'FID-20-114817-8'
          }
        }
      },
      request: {
        method: 'POST',
        url: 'Encounter'
      }
    },
    {
      fullUrl:
        'https://kenya-shr.kenya-hie.health/fhir/ServiceRequest/14580205',
      resource: {
        resourceType: 'ServiceRequest',
        id: '14580205',
        meta: {
          versionId: '1',
          lastUpdated: '2025-10-21T10:03:25.267+00:00',
          source: '#030a0c9d6e329647'
        },
        identifier: [
          {
            system: 'https://hmis.tiberbu.app/app/patient-referral',
            value: 'c1hap3vf6c'
          }
        ],
        basedOn: [
          {
            type: 'CarePlan',
            identifier: {
              system: 'http://api:5988/#/reports',
              value: 'ada32034-9fc7-4d31-b811-5a4745a58972'
            }
          }
        ],
        status: 'active',
        intent: 'order',
        category: [
          {
            coding: [
              {
                system:
                  'https://nhdd-api.health.go.ke/orgs/MOH-KENYA/sources/nhdd/concepts/',
                code: 'Community Health Services',
                display: 'Community Health Services'
              }
            ],
            text: 'Community Health Services'
          }
        ],
        priority: 'urgent',
        subject: {
          reference: 'Patient/CR2630078966873-7',
          type: 'Patient',
          identifier: {
            use: 'official',
            system: 'https://uat.dha.go.ke/v1/ref/patient/CR2630078966873-7',
            value: 'CR2630078966873-7'
          },
          display: 'Faith Wanjiru Kamau'
        },
        occurrencePeriod: {
          start: '2025-10-21',
          end: '2025-10-24'
        },
        authoredOn: '2025-10-21',
        requester: {
          reference: 'Organization/FID-20-114817-8',
          type: 'Organization',
          identifier: {
            use: 'official',
            system:
              'https://uat.dha.go.ke/v1/ref/facility-search/FID-20-114817-8',
            value: 'FID-20-114817-8'
          },
          display: 'KUTUS HEALTH CENTRE'
        },
        performer: [
          {
            reference: 'Organization/FID-20-114817-8',
            type: 'Organization',
            identifier: {
              use: 'official',
              system:
                'https://api.kmhfl.health.go.ke/api/chul/units/?format=JSON&code=FID-20-114817-8',
              value: 'FID-20-114817-8'
            },
            display: 'Githunguri'
          }
        ],
        reasonCode: [
          {
            coding: [
              {
                system:
                  'https://nhdd-api.health.go.ke/orgs/MOH-KENYA/sources/nhdd/concepts/',
                code: 'CHS',
                display: 'CHS'
              }
            ],
            text: 'CHS'
          }
        ],
        supportingInfo: [
          {
            reference: 'Practitioner/PUID-0195231-7',
            type: 'Practitioner',
            identifier: {
              use: 'official',
              system:
                'https://uat.dha.go.ke/v1/ref/practitioner/PUID-0195231-7',
              value: 'PUID-0195231-7'
            },
            display: 'Mark N'
          }
        ],
        note: [
          {
            text: 'yo'
          }
        ]
      },
      request: {
        method: 'POST',
        url: 'ServiceRequest'
      }
    },
    {
      fullUrl:
        'https://kenya-shr.kenya-hie.health/fhir/MedicationRequest/14580547',
      resource: {
        resourceType: 'MedicationRequest',
        id: '14580547',
        meta: {
          versionId: '1',
          lastUpdated: '2025-10-21T10:36:21.156+00:00',
          source: '#162d8d62c57b6d0d',
          profile: ['http://hl7.org/fhir/StructureDefinition/patient-diagnosis']
        },
        identifier: [
          {
            use: 'official',
            system: 'https://hmis.tiberbu.app',
            value: 'Drug-Prescription-9422cdc2554324f9b006-07378'
          }
        ],
        status: 'active',
        intent: 'order',
        priority: 'routine',
        medicationCodeableConcept: {
          coding: [
            {
              system: 'https://openconceptlab.org/orgs/CIEL/sources/CIEL',
              code: 'Item(Paracetamol/Tramadol (325mg/37.5mg))',
              display: 'Paracetamol/Tramadol (325mg/37.5mg)'
            }
          ],
          text: 'Paracetamol/Tramadol (325mg/37.5mg)'
        },
        subject: {
          reference: 'Patient/CR2630078966873-7',
          type: 'Patient',
          identifier: {
            use: 'official',
            system: 'https://sandbox.kenya-hie.health/api/v4/Patient',
            value: 'CR2630078966873-7'
          }
        },
        encounter: {
          reference:
            'Encounter/Patient-Appointment-HLC-APP-251021-674651-8737-07378',
          display: 'Faith Wanjiru Kamau with Jeremia S at Tiberbu Dev Hospital'
        },
        authoredOn: '2025-10-21T13:35:58.597379',
        requester: {
          reference:
            'https://hwr.kenya-hie.health/api/v4/Practitioner/PUID-0001985-2',
          type: 'Practitioner',
          identifier: {
            system: 'https://hwr.kenya-hie.health/api/v4/Practitioner',
            value: 'PUID-0001985-2'
          }
        },
        note: [
          {
            authorString: 'Jeremia S',
            time: '2025-10-21T13:35:58.597379',
            text:
              'Oral Paracetamol/Tramadol (325mg/37.5mg), Yellow Coloured, Capsule Shaped, Biconvex, Film Coated Tablet Plain On One Side And Break Line On Other Side., Opioids 3 for 3 Day 1-1-1'
          }
        ],
        dosageInstruction: [
          {
            text: 'Paracetamol/Tramadol (325mg/37.5mg) 0',
            timing: {
              repeat: {
                duration: 3,
                durationUnit: 'd'
              },
              code: {
                coding: [
                  {
                    system: 'https://openconceptlab.org/orgs/CIEL/sources/CIEL',
                    code: '160858',
                    display: '0'
                  }
                ],
                text: '0'
              }
            },
            asNeededBoolean: false,
            route: {
              coding: [
                {
                  system: 'https://openconceptlab.org/orgs/CIEL/sources/CIEL',
                  code: '160240',
                  display: 'Oral'
                }
              ],
              text: 'Oral'
            },
            doseAndRate: [
              {
                doseQuantity: {
                  value: 1,
                  unit: 'Tablet',
                  code: 'abcde'
                }
              }
            ]
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: '2025-10-21T13:35:58.598463'
          },
          numberOfRepeatsAllowed: 0,
          quantity: {
            value: 0,
            unit: 'Tablet',
            code: 'abcde'
          }
        }
      },
      request: {
        method: 'POST',
        url: 'MedicationRequest'
      }
    },
    {
      fullUrl:
        'https://kenya-shr.kenya-hie.health/fhir/MedicationRequest/14580705',
      resource: {
        resourceType: 'MedicationRequest',
        id: '14580705',
        meta: {
          versionId: '1',
          lastUpdated: '2025-10-21T10:45:59.262+00:00',
          source: '#c1d56495b02c8e49',
          profile: ['http://hl7.org/fhir/StructureDefinition/patient-diagnosis']
        },
        identifier: [
          {
            use: 'official',
            system: 'https://hmis.tiberbu.app',
            value: 'Drug-Prescription-a6c2827b4a6f58d2e94a-07378'
          }
        ],
        status: 'active',
        intent: 'order',
        priority: 'routine',
        medicationCodeableConcept: {
          coding: [
            {
              system: 'https://openconceptlab.org/orgs/CIEL/sources/CIEL',
              code: 'Item(Paracetamol/Tramadol (325mg/37.5mg))',
              display: 'Paracetamol/Tramadol (325mg/37.5mg)'
            }
          ],
          text: 'Paracetamol/Tramadol (325mg/37.5mg)'
        },
        subject: {
          reference: 'Patient/CR2630078966873-7',
          type: 'Patient',
          identifier: {
            use: 'official',
            system: 'https://sandbox.kenya-hie.health/api/v4/Patient',
            value: 'CR2630078966873-7'
          }
        },
        encounter: {
          reference:
            'Encounter/Patient-Appointment-HLC-APP-251021-674651-8737-07378',
          display: 'Faith Wanjiru Kamau with Jeremia S at Tiberbu Dev Hospital'
        },
        authoredOn: '2025-10-21T13:45:46.413884',
        requester: {
          reference:
            'https://hwr.kenya-hie.health/api/v4/Practitioner/PUID-0001985-2',
          type: 'Practitioner',
          identifier: {
            system: 'https://hwr.kenya-hie.health/api/v4/Practitioner',
            value: 'PUID-0001985-2'
          }
        },
        note: [
          {
            authorString: 'Jeremia S',
            time: '2025-10-21T13:45:46.413884',
            text:
              'Oral Paracetamol/Tramadol (325mg/37.5mg), Yellow Coloured, Capsule Shaped, Biconvex, Film Coated Tablet Plain On One Side And Break Line On Other Side., Opioids 2 for 5 Day TD - Thrice daily'
          }
        ],
        dosageInstruction: [
          {
            text: 'Paracetamol/Tramadol (325mg/37.5mg) 0',
            timing: {
              repeat: {
                duration: 5,
                durationUnit: 'd'
              },
              code: {
                coding: [
                  {
                    system: 'https://openconceptlab.org/orgs/CIEL/sources/CIEL',
                    code: '160858',
                    display: '0'
                  }
                ],
                text: '0'
              }
            },
            asNeededBoolean: false,
            route: {
              coding: [
                {
                  system: 'https://openconceptlab.org/orgs/CIEL/sources/CIEL',
                  code: '160240',
                  display: 'Oral'
                }
              ],
              text: 'Oral'
            },
            doseAndRate: [
              {
                doseQuantity: {
                  value: 1,
                  unit: 'Tablet',
                  code: 'abcde'
                }
              }
            ]
          }
        ],
        dispenseRequest: {
          validityPeriod: {
            start: '2025-10-21T13:45:46.414951'
          },
          numberOfRepeatsAllowed: 0,
          quantity: {
            value: 0,
            unit: 'Tablet',
            code: 'abcde'
          }
        }
      },
      request: {
        method: 'POST',
        url: 'MedicationRequest'
      }
    }
  ]
};
