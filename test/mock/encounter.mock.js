(function () {
  'use strict';

  module.exports = {
    getAdultReturnRestMock: getAdultReturnRestMock,
    getTriageRestMock: getTriageRestMock
  };

  function getAdultReturnRestMock() {
    return {
      uuid: 'adult-return-uuid',
      encounterDatetime: '2016-04-11T11:18:11.000+0300',
      patient: {
        uuid: 'patient-uuid'
      },
      form: {
        uuid: '1339a535-e38f-44cd-8cf8-f42f7c5f2ab7',
        name: 'AMPATH POC Adult Return Visit Form v0.01'
      },
      location: {
        uuid: '00b47ef5-a29b-40a2-a7f4-6851df8d6532',
        display: 'Location-100',
        links: [
          {
            uri: 'test-rest-url/location/00b47ef5-a29b-40a2-a7f4-6851df8d6532',
            rel: 'self'
          }
        ]
      },
      encounterType: {
        uuid: '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
        display: 'ADULTRETURN',
        links: [
          {
            uri:
              'test-rest-url/encountertype/8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
            rel: 'self'
          }
        ]
      },
      encounterProviders: [
        {
          provider: {
            uuid: 'pd13dddc-1359-11df-a1f1-0026b9348838',
            display: '641-1 - Unknown Unknown Unknown',
            person: {
              uuid: '5d13dddc-1359-11df-a1f1-0026b9348838',
              display: 'Unknown Unknown Unknown',
              links: [
                {
                  uri:
                    'test-rest-urlperson/5d13dddc-1359-11df-a1f1-0026b9348838',
                  rel: 'self'
                }
              ]
            },
            identifier: '641-1',
            attributes: [],
            retired: false,
            links: [
              {
                uri:
                  'test-rest-url/provider/pd13dddc-1359-11df-a1f1-0026b9348838',
                rel: 'self'
              },
              {
                uri:
                  'test-rest-url/provider/pd13dddc-1359-11df-a1f1-0026b9348838?v=full',
                rel: 'full'
              }
            ],
            resourceVersion: '1.9'
          },
          encounterRole: {
            uuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
            display: 'Unknown',
            links: [
              {
                uri:
                  'test-rest-url/encounterrole/a0b03050-c99b-11e0-9572-0800200c9a66',
                rel: 'self'
              }
            ]
          }
        }
      ],
      obs: [
        {
          uuid: '311c17a6-6b8e-4041-9329-0ce763639335',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: 'a8afdb8c-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a95c4ef8-1350-11df-a1f1-0026b9348838',
              name: 'PATIENT REPORTED CURRENT TUBERCULOSIS TREATMENT, DETAILED'
            }
          },
          value: null,
          groupMembers: [
            {
              uuid: '16139a7f-9cc5-44c2-bdda-0415b634cccb',
              concept: {
                uuid: 'a899e444-1350-11df-a1f1-0026b9348838',
                name: {
                  uuid: 'a941f814-1350-11df-a1f1-0026b9348838',
                  name: 'PATIENT REPORTED CURRENT TUBERCULOSIS TREATMENT'
                }
              },
              obsDatetime: '2016-04-13T05:05:34.000+0300',
              value: {
                uuid: 'a899f51a-1350-11df-a1f1-0026b9348838',
                display: 'RIFAMPICIN ISONIAZID PYRAZINAMIDE AND ETHAMBUTOL',
                links: [
                  {
                    uri:
                      'test-rest-url/concept/a899f51a-1350-11df-a1f1-0026b9348838',
                    rel: 'self'
                  }
                ]
              }
            },
            {
              uuid: '85146eb9-2cfd-4def-8b31-76c5f49e1d5e',
              concept: {
                uuid: 'a8a07386-1350-11df-a1f1-0026b9348838',
                name: {
                  uuid: 'a9483f12-1350-11df-a1f1-0026b9348838',
                  name: 'NUMBER OF TABLETS PER DAY'
                }
              },
              obsDatetime: '2016-04-13T05:05:34.000+0300',
              value: 3
            }
          ]
        },
        {
          uuid: '78060287-6da7-466f-8e5e-c80aefad3b6f',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: '04616f5d-b961-4f41-bbd7-bcc0dd235577',
            name: {
              uuid: 'a505b1fc-4d0b-4195-8e7e-7a1cc625471f',
              name: 'CURRENT HIV ANTIRETROVIRAL DRUG USE TREATMENT CATEGORY'
            }
          },
          value: {
            uuid: '034047bd-3fa1-4b2a-b0f0-2787e9b9f7b3',
            display: 'FIRST LINE HIV ANTIRETROVIRAL DRUG TREATMENT',
            links: [
              {
                uri:
                  'test-rest-url/concept/034047bd-3fa1-4b2a-b0f0-2787e9b9f7b3',
                rel: 'self'
              }
            ]
          },
          groupMembers: null
        },
        {
          uuid: '73ddb525-47f7-46b6-b4e7-dfb374d2d140',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: '2a4b87dd-977d-4ce8-a321-1f13df4a31b2',
            name: {
              uuid: '7acc4e85-1180-4da4-8fed-559d7bff2d28',
              name:
                'TUBERCULOSIS TREATMENT ADHERENCE SINCE LAST VISIT, DETAILED'
            }
          },
          value: null,
          groupMembers: [
            {
              uuid: 'bd485f24-34ef-47c7-a787-4eb9db50bbff',
              concept: {
                uuid: '479decbd-e964-41c3-9576-98b39089ebd3',
                name: {
                  uuid: 'ba1a214a-24ad-4696-bc6c-abe603a25f7d',
                  name: 'TUBERCULOSIS TREATMENT ADHERENCE SINCE LAST VISIT'
                }
              },
              obsDatetime: '2016-04-13T05:05:34.000+0300',
              value: {
                uuid: 'a8b0f882-1350-11df-a1f1-0026b9348838',
                display: 'GOOD',
                links: [
                  {
                    uri:
                      'test-rest-url/concept/a8b0f882-1350-11df-a1f1-0026b9348838',
                    rel: 'self'
                  }
                ]
              }
            }
          ]
        },
        {
          uuid: '9ccdbf86-7814-4c8e-843a-6d95230f7331',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: 'a8a07688-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a9484264-1350-11df-a1f1-0026b9348838',
              name: 'REASON ANTIRETROVIRALS STOPPED, DETAILED'
            }
          },
          value: null,
          groupMembers: [
            {
              uuid: '73cd1e4b-fc77-443b-b9ea-04f3b01166cc',
              concept: {
                uuid: 'a89b7110-1350-11df-a1f1-0026b9348838',
                name: {
                  uuid: 'a94350e2-1350-11df-a1f1-0026b9348838',
                  name: 'REASON ANTIRETROVIRALS STOPPED'
                }
              },
              obsDatetime: '2016-04-13T05:05:34.000+0300',
              value: {
                uuid: 'c0c9eab3-46f6-453c-b29d-dc1c242317c5',
                display: 'FACILITY STOCKED OUT OF MEDICATION',
                links: [
                  {
                    uri:
                      'test-rest-url/concept/c0c9eab3-46f6-453c-b29d-dc1c242317c5',
                    rel: 'self'
                  }
                ]
              }
            }
          ]
        },
        {
          uuid: '149995fd-4f8e-418c-be97-a731cee5f2cc',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: 'a8afcafc-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a95c3a26-1350-11df-a1f1-0026b9348838',
              name: 'REVIEW OF TUBERCULOSIS SCREENING QUESTIONS'
            }
          },
          value: {
            uuid: 'a8afc8b8-1350-11df-a1f1-0026b9348838',
            display: 'COUGH FOR MORE THAN TWO WEEKS',
            links: [
              {
                uri:
                  'test-rest-url/concept/a8afc8b8-1350-11df-a1f1-0026b9348838',
                rel: 'self'
              }
            ]
          },
          groupMembers: null
        },
        {
          uuid: '8ffe48fe-0d2d-49d4-945b-819871afcb1f',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: 'b55a6d42-3189-4d4c-97bf-772dfe17b887',
            name: {
              uuid: '6459dafc-5c6f-48e0-810b-1fa79fd0d688',
              name: 'TUBERCULOSIS MEDICATION PICKUP LOCATION, DETAILED'
            }
          },
          value: null,
          groupMembers: [
            {
              uuid: '96ad9c91-7798-4e61-992b-e4ac2f9614e6',
              concept: {
                uuid: '16db21cd-10cb-4c31-bb5a-b7619bfbea66',
                name: {
                  uuid: 'dad3c3c4-2724-43bc-9424-22c0aa9c1d35',
                  name: 'TUBERCULOSIS MEDICATION PICKUP LOCATION'
                }
              },
              obsDatetime: '2016-04-13T05:05:34.000+0300',
              value: {
                uuid: 'a89c2f42-1350-11df-a1f1-0026b9348838',
                display: 'AMPATH',
                links: [
                  {
                    uri:
                      'test-rest-url/concept/a89c2f42-1350-11df-a1f1-0026b9348838',
                    rel: 'self'
                  }
                ]
              }
            }
          ]
        },
        {
          uuid: 'ec8371e4-b6bd-45fd-90fd-9eeaf47c544f',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: 'bc3834dd-ef07-4027-be30-729baa069291',
            name: {
              uuid: '00af9571-9056-4029-b39e-619c6620750e',
              name: 'ANTIRETROVIRAL ADHERENCE SINCE LAST VISIT, DETAILED'
            }
          },
          value: null,
          groupMembers: [
            {
              uuid: '6285b315-b3d7-41dc-b5a6-917aef87e090',
              concept: {
                uuid: '2c363a0e-7cf9-42cd-9778-1301b09c4484',
                name: {
                  uuid: '4a4ae47f-7758-44cc-a411-1f3209736e2d',
                  name: 'ANTIRETROVIRAL ADHERENCE SINCE LAST VISIT'
                }
              },
              obsDatetime: '2016-04-13T05:05:34.000+0300',
              value: {
                uuid: 'a8b0f882-1350-11df-a1f1-0026b9348838',
                display: 'GOOD',
                links: [
                  {
                    uri:
                      'test-rest-url/concept/a8b0f882-1350-11df-a1f1-0026b9348838',
                    rel: 'self'
                  }
                ]
              }
            }
          ]
        },
        {
          uuid: '03f32979-234c-4ea9-9f3e-8aa501ccd9f9',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: 'a89fe6f0-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a947113c-1350-11df-a1f1-0026b9348838',
              name: 'TB TREATMENT DRUGS STARTED, DETAILED'
            }
          },
          value: null,
          groupMembers: [
            {
              uuid: '1e3c0d17-5dc3-49de-92e8-04751ea08be8',
              concept: {
                uuid: 'a8a07386-1350-11df-a1f1-0026b9348838',
                name: {
                  uuid: 'a9483f12-1350-11df-a1f1-0026b9348838',
                  name: 'NUMBER OF TABLETS PER DAY'
                }
              },
              obsDatetime: '2016-04-13T05:05:34.000+0300',
              value: 3
            },
            {
              uuid: '0bdd7984-c0bd-4434-937f-c125474cce2b',
              concept: {
                uuid: 'a899e444-1350-11df-a1f1-0026b9348838',
                name: {
                  uuid: 'a941f814-1350-11df-a1f1-0026b9348838',
                  name: 'PATIENT REPORTED CURRENT TUBERCULOSIS TREATMENT'
                }
              },
              obsDatetime: '2016-04-13T05:05:34.000+0300',
              value: {
                uuid: 'a899f51a-1350-11df-a1f1-0026b9348838',
                display: 'RIFAMPICIN ISONIAZID PYRAZINAMIDE AND ETHAMBUTOL',
                links: [
                  {
                    uri:
                      'test-rest-url/concept/a899f51a-1350-11df-a1f1-0026b9348838',
                    rel: 'self'
                  }
                ]
              }
            }
          ]
        },
        {
          uuid: 'e928f3cf-e594-43b0-959a-79632dbb9baf',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: 'a8afcafc-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a95c3a26-1350-11df-a1f1-0026b9348838',
              name: 'REVIEW OF TUBERCULOSIS SCREENING QUESTIONS'
            }
          },
          value: {
            uuid: 'a892e4b4-1350-11df-a1f1-0026b9348838',
            display: 'CHEST PAIN',
            links: [
              {
                uri:
                  'test-rest-url/concept/a892e4b4-1350-11df-a1f1-0026b9348838',
                rel: 'self'
              }
            ]
          },
          groupMembers: null
        },
        {
          uuid: '04be1019-5c50-4a0a-b937-d2cdabaadd63',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: 'a89c1fd4-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a9436230-1350-11df-a1f1-0026b9348838',
              name: 'TUBERCULOSIS TREATMENT PLAN'
            }
          },
          value: {
            uuid: 'a89b7908-1350-11df-a1f1-0026b9348838',
            display: 'CONTINUE REGIMEN',
            links: [
              {
                uri:
                  'test-rest-url/concept/a89b7908-1350-11df-a1f1-0026b9348838',
                rel: 'self'
              }
            ]
          },
          groupMembers: null
        },
        {
          uuid: 'a975ed2c-6b88-4d34-8b53-c1107fb8cbf0',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: 'a8a666ba-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a948b4a6-1350-11df-a1f1-0026b9348838',
              name: 'RETURN VISIT DATE'
            }
          },
          value: '2016-06-08T00:00:00.000+0300',
          groupMembers: null
        },
        {
          uuid: '96a607b3-d8cd-444a-82b1-ce91a0b0a7d3',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: 'a8afcc82-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a95c3bd4-1350-11df-a1f1-0026b9348838',
              name: 'CURRENTLY ON TUBERCULOSIS TREATMENT'
            }
          },
          value: {
            uuid: 'a899b35c-1350-11df-a1f1-0026b9348838',
            display: 'YES',
            links: [
              {
                uri:
                  'test-rest-url/concept/a899b35c-1350-11df-a1f1-0026b9348838',
                rel: 'self'
              }
            ]
          },
          groupMembers: null
        },
        {
          uuid: 'd12af1c2-f769-42f1-9b49-9c41e428277e',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: 'a8afdb8c-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a95c4ef8-1350-11df-a1f1-0026b9348838',
              name: 'PATIENT REPORTED CURRENT TUBERCULOSIS TREATMENT, DETAILED'
            }
          },
          value: null,
          groupMembers: [
            {
              uuid: '4feecaff-40a1-46e0-bb1a-c0a587d3e76e',
              concept: {
                uuid: 'a899e5f2-1350-11df-a1f1-0026b9348838',
                name: {
                  uuid: 'a941f9cc-1350-11df-a1f1-0026b9348838',
                  name: 'TUBERCULOSIS DRUG TREATMENT START DATE'
                }
              },
              obsDatetime: '2016-04-13T05:05:34.000+0300',
              value: '2016-04-05T00:00:00.000+0300'
            }
          ]
        },
        {
          uuid: '67edaabc-1857-4e41-859a-ab50c9218698',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: '02ad9357-b996-4530-b1a4-aff91a105383',
            name: {
              uuid: '5b196452-2e1d-4fd1-8ac1-0742e37ee90a',
              name: 'TUBERCULOSIS DISEASE STATUS'
            }
          },
          value: {
            uuid: 'a8afcc82-1350-11df-a1f1-0026b9348838',
            display: 'CURRENTLY ON TUBERCULOSIS TREATMENT',
            links: [
              {
                uri:
                  'test-rest-url/concept/a8afcc82-1350-11df-a1f1-0026b9348838',
                rel: 'self'
              }
            ]
          },
          groupMembers: null
        },
        {
          uuid: 'a0e37bc1-156e-4ad3-9e02-38b8c7d6d4d0',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: 'a899e35e-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a941f738-1350-11df-a1f1-0026b9348838',
              name: 'PATIENT REPORTED CURRENT TUBERCULOSIS PROPHYLAXIS'
            }
          },
          value: {
            uuid: 'a899e0ac-1350-11df-a1f1-0026b9348838',
            display: 'NONE',
            links: [
              {
                uri:
                  'test-rest-url/concept/a899e0ac-1350-11df-a1f1-0026b9348838',
                rel: 'self'
              }
            ]
          },
          groupMembers: null
        },
        {
          uuid: '8321bdfd-920e-4a73-ae5b-bf279fea1813',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: 'b55a6d42-3189-4d4c-97bf-772dfe17b887',
            name: {
              uuid: '6459dafc-5c6f-48e0-810b-1fa79fd0d688',
              name: 'TUBERCULOSIS MEDICATION PICKUP LOCATION, DETAILED'
            }
          },
          value: null,
          groupMembers: [
            {
              uuid: 'e3b4d1ac-0697-4913-b5e3-9e35032f0ceb',
              concept: {
                uuid: '16db21cd-10cb-4c31-bb5a-b7619bfbea66',
                name: {
                  uuid: 'dad3c3c4-2724-43bc-9424-22c0aa9c1d35',
                  name: 'TUBERCULOSIS MEDICATION PICKUP LOCATION'
                }
              },
              obsDatetime: '2016-04-13T05:05:34.000+0300',
              value: {
                uuid: 'a89c2f42-1350-11df-a1f1-0026b9348838',
                display: 'AMPATH',
                links: [
                  {
                    uri:
                      'test-rest-url/concept/a89c2f42-1350-11df-a1f1-0026b9348838',
                    rel: 'self'
                  }
                ]
              }
            }
          ]
        },
        {
          uuid: '03c90069-43c7-4024-bccb-a1e1888c43fe',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: 'a89b6a62-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a9434d86-1350-11df-a1f1-0026b9348838',
              name: 'ANTIRETROVIRALS STARTED'
            }
          },
          value: {
            uuid: 'a89cc876-1350-11df-a1f1-0026b9348838',
            display: 'LAMIVUDINE AND TENOFOVIR',
            links: [
              {
                uri:
                  'test-rest-url/concept/a89cc876-1350-11df-a1f1-0026b9348838',
                rel: 'self'
              }
            ]
          },
          groupMembers: null
        },
        {
          uuid: 'e1135133-846c-477d-b39b-b27b93ed47d3',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: 'a89ae254-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a943144c-1350-11df-a1f1-0026b9348838',
              name: 'ANTIRETROVIRAL USE'
            }
          },
          value: {
            uuid: 'a899b35c-1350-11df-a1f1-0026b9348838',
            display: 'YES',
            links: [
              {
                uri:
                  'test-rest-url/concept/a899b35c-1350-11df-a1f1-0026b9348838',
                rel: 'self'
              }
            ]
          },
          groupMembers: null
        },
        {
          uuid: '9b2f7815-12c1-4b03-ba21-c7e2b91ba118',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: 'a899e282-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a941f666-1350-11df-a1f1-0026b9348838',
              name: 'PATIENT REPORTED CURRENT PCP PROPHYLAXIS'
            }
          },
          value: {
            uuid: 'a899e0ac-1350-11df-a1f1-0026b9348838',
            display: 'NONE',
            links: [
              {
                uri:
                  'test-rest-url/concept/a899e0ac-1350-11df-a1f1-0026b9348838',
                rel: 'self'
              }
            ]
          },
          groupMembers: null
        },
        {
          uuid: '050866f5-a6a5-4358-bad4-64b586d2f3c0',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: 'a89b75d4-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a9435510-1350-11df-a1f1-0026b9348838',
              name: 'ANTIRETROVIRAL PLAN'
            }
          },
          value: {
            uuid: 'a89b7c50-1350-11df-a1f1-0026b9348838',
            display: 'CHANGE REGIMEN',
            links: [
              {
                uri:
                  'test-rest-url/concept/a89b7c50-1350-11df-a1f1-0026b9348838',
                rel: 'self'
              }
            ]
          },
          groupMembers: null
        },
        {
          uuid: 'd14aaec9-d047-4dba-9890-b9bc4d620adc',
          obsDatetime: '2016-04-13T05:05:34.000+0300',
          concept: {
            uuid: 'a89b7e12-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a9435c54-1350-11df-a1f1-0026b9348838',
              name: 'PCP PROPHYLAXIS PLAN'
            }
          },
          value: {
            uuid: 'a899e0ac-1350-11df-a1f1-0026b9348838',
            display: 'NONE',
            links: [
              {
                uri:
                  'test-rest-url/concept/a899e0ac-1350-11df-a1f1-0026b9348838',
                rel: 'self'
              }
            ]
          },
          groupMembers: null
        },
        {
          uuid: 'bd9bc22d-5c23-48ee-9261-d2cb32646180',
          obsDatetime: '2016-04-21T07:22:13.000+0300',
          concept: {
            uuid: 'a89c1cfa-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a9435fb0-1350-11df-a1f1-0026b9348838',
              name: 'TUBERCULOSIS PROPHYLAXIS PLAN'
            }
          },
          value: {
            uuid: 'a89b77aa-1350-11df-a1f1-0026b9348838',
            display: 'START DRUGS',
            links: [
              {
                uri:
                  'https://test1.ampath.or.ke:8443/amrs/ws/rest/v1/concept/a89b77aa-1350-11df-a1f1-0026b9348838',
                rel: 'self'
              }
            ]
          },
          groupMembers: null
        }
      ]
    };
  }

  function getTriageRestMock() {
    return {
      uuid: 'efa4d84b-4e16-41ae-83d6-565e8470f491',
      encounterDatetime: '2016-04-11T11:18:11.000+0300',
      patient: {
        uuid: 'd0255a53-a8a6-4722-8439-3df4f4c5b1ba'
      },
      form: {
        uuid: 'a2b811ed-6942-405a-b7f8-e7ad6143966c',
        name: 'AMPATH POC Triage Encounter Form v0.01'
      },
      location: {
        uuid: '79fcf21c-8a00-44ba-9555-dde4dd877c4a',
        display: 'Location-101',
        links: [
          {
            uri: 'test-url/location/79fcf21c-8a00-44ba-9555-dde4dd877c4a',
            rel: 'self'
          }
        ]
      },
      encounterType: {
        uuid: 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
        display: 'TRIAGE',
        links: [
          {
            uri: 'test-url/encountertype/a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
            rel: 'self'
          }
        ]
      },
      encounterProviders: [
        {
          provider: {
            uuid: 'pb6e31da-1359-11df-a1f1-0026b9348838',
            display: '1-8 - Giniton Giniton Giniton',
            person: {
              uuid: '5b6e31da-1359-11df-a1f1-0026b9348838',
              display: 'Giniton Giniton Giniton',
              links: [
                {
                  uri: 'test-url/person/5b6e31da-1359-11df-a1f1-0026b9348838',
                  rel: 'self'
                }
              ]
            },
            identifier: '1-8',
            attributes: [],
            retired: false,
            links: [
              {
                uri: 'test-url/provider/pb6e31da-1359-11df-a1f1-0026b9348838',
                rel: 'self'
              },
              {
                uri:
                  'test-url/provider/pb6e31da-1359-11df-a1f1-0026b9348838?v=full',
                rel: 'full'
              }
            ],
            resourceVersion: '1.9'
          },
          encounterRole: {
            uuid: 'a0b03050-c99b-11e0-9572-0800200c9a66',
            display: 'Unknown',
            links: [
              {
                uri:
                  'test-url/encounterrole/a0b03050-c99b-11e0-9572-0800200c9a66',
                rel: 'self'
              }
            ]
          }
        }
      ],
      obs: [
        {
          uuid: '9d482ea9-2a42-4034-b0fa-1ed9673ce28d',
          obsDatetime: '2016-04-11T11:18:11.000+0300',
          concept: {
            uuid: 'a89c60c0-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a943a2fe-1350-11df-a1f1-0026b9348838',
              name: 'BODY MASS INDEX'
            }
          },
          value: 20.5,
          groupMembers: null
        },
        {
          uuid: '235d4fac-7df5-4cef-a50c-ebe3cc469593',
          obsDatetime: '2016-04-11T11:18:11.000+0300',
          concept: {
            uuid: 'a8a66354-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a948b14a-1350-11df-a1f1-0026b9348838',
              name: 'BLOOD OXYGEN SATURATION'
            }
          },
          value: 92,
          groupMembers: null
        },
        {
          uuid: '481622c3-7d90-4719-9faa-65ccbef642bf',
          obsDatetime: '2016-04-11T11:18:11.000+0300',
          concept: {
            uuid: 'a8b02524-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a95d5c12-1350-11df-a1f1-0026b9348838',
              name: 'HEALTH INSURANCE'
            }
          },
          value: {
            uuid: '8b715fed-97f6-4e38-8f6a-c167a42f8923',
            display: 'KENYA NATIONAL HEALTH INSURANCE FUND',
            links: [
              {
                uri: 'test-url/concept/8b715fed-97f6-4e38-8f6a-c167a42f8923',
                rel: 'self'
              }
            ]
          },
          groupMembers: null
        },
        {
          uuid: 'b1ebcca3-56a6-4402-9c80-045200a2fded',
          obsDatetime: '2016-04-11T11:18:11.000+0300',
          concept: {
            uuid: 'a8a65e36-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a948ac40-1350-11df-a1f1-0026b9348838',
              name: 'DIASTOLIC BLOOD PRESSURE'
            }
          },
          value: 70,
          groupMembers: null
        },
        {
          uuid: '51594895-f053-4b3e-b29c-86fc270d0148',
          obsDatetime: '2016-04-11T11:18:11.000+0300',
          concept: {
            uuid: 'a8a65fee-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a948adee-1350-11df-a1f1-0026b9348838',
              name: 'TEMPERATURE (C)'
            }
          },
          value: 38,
          groupMembers: null
        },
        {
          uuid: 'ca4c3013-b557-48c7-87a7-069810895a28',
          obsDatetime: '2016-04-11T11:18:11.000+0300',
          concept: {
            uuid: 'a8a660ca-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a948aeca-1350-11df-a1f1-0026b9348838',
              name: 'WEIGHT (KG)'
            }
          },
          value: 70,
          groupMembers: null
        },
        {
          uuid: '70280f7b-4556-4d8e-9080-0853cc3819fb',
          obsDatetime: '2016-04-11T11:18:11.000+0300',
          concept: {
            uuid: 'a8a65d5a-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a948ab6e-1350-11df-a1f1-0026b9348838',
              name: 'SYSTOLIC BLOOD PRESSURE'
            }
          },
          value: 100,
          groupMembers: null
        },
        {
          uuid: '9c07e316-c801-4321-9316-02c8e0f3bf0b',
          obsDatetime: '2016-04-11T11:18:11.000+0300',
          concept: {
            uuid: 'a89ff9a6-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a9473144-1350-11df-a1f1-0026b9348838',
              name: 'CURRENT VISIT TYPE'
            }
          },
          value: {
            uuid: 'a89b6440-1350-11df-a1f1-0026b9348838',
            display: 'SCHEDULED VISIT',
            links: [
              {
                uri: 'test-url/concept/a89b6440-1350-11df-a1f1-0026b9348838',
                rel: 'self'
              }
            ]
          },
          groupMembers: null
        },
        {
          uuid: '4838e53d-4363-4458-b459-7351047a7d10',
          obsDatetime: '2016-04-11T11:18:11.000+0300',
          concept: {
            uuid: '9ce5dbf0-a141-4ad8-8c9d-cd2bf84fe72b',
            name: {
              uuid: 'dd66c002-ce80-4d1a-b12a-a9f115e993a2',
              name: 'POSITIVE PREVENTION'
            }
          },
          value: {
            uuid: 'bf51f71e-937c-4da5-ae07-654acf59f5bb',
            display: 'COUPLES COUNSELLING ',
            links: [
              {
                uri: 'test-url/concept/bf51f71e-937c-4da5-ae07-654acf59f5bb',
                rel: 'self'
              }
            ]
          },
          groupMembers: null
        },
        {
          uuid: '2f4be6ed-f98b-4a49-b7bc-088bb410e399',
          obsDatetime: '2016-04-11T11:18:11.000+0300',
          concept: {
            uuid: 'a8a65f12-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a948ad12-1350-11df-a1f1-0026b9348838',
              name: 'PULSE'
            }
          },
          value: 72,
          groupMembers: null
        },
        {
          uuid: '80c1fb81-1561-49de-bf9e-55a4e3526b01',
          obsDatetime: '2016-04-11T11:18:11.000+0300',
          concept: {
            uuid: 'a8af49d8-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a94e92fe-1350-11df-a1f1-0026b9348838',
              name: 'DISCORDANT COUPLE'
            }
          },
          value: {
            uuid: 'a899b35c-1350-11df-a1f1-0026b9348838',
            display: 'YES',
            links: [
              {
                uri: 'test-url/concept/a899b35c-1350-11df-a1f1-0026b9348838',
                rel: 'self'
              }
            ]
          },
          groupMembers: null
        },
        {
          uuid: '09fe1a31-f2dd-46b2-bb27-f20b955fc836',
          obsDatetime: '2016-04-11T11:18:11.000+0300',
          concept: {
            uuid: '93aa3f1d-1c39-4196-b5e6-8adc916cd5d6',
            name: {
              uuid: '720ebcd9-2a40-4622-b645-eaed90efe7bf',
              name: 'MOST AT RISK PERSON FOR GETTING HIV INFECTION'
            }
          },
          value: {
            uuid: 'a8af49d8-1350-11df-a1f1-0026b9348838',
            display: 'DISCORDANT COUPLE',
            links: [
              {
                uri: 'test-url/concept/a8af49d8-1350-11df-a1f1-0026b9348838',
                rel: 'self'
              }
            ]
          },
          groupMembers: null
        },
        {
          uuid: 'd8b926e6-abf0-4b24-a0e5-e3f53a2addd8',
          obsDatetime: '2016-04-11T11:18:11.000+0300',
          concept: {
            uuid: 'a899a9f2-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a941c3d0-1350-11df-a1f1-0026b9348838',
              name: 'CIVIL STATUS'
            }
          },
          value: {
            uuid: 'a8aa76b0-1350-11df-a1f1-0026b9348838',
            display: 'MARRIED',
            links: [
              {
                uri: 'test-url/concept/a8aa76b0-1350-11df-a1f1-0026b9348838',
                rel: 'self'
              }
            ]
          },
          groupMembers: null
        },
        {
          uuid: '37cc4933-0d66-4040-ba6a-3c2532e7521d',
          obsDatetime: '2016-04-11T11:18:11.000+0300',
          concept: {
            uuid: 'a8a6619c-1350-11df-a1f1-0026b9348838',
            name: {
              uuid: 'a948af9c-1350-11df-a1f1-0026b9348838',
              name: 'HEIGHT (CM)'
            }
          },
          value: 185,
          groupMembers: null
        }
      ]
    };
  }
})();
