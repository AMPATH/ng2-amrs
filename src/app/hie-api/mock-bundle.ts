import { FhirBundle } from '../models/hie-shr.model';

export const mockBundle: FhirBundle = {
  resourceType: 'Bundle',
  id: '38a4883c-066b-442e-bfff-f2302eff8f3f',
  meta: {
    lastUpdated: '2025-10-06T03:12:48.137+00:00'
  },
  type: 'searchset',
  link: [
    {
      relation: 'self',
      url:
        'https://kenya-shr.kenya-hie.health/fhir/Patient/CR7671914222027-5/$everything?_type=DocumentReference%2CEncounter%2CCondition%2CServiceRequest%2CProcedure%2CDiagnosticReport%2CMedicationRequest%2CMedicationDispense&cr_id=CR7671914222027-5'
    },
    {
      relation: 'next',
      url:
        'https://kenya-shr.kenya-hie.health/fhir?_getpages=38a4883c-066b-442e-bfff-f2302eff8f3f&_getpagesoffset=20&_count=20&_pretty=true&_bundletype=searchset'
    }
  ],
  entry: [
    {
      fullUrl:
        'https://kenya-shr.kenya-hie.health/fhir/Patient/CR7671914222027-5',
      resource: {
        resourceType: 'Patient',
        id: 'CR7671914222027-5',
        meta: {
          versionId: '4',
          lastUpdated: '2025-06-10T09:55:32.368+00:00',
          source: '#275dcd9fa63e11ce',
          profile: [
            'https://mis.apeiro-digital.com/fhir/StructureDefinition/patient%7C1.0.0'
          ]
        },
        identifier: [
          {
            use: 'official',
            system:
              'https://qa-mis.apeiro-digital.com/fhir/identifier/shanumber',
            value: 'CR7671914222027-5'
          }
        ],
        name: [
          {
            text: 'THOMAS SANG MWOGI',
            family: 'MWOGI',
            given: ['THOMAS', 'SANG']
          }
        ],
        gender: 'male',
        birthDate: '1982-05-02'
      },
      search: {
        mode: 'match'
      }
    },
    {
      fullUrl:
        'https://kenya-shr.kenya-hie.health/fhir/ServiceRequest/10165711',
      resource: {
        resourceType: 'ServiceRequest',
        id: '10165711',
        meta: {
          versionId: '1',
          lastUpdated: '2025-05-19T19:14:55.346+00:00',
          source: '#f350655efb6e5052'
        },
        identifier: [
          {
            system: 'https://hmis.tiberbu.app/app/patient-referral',
            value: '4ieu8o4eho'
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
                code: 'Diagnostic Tests/Studies',
                display: 'Diagnostic Tests/Studies'
              }
            ],
            text: 'Diagnostic Tests/Studies'
          }
        ],
        priority: 'urgent',
        subject: {
          reference: 'Patient/CR7671914222027-5',
          type: 'Patient',
          identifier: {
            use: 'official',
            system:
              'https://dhpstagingapi.health.go.ke/partners/registry/search/upi/TB7FVBKQJD7Y4FM',
            value: 'CR7671914222027-5'
          },
          display: 'CR7671914222027-5'
        },
        occurrencePeriod: {
          start: '2025-05-19',
          end: '2025-05-24'
        },
        authoredOn: '2025-05-19',
        requester: {
          reference: 'Organization/FID-20-118458-7',
          type: 'Organization',
          identifier: {
            use: 'official',
            system:
              'https://api.kmhfl.health.go.ke/api/facilities/facilities/?format=JSON&code=FID-20-118458-7',
            value: 'FID-20-118458-7'
          },
          display: 'KIANDAI DISPENSARY'
        },
        performer: [
          {
            reference: 'Organization/1234',
            type: 'Organization',
            identifier: {
              use: 'official',
              system:
                'https://api.kmhfl.health.go.ke/api/facilities/facilities',
              value: '1234'
            },
            display: 'EQUITY AFIA MEDICAL CENTRE-MWEMBE TAYARI'
          }
        ],
        reasonCode: [
          {
            coding: [
              {
                system:
                  'https://nhdd-api.health.go.ke/orgs/MOH-KENYA/sources/nhdd/concepts/',
                code:
                  '1A62.21-Late syphilis involving the musculoskeletal system',
                display:
                  '1A62.21-Late syphilis involving the musculoskeletal system'
              }
            ],
            text: '1A62.21-Late syphilis involving the musculoskeletal system'
          }
        ],
        note: [
          {
            text: 'none'
          }
        ]
      },
      search: {
        mode: 'match'
      }
    },
    {
      fullUrl: 'https://kenya-shr.kenya-hie.health/fhir/Encounter/10703794',
      resource: {
        resourceType: 'Encounter',
        id: '10703794',
        meta: {
          versionId: '1',
          lastUpdated: '2025-05-30T21:30:09.440+00:00',
          source: '#87dce9044d52812c'
        },
        identifier: [
          {
            system: 'https://hmis.tiberbu.app',
            value: 'Patient-Appointment-HLC-APP-250423-220458-0275-07378'
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
                display: 'OPD - TDH'
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
          reference: 'Patient/CR7671914222027-5',
          identifier: {
            system: 'https://cr.kenya-hie.health/api/v4/Patient',
            value: 'CR7671914222027-5'
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
          start: '2025-04-23',
          end: '2025-06-01T00:00:00'
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
      search: {
        mode: 'match'
      }
    },
    {
      fullUrl: 'https://kenya-shr.kenya-hie.health/fhir/Condition/10703797',
      resource: {
        resourceType: 'Condition',
        id: '10703797',
        meta: {
          versionId: '1',
          lastUpdated: '2025-05-30T21:30:09.529+00:00',
          source: '#87dce9044d52812c',
          profile: ['http://hl7.org/fhir/StructureDefinition/patient-diagnosis']
        },
        identifier: [
          {
            use: 'official',
            system: 'https://hmis.tiberbu.app',
            value: 'Symptom-Entry-5lq6riqufn-07378'
          }
        ],
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/condition-clinical',
              code: 'active',
              display: 'ACTIVE'
            }
          ]
        },
        verificationStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/condition-ver-status',
              code: 'provisional',
              display: 'Provisional'
            }
          ]
        },
        category: [
          {
            coding: [
              {
                system: 'http://hl7.org/fhir/ValueSet/condition-category',
                code: 'problem-list-item',
                display: 'Problem List Item'
              }
            ]
          }
        ],
        severity: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/condition-severity',
              code: 'moderate',
              display: 'Moderate'
            }
          ]
        },
        code: {
          coding: [
            {
              system: 'https://openconceptlab.org/orgs/CIEL/sources/CIEL',
              code: '123565'
            }
          ]
        },
        subject: {
          reference: 'Patient/CR7671914222027-5',
          identifier: {
            system: 'https://cr.kenya-hie.health/api/v4/Patient',
            value: 'CR7671914222027-5'
          }
        },
        encounter: {
          reference:
            'Encounter/Patient-Appointment-HLC-APP-250423-220458-0275-07378',
          display: 'THOMAS SANG MWOGI with Thomas M'
        },
        onsetDateTime: '2025-04-23T18:34:23.544414',
        recordedDate: '2025-04-23T18:34:23.544414',
        note: [
          {
            authorString: 'Thomas M',
            time: '2025-04-23T18:34:23.544414',
            text: 'Cough 5/7\nHotness of body 1/7'
          }
        ]
      },
      search: {
        mode: 'match'
      }
    },
    {
      fullUrl: 'https://kenya-shr.kenya-hie.health/fhir/Condition/10703798',
      resource: {
        resourceType: 'Condition',
        id: '10703798',
        meta: {
          versionId: '1',
          lastUpdated: '2025-05-30T21:30:09.559+00:00',
          source: '#87dce9044d52812c',
          profile: ['http://hl7.org/fhir/StructureDefinition/patient-diagnosis']
        },
        identifier: [
          {
            use: 'official',
            system: 'https://hmis.tiberbu.app',
            value: 'Symptom-Entry-blms2ffd59-07378'
          }
        ],
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/condition-clinical',
              code: 'active',
              display: 'ACTIVE'
            }
          ]
        },
        verificationStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/condition-ver-status',
              code: 'provisional',
              display: 'Provisional'
            }
          ]
        },
        category: [
          {
            coding: [
              {
                system: 'http://hl7.org/fhir/ValueSet/condition-category',
                code: 'problem-list-item',
                display: 'Problem List Item'
              }
            ]
          }
        ],
        severity: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/condition-severity',
              code: 'moderate',
              display: 'Moderate'
            }
          ]
        },
        code: {
          coding: [
            {
              system: 'https://openconceptlab.org/orgs/CIEL/sources/CIEL',
              code: '123565'
            }
          ]
        },
        subject: {
          reference: 'Patient/CR7671914222027-5',
          identifier: {
            system: 'https://cr.kenya-hie.health/api/v4/Patient',
            value: 'CR7671914222027-5'
          }
        },
        encounter: {
          reference:
            'Encounter/Patient-Appointment-HLC-APP-250423-220458-0275-07378',
          display: 'THOMAS SANG MWOGI with Thomas M'
        },
        onsetDateTime: '2025-04-23T18:34:23.544414',
        recordedDate: '2025-04-23T18:34:23.544414',
        note: [
          {
            authorString: 'Thomas M',
            time: '2025-04-23T18:34:23.544414',
            text: 'Cough 5/7\nHotness of body 1/7'
          }
        ]
      },
      search: {
        mode: 'match'
      }
    },
    {
      fullUrl: 'https://kenya-shr.kenya-hie.health/fhir/Condition/10703799',
      resource: {
        resourceType: 'Condition',
        id: '10703799',
        meta: {
          versionId: '1',
          lastUpdated: '2025-05-30T21:30:09.586+00:00',
          source: '#87dce9044d52812c',
          profile: ['http://hl7.org/fhir/StructureDefinition/patient-diagnosis']
        },
        identifier: [
          {
            use: 'official',
            system: 'https://hmis.tiberbu.app',
            value: 'Diagnosis-Entry-2ojlarrh9l-07378'
          }
        ],
        clinicalStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/condition-clinical',
              code: 'active',
              display: 'ACTIVE'
            }
          ]
        },
        verificationStatus: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/condition-ver-status',
              code: 'provisional',
              display: 'Provisional'
            }
          ]
        },
        category: [
          {
            coding: [
              {
                system: 'http://hl7.org/fhir/ValueSet/condition-category',
                code: 'encounter-diagnosis',
                display: 'Encounter Diagnosis'
              }
            ]
          }
        ],
        severity: {
          coding: [
            {
              system:
                'http://terminology.hl7.org/CodeSystem/condition-severity',
              code: 'moderate',
              display: 'Moderate'
            }
          ]
        },
        code: {
          coding: [
            {
              system: 'https://openconceptlab.org/orgs/CIEL/sources/CIEL',
              code: 'CB03.0',
              display: 'Acute interstitial pneumonitis'
            }
          ],
          text: 'Acute interstitial pneumonitis'
        },
        subject: {
          reference: 'Patient/CR7671914222027-5',
          identifier: {
            system: 'https://cr.kenya-hie.health/api/v4/Patient',
            value: 'CR7671914222027-5'
          }
        },
        encounter: {
          reference:
            'Encounter/Patient-Appointment-HLC-APP-250423-220458-0275-07378',
          display: 'THOMAS SANG MWOGI with Thomas M'
        },
        onsetDateTime: '2025-04-23T18:34:23.544414',
        recordedDate: '2025-04-23T18:34:23.544414',
        note: [
          {
            authorString: 'Thomas M',
            time: '2025-04-23T18:34:23.544414',
            text:
              'Patient sick looking, febrile, pale and dehydrated.\n\nVital signs not looking good as shown. '
          }
        ]
      },
      search: {
        mode: 'match'
      }
    },
    {
      fullUrl:
        'https://kenya-shr.kenya-hie.health/fhir/ServiceRequest/10703911',
      resource: {
        resourceType: 'ServiceRequest',
        id: '10703911',
        meta: {
          versionId: '1',
          lastUpdated: '2025-05-30T21:30:09.938+00:00',
          source: '#87dce9044d52812c'
        },
        status: 'active',
        intent: 'original-order',
        subject: {
          reference: 'Patient/CR7671914222027-5',
          type: 'Patient',
          identifier: {
            use: 'official',
            system: 'https://api.dha.go.ke/v1/fhir/Patient',
            value: 'CR7671914222027-5'
          }
        },
        encounter: {
          reference:
            'Encounter/Patient-Appointment-HLC-APP-250423-220458-0275-07378',
          display: 'THOMAS SANG MWOGI with Thomas M'
        },
        occurrenceDateTime: '2025-04-23T18:45:41.785964',
        requester: {
          reference:
            'https://hwr.kenya-hie.health/api/v4/Practitioner/PUID-0195231-7',
          identifier: {
            system: 'https://hwr.kenya-hie.health/api/v4/Practitioner',
            value: 'PUID-0195231-7'
          }
        }
      },
      search: {
        mode: 'match'
      }
    },
    {
      fullUrl:
        'https://kenya-shr.kenya-hie.health/fhir/ServiceRequest/10703912',
      resource: {
        resourceType: 'ServiceRequest',
        id: '10703912',
        meta: {
          versionId: '1',
          lastUpdated: '2025-05-30T21:30:09.961+00:00',
          source: '#87dce9044d52812c'
        },
        contained: [
          {
            resourceType: 'Observation',
            id: 'fasting',
            status: 'final',
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '49541-6',
                  display: 'Fasting status - Reported'
                }
              ]
            },
            subject: {
              reference: 'Patient/CR7671914222027-5',
              type: 'Patient',
              identifier: {
                use: 'official',
                system: 'https://api.dha.go.ke/v1/fhir/Patient',
                value: 'CR7671914222027-5'
              }
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0136',
                  code: 'Y',
                  display: 'Yes'
                }
              ]
            }
          },
          {
            resourceType: 'Specimen',
            id: 'serum',
            identifier: [
              {
                system: 'http://acme.org/specimens',
                value: '20150107-0012'
              }
            ],
            type: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '119364003',
                  display: 'Serum sample'
                }
              ]
            },
            subject: {
              reference: 'Patient/CR7671914222027-5',
              type: 'Patient',
              identifier: {
                use: 'official',
                system: 'https://api.dha.go.ke/v1/fhir/Patient',
                value: 'CR7671914222027-5'
              }
            },
            collection: {
              collectedDateTime: '2025-04-23T18:49:23.443080'
            }
          }
        ],
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'PLAC'
                }
              ],
              text: 'Placer'
            },
            system: 'urn:oid:1.3.4.5.6.7',
            value: '2345234234234'
          }
        ],
        status: 'active',
        intent: 'original-order',
        subject: {
          reference: 'Patient/CR7671914222027-5',
          type: 'Patient',
          identifier: {
            use: 'official',
            system: 'https://api.dha.go.ke/v1/fhir/Patient',
            value: 'CR7671914222027-5'
          }
        },
        encounter: {
          reference:
            'Encounter/Patient-Appointment-HLC-APP-250423-220458-0275-07378',
          display: 'THOMAS SANG MWOGI with Thomas M'
        },
        occurrenceDateTime: '2025-04-23T18:49:23.443080',
        requester: {
          reference:
            'https://hwr.kenya-hie.health/api/v4/Practitioner/PUID-0195231-7',
          identifier: {
            system: 'https://hwr.kenya-hie.health/api/v4/Practitioner',
            value: 'PUID-0195231-7'
          }
        }
      },
      search: {
        mode: 'match'
      }
    },
    {
      fullUrl:
        'https://kenya-shr.kenya-hie.health/fhir/ServiceRequest/10703913',
      resource: {
        resourceType: 'ServiceRequest',
        id: '10703913',
        meta: {
          versionId: '1',
          lastUpdated: '2025-05-30T21:30:09.985+00:00',
          source: '#87dce9044d52812c'
        },
        contained: [
          {
            resourceType: 'Observation',
            id: 'fasting',
            status: 'final',
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '49541-6',
                  display: 'Fasting status - Reported'
                }
              ]
            },
            subject: {
              reference: 'Patient/CR7671914222027-5',
              type: 'Patient',
              identifier: {
                use: 'official',
                system: 'https://api.dha.go.ke/v1/fhir/Patient',
                value: 'CR7671914222027-5'
              }
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0136',
                  code: 'Y',
                  display: 'Yes'
                }
              ]
            }
          },
          {
            resourceType: 'Specimen',
            id: 'serum',
            identifier: [
              {
                system: 'http://acme.org/specimens',
                value: '20150107-0012'
              }
            ],
            type: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '119364003',
                  display: 'Serum sample'
                }
              ]
            },
            subject: {
              reference: 'Patient/CR7671914222027-5',
              type: 'Patient',
              identifier: {
                use: 'official',
                system: 'https://api.dha.go.ke/v1/fhir/Patient',
                value: 'CR7671914222027-5'
              }
            },
            collection: {
              collectedDateTime: '2025-04-23T18:49:24.003760'
            }
          }
        ],
        identifier: [
          {
            type: {
              coding: [
                {
                  system: 'http://terminology.hl7.org/CodeSystem/v2-0203',
                  code: 'PLAC'
                }
              ],
              text: 'Placer'
            },
            system: 'urn:oid:1.3.4.5.6.7',
            value: '2345234234234'
          }
        ],
        status: 'active',
        intent: 'original-order',
        subject: {
          reference: 'Patient/CR7671914222027-5',
          type: 'Patient',
          identifier: {
            use: 'official',
            system: 'https://api.dha.go.ke/v1/fhir/Patient',
            value: 'CR7671914222027-5'
          }
        },
        encounter: {
          reference:
            'Encounter/Patient-Appointment-HLC-APP-250423-220458-0275-07378',
          display: 'THOMAS SANG MWOGI with Thomas M'
        },
        occurrenceDateTime: '2025-04-23T18:49:24.003760',
        requester: {
          reference:
            'https://hwr.kenya-hie.health/api/v4/Practitioner/PUID-0195231-7',
          identifier: {
            system: 'https://hwr.kenya-hie.health/api/v4/Practitioner',
            value: 'PUID-0195231-7'
          }
        }
      },
      search: {
        mode: 'match'
      }
    },
    {
      fullUrl: 'https://kenya-shr.kenya-hie.health/fhir/Encounter/11206743',
      resource: {
        resourceType: 'Encounter',
        id: '11206743',
        meta: {
          versionId: '1',
          lastUpdated: '2025-06-06T21:00:48.500+00:00',
          source: '#d0181b11dd10290c'
        },
        identifier: [
          {
            system: 'https://hmis.tiberbu.app',
            value: 'Patient-Appointment-HLC-APP-250605-812327-0275-07378'
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
          reference: 'Patient/CR7671914222027-5',
          identifier: {
            system: 'https://cr.kenya-hie.health/api/v4/Patient',
            value: 'CR7671914222027-5'
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
          start: '2025-06-05',
          end: '2025-06-08T00:00:00'
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
      search: {
        mode: 'match'
      }
    },
    {
      fullUrl: 'https://kenya-shr.kenya-hie.health/fhir/Encounter/12332086',
      resource: {
        resourceType: 'Encounter',
        id: '12332086',
        meta: {
          versionId: '1',
          lastUpdated: '2025-07-31T13:48:46.261+00:00',
          source: '#989cf983d0c3448a'
        },
        identifier: [
          {
            system: 'https://training.tiberbu.app/',
            value: 'Patient-Appointment-HLC-APP-250731-714850-0275-29205'
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
                display: 'General OPD - THNET'
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
          reference: 'Patient/CR7671914222027-5',
          identifier: {
            system: 'https://cr.kenya-hie.health/api/v4/Patient',
            value: 'CR7671914222027-5'
          }
        },
        participant: [
          {
            individual: {
              identifier: {
                system: 'https://hwr.kenya-hie.health/api/v4/Practitioner'
              }
            }
          }
        ],
        period: {
          start: '2025-07-31',
          end: '2025-08-01T00:00:00'
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
      search: {
        mode: 'match'
      }
    },
    {
      fullUrl: 'https://kenya-shr.kenya-hie.health/fhir/Encounter/13830577',
      resource: {
        resourceType: 'Encounter',
        id: '13830577',
        meta: {
          versionId: '1',
          lastUpdated: '2025-09-22T17:17:45.650+00:00',
          source: '#56b273790ccff0be'
        },
        identifier: [
          {
            system: 'http://fhir.openmrs.org',
            value:
              'Patient-Appointment-HLC-APP-f0ce9125-4870-468d-acb7-a8c8d2d81169'
          }
        ],
        status: 'unknown',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'OP',
          display: 'outpatient encounter'
        },
        type: [
          {
            coding: [
              {
                system: 'http://fhir.openmrs.org/code-system/visit-type',
                code: 'd4ac2aa5-2899-42fb-b08a-d40161815b48',
                display: 'RETURN HIV CLINIC VISIT'
              }
            ]
          }
        ],
        subject: {
          reference: 'Patient/CR7671914222027-5',
          identifier: {
            system: 'https://cr.kenya-hie.health/api/v4/Patient',
            value: 'CR7671914222027-5'
          }
        },
        period: {
          start: '2025-09-19T11:32:33+03:00',
          end: '2025-09-21T00:15:57+03:00'
        },
        serviceProvider: {
          reference:
            'https://fr.kenya-hie.health/api/v4/Organization/FID-45-107983-8',
          identifier: {
            system: 'https://fr.kenya-hie.health/api/v4/Organization',
            value: 'FID-45-107983-8'
          }
        }
      },
      search: {
        mode: 'match'
      }
    },
    {
      fullUrl: 'https://kenya-shr.kenya-hie.health/fhir/Encounter/13830578',
      resource: {
        resourceType: 'Encounter',
        id: '13830578',
        meta: {
          versionId: '1',
          lastUpdated: '2025-09-22T17:17:45.712+00:00',
          source: '#56b273790ccff0be'
        },
        identifier: [
          {
            system: 'http://fhir.openmrs.org',
            value:
              'Patient-Appointment-HLC-APP-5c1bb851-68ec-49ee-a83b-1729fd0fb0b9'
          }
        ],
        status: 'unknown',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'OP',
          display: 'outpatient encounter'
        },
        type: [
          {
            coding: [
              {
                system: 'http://fhir.openmrs.org/code-system/encounter-type',
                code: '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
                display: 'ADULTRETURN'
              }
            ]
          }
        ],
        subject: {
          reference: 'Patient/CR7671914222027-5',
          identifier: {
            system: 'https://cr.kenya-hie.health/api/v4/Patient',
            value: 'CR7671914222027-5'
          }
        },
        participant: [
          {
            individual: {
              identifier: {
                system: 'https://hwr.kenya-hie.health/api/v4/Practitioner',
                value: 'PUID-0155222-4'
              }
            }
          }
        ],
        period: {
          start: '2025-09-19T11:32:42+03:00'
        },
        serviceProvider: {
          reference:
            'https://fr.kenya-hie.health/api/v4/Organization/FID-45-107983-8',
          identifier: {
            system: 'https://fr.kenya-hie.health/api/v4/Organization',
            value: 'FID-45-107983-8'
          }
        }
      },
      search: {
        mode: 'match'
      }
    },
    {
      fullUrl: 'https://kenya-shr.kenya-hie.health/fhir/Encounter/13830908',
      resource: {
        resourceType: 'Encounter',
        id: '13830908',
        meta: {
          versionId: '1',
          lastUpdated: '2025-09-22T17:17:36.573+00:00',
          source: '#e0b118f2b5308d46'
        },
        identifier: [
          {
            system: 'http://fhir.openmrs.org',
            value:
              'Patient-Appointment-HLC-APP-f0ce9125-4870-468d-acb7-a8c8d2d81169'
          }
        ],
        status: 'unknown',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'OP',
          display: 'outpatient encounter'
        },
        type: [
          {
            coding: [
              {
                system: 'http://fhir.openmrs.org/code-system/visit-type',
                code: 'd4ac2aa5-2899-42fb-b08a-d40161815b48',
                display: 'RETURN HIV CLINIC VISIT'
              }
            ]
          }
        ],
        subject: {
          reference: 'Patient/CR7671914222027-5',
          identifier: {
            system: 'https://cr.kenya-hie.health/api/v4/Patient',
            value: 'CR7671914222027-5'
          }
        },
        period: {
          start: '2025-09-19T11:32:33+03:00',
          end: '2025-09-21T00:15:57+03:00'
        },
        serviceProvider: {
          reference:
            'https://fr.kenya-hie.health/api/v4/Organization/FID-45-107983-8',
          identifier: {
            system: 'https://fr.kenya-hie.health/api/v4/Organization',
            value: 'FID-45-107983-8'
          }
        }
      },
      search: {
        mode: 'match'
      }
    },
    {
      fullUrl: 'https://kenya-shr.kenya-hie.health/fhir/Encounter/13830909',
      resource: {
        resourceType: 'Encounter',
        id: '13830909',
        meta: {
          versionId: '1',
          lastUpdated: '2025-09-22T17:17:36.650+00:00',
          source: '#e0b118f2b5308d46'
        },
        identifier: [
          {
            system: 'http://fhir.openmrs.org',
            value:
              'Patient-Appointment-HLC-APP-5c1bb851-68ec-49ee-a83b-1729fd0fb0b9'
          }
        ],
        status: 'unknown',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'OP',
          display: 'outpatient encounter'
        },
        type: [
          {
            coding: [
              {
                system: 'http://fhir.openmrs.org/code-system/encounter-type',
                code: '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
                display: 'ADULTRETURN'
              }
            ]
          }
        ],
        subject: {
          reference: 'Patient/CR7671914222027-5',
          identifier: {
            system: 'https://cr.kenya-hie.health/api/v4/Patient',
            value: 'CR7671914222027-5'
          }
        },
        participant: [
          {
            individual: {
              identifier: {
                system: 'https://hwr.kenya-hie.health/api/v4/Practitioner',
                value: 'PUID-0155222-4'
              }
            }
          }
        ],
        period: {
          start: '2025-09-19T11:32:42+03:00'
        },
        serviceProvider: {
          reference:
            'https://fr.kenya-hie.health/api/v4/Organization/FID-45-107983-8',
          identifier: {
            system: 'https://fr.kenya-hie.health/api/v4/Organization',
            value: 'FID-45-107983-8'
          }
        }
      },
      search: {
        mode: 'match'
      }
    },
    {
      fullUrl: 'https://kenya-shr.kenya-hie.health/fhir/Encounter/13830960',
      resource: {
        resourceType: 'Encounter',
        id: '13830960',
        meta: {
          versionId: '1',
          lastUpdated: '2025-09-22T17:16:50.690+00:00',
          source: '#ecb77ea298b44923'
        },
        identifier: [
          {
            system: 'http://fhir.openmrs.org',
            value:
              'Patient-Appointment-HLC-APP-f0ce9125-4870-468d-acb7-a8c8d2d81169'
          }
        ],
        status: 'unknown',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'OP',
          display: 'outpatient encounter'
        },
        type: [
          {
            coding: [
              {
                system: 'http://fhir.openmrs.org/code-system/visit-type',
                code: 'd4ac2aa5-2899-42fb-b08a-d40161815b48',
                display: 'RETURN HIV CLINIC VISIT'
              }
            ]
          }
        ],
        subject: {
          reference: 'Patient/CR7671914222027-5',
          identifier: {
            system: 'https://cr.kenya-hie.health/api/v4/Patient',
            value: 'CR7671914222027-5'
          }
        },
        period: {
          start: '2025-09-19T11:32:33+03:00',
          end: '2025-09-21T00:15:57+03:00'
        },
        serviceProvider: {
          reference:
            'https://fr.kenya-hie.health/api/v4/Organization/FID-45-107983-8',
          identifier: {
            system: 'https://fr.kenya-hie.health/api/v4/Organization',
            value: 'FID-45-107983-8'
          }
        }
      },
      search: {
        mode: 'match'
      }
    },
    {
      fullUrl: 'https://kenya-shr.kenya-hie.health/fhir/Encounter/13830961',
      resource: {
        resourceType: 'Encounter',
        id: '13830961',
        meta: {
          versionId: '1',
          lastUpdated: '2025-09-22T17:16:50.743+00:00',
          source: '#ecb77ea298b44923'
        },
        identifier: [
          {
            system: 'http://fhir.openmrs.org',
            value:
              'Patient-Appointment-HLC-APP-5c1bb851-68ec-49ee-a83b-1729fd0fb0b9'
          }
        ],
        status: 'unknown',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'OP',
          display: 'outpatient encounter'
        },
        type: [
          {
            coding: [
              {
                system: 'http://fhir.openmrs.org/code-system/encounter-type',
                code: '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
                display: 'ADULTRETURN'
              }
            ]
          }
        ],
        subject: {
          reference: 'Patient/CR7671914222027-5',
          identifier: {
            system: 'https://cr.kenya-hie.health/api/v4/Patient',
            value: 'CR7671914222027-5'
          }
        },
        participant: [
          {
            individual: {
              identifier: {
                system: 'https://hwr.kenya-hie.health/api/v4/Practitioner',
                value: 'PUID-0155222-4'
              }
            }
          }
        ],
        period: {
          start: '2025-09-19T11:32:42+03:00'
        },
        serviceProvider: {
          reference:
            'https://fr.kenya-hie.health/api/v4/Organization/FID-45-107983-8',
          identifier: {
            system: 'https://fr.kenya-hie.health/api/v4/Organization',
            value: 'FID-45-107983-8'
          }
        }
      },
      search: {
        mode: 'match'
      }
    },
    {
      fullUrl: 'https://kenya-shr.kenya-hie.health/fhir/Encounter/13831054',
      resource: {
        resourceType: 'Encounter',
        id: '13831054',
        meta: {
          versionId: '1',
          lastUpdated: '2025-09-22T17:17:10.506+00:00',
          source: '#7603f1b2d7f49544'
        },
        identifier: [
          {
            system: 'http://fhir.openmrs.org',
            value:
              'Patient-Appointment-HLC-APP-f0ce9125-4870-468d-acb7-a8c8d2d81169'
          }
        ],
        status: 'unknown',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'OP',
          display: 'outpatient encounter'
        },
        type: [
          {
            coding: [
              {
                system: 'http://fhir.openmrs.org/code-system/visit-type',
                code: 'd4ac2aa5-2899-42fb-b08a-d40161815b48',
                display: 'RETURN HIV CLINIC VISIT'
              }
            ]
          }
        ],
        subject: {
          reference: 'Patient/CR7671914222027-5',
          identifier: {
            system: 'https://cr.kenya-hie.health/api/v4/Patient',
            value: 'CR7671914222027-5'
          }
        },
        period: {
          start: '2025-09-19T11:32:33+03:00',
          end: '2025-09-21T00:15:57+03:00'
        },
        serviceProvider: {
          reference:
            'https://fr.kenya-hie.health/api/v4/Organization/FID-45-107983-8',
          identifier: {
            system: 'https://fr.kenya-hie.health/api/v4/Organization',
            value: 'FID-45-107983-8'
          }
        }
      },
      search: {
        mode: 'match'
      }
    },
    {
      fullUrl: 'https://kenya-shr.kenya-hie.health/fhir/Encounter/13831055',
      resource: {
        resourceType: 'Encounter',
        id: '13831055',
        meta: {
          versionId: '1',
          lastUpdated: '2025-09-22T17:17:10.586+00:00',
          source: '#7603f1b2d7f49544'
        },
        identifier: [
          {
            system: 'http://fhir.openmrs.org',
            value:
              'Patient-Appointment-HLC-APP-5c1bb851-68ec-49ee-a83b-1729fd0fb0b9'
          }
        ],
        status: 'unknown',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'OP',
          display: 'outpatient encounter'
        },
        type: [
          {
            coding: [
              {
                system: 'http://fhir.openmrs.org/code-system/encounter-type',
                code: '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
                display: 'ADULTRETURN'
              }
            ]
          }
        ],
        subject: {
          reference: 'Patient/CR7671914222027-5',
          identifier: {
            system: 'https://cr.kenya-hie.health/api/v4/Patient',
            value: 'CR7671914222027-5'
          }
        },
        participant: [
          {
            individual: {
              identifier: {
                system: 'https://hwr.kenya-hie.health/api/v4/Practitioner',
                value: 'PUID-0155222-4'
              }
            }
          }
        ],
        period: {
          start: '2025-09-19T11:32:42+03:00'
        },
        serviceProvider: {
          reference:
            'https://fr.kenya-hie.health/api/v4/Organization/FID-45-107983-8',
          identifier: {
            system: 'https://fr.kenya-hie.health/api/v4/Organization',
            value: 'FID-45-107983-8'
          }
        }
      },
      search: {
        mode: 'match'
      }
    },
    {
      fullUrl: 'https://kenya-shr.kenya-hie.health/fhir/Encounter/13831122',
      resource: {
        resourceType: 'Encounter',
        id: '13831122',
        meta: {
          versionId: '1',
          lastUpdated: '2025-09-22T17:16:50.872+00:00',
          source: '#ecb77ea298b44923'
        },
        identifier: [
          {
            system: 'http://fhir.openmrs.org',
            value:
              'Patient-Appointment-HLC-APP-5d54d94e-f1e3-455f-bb27-e12f63d421d5'
          }
        ],
        status: 'unknown',
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'OP',
          display: 'outpatient encounter'
        },
        type: [
          {
            coding: [
              {
                system: 'http://fhir.openmrs.org/code-system/encounter-type',
                code: 'c8aea16d-710b-4036-adcc-3ebf60f48f0e',
                display: 'INTERNALMOVEMENT'
              }
            ]
          }
        ],
        subject: {
          reference: 'Patient/CR7671914222027-5',
          identifier: {
            system: 'https://cr.kenya-hie.health/api/v4/Patient',
            value: 'CR7671914222027-5'
          }
        },
        participant: [
          {
            individual: {
              identifier: {
                system: 'https://hwr.kenya-hie.health/api/v4/Practitioner',
                value: 'PUID-0155222-4'
              }
            }
          }
        ],
        period: {
          start: '2025-09-19T11:39:13+03:00'
        },
        serviceProvider: {
          reference:
            'https://fr.kenya-hie.health/api/v4/Organization/FID-45-107983-8',
          identifier: {
            system: 'https://fr.kenya-hie.health/api/v4/Organization',
            value: 'FID-45-107983-8'
          }
        }
      },
      search: {
        mode: 'match'
      }
    }
  ]
};
