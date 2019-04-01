import { Patient } from '../../../../models/patient.model';

export const mockConcept = {
  answers: [],
  conceptClass: {
    description: 'Term to describe convenience sets',
    display: 'ConvSet',
    name: 'ConvSet',
    resourceVersion: '1.8',
    uuid: '8d492594-c2cc-11de-8d13-0010c6dffd0f'
  },
  name: {
    conceptNameType: 'FULLY SPECIFIED',
    display: 'XRAY',
    name: 'XRAY',
    uuid: 'ffa2a523-8694-4d77-b281-86b0c8b1875e'
  },
  setMembers: [
    {
      answers: [
        {
          display: 'NORMAL',
          uuid: 'a899e7b4-1350-11df-a1f1-0026b9348838'
        },
        {
          display: 'ABNORMAL',
          uuid: 'a899e7b4-1350-11df-a1f1-0026b9348838'
        },
        {
          display: 'FRACTURE',
          uuid: 'a899e7b4-1350-11df-a1f1-0026b9348838'
        },
        {
          display: 'EFFUSION',
          uuid: 'a899e7b4-1350-11df-a1f1-0026b9348838'
        },
        {
          display: 'ARTHRITIS',
          uuid: 'a899e7b4-1350-11df-a1f1-0026b9348838'
        },
        {
          display: 'OTHER NON-CODED',
          uuid: 'a899e7b4-1350-11df-a1f1-0026b9348838'
        },
        {
          display: 'MALIGNANCY',
          uuid: 'a899e7b4-1350-11df-a1f1-0026b9348838'
        }
      ],
      attributes: [],
      conceptClass: {
        uuid: '8d4907b2-c2cc-11de-8d13-0010c6dffd0f',
        display: 'Test'
      },
      dataType: {
        uuid: '8d4a48b6-c2cc-11de-8d13-0010c6dffd0f',
        display: 'Coded'
      },
      descriptions: [
        {
          display: 'An examination using irradiation for imaging the shoulder.',
          uuid: 'a8f61836-1350-11df-a1f1-0026b9348838'
        }
      ],
      display: 'X-RAY, SHOULDER',
      mappings: [
        {
          display: 'local: 394',
          uuid: 'fd5e1d4c-141b-4a2d-875d-00a806cfd691'
        },
        {
          display: 'MCL/CIEL: 394',
          uuid: '8efb18b1-f3a9-4716-b8f5-73b895d9ab87'
        }
      ],
      name: {
        conceptNameTypes: 'FULLY_SPECIFIED',
        display: 'XRAY, SHOULDER',
        locale: 'en',
        localePreferred: true,
        name: 'XRAY, SHOULDER',
        uuid: 'a899e7b4-1350-11df-a1f1-0026b9348838'
      },
      names: [
        {
          display: 'XRAY SHOULDER',
          uuid: 'a899e7b4-1350-11df-a1f1-0026b9348838'
        },
        {
          display: 'SHOULDER X-RAY',
          uuid: 'a899e7b4-1350-11df-a1f1-0026b9348838'
        },
        {
          display: 'SHOULDER XRAY',
          uuid: 'a899e7b4-1350-11df-a1f1-0026b9348838'
        },
        {
          display: 'X-RAY, SHOULDER',
          uuid: 'a899e7b4-1350-11df-a1f1-0026b9348838'
        },
        {
          display: 'XRAY SHOULDER',
          uuid: 'a899e7b4-1350-11df-a1f1-0026b9348838'
        },
      ],
      uuid: 'a899e7b4-1350-11df-a1f1-0026b9348838'
    }
  ]
};

export const mockOrders = [
  {
    'display': 'X-RAY, SHOULDER',
    'uuid': '10ebfb3f-b03c-4774-8340-cfd28c0be6d3',
    'orderNumber': 'ORD-263175',
    'orderType': {
      'uuid': '53eb4768-1359-11df-a1f1-0026b9348838',
      'display': 'Test',
      'name': 'Test',
      'javaClassName': 'org.openmrs.TestOrder',
      'retired': false,
      'description': 'New test order',
      'conceptClasses': [
        {
          'uuid': '8d4907b2-c2cc-11de-8d13-0010c6dffd0f',
          'display': 'Test',
          'links': [
            {
              'rel': 'self',
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/conceptclass/8d4907b2-c2cc-11de-8d13-0010c6dffd0f'
            }
          ]
        },
        {
          'uuid': '8d492026-c2cc-11de-8d13-0010c6dffd0f',
          'display': 'LabSet',
          'links': [
            {
              'rel': 'self',
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/conceptclass/8d492026-c2cc-11de-8d13-0010c6dffd0f'
            }
          ]
        }
      ],
      'parent': null,
      'links': [
        {
          'rel': 'self',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/ordertype/53eb4768-1359-11df-a1f1-0026b9348838'
        },
        {
          'rel': 'full',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/ordertype/53eb4768-1359-11df-a1f1-0026b9348838?v=full'
        }
      ],
      'resourceVersion': '1.10'
    },
    'orderReason': null,
    'orderReasonNonCoded': null,
    'urgency': 'ROUTINE',
    'action': 'NEW',
    'commentToFulfiller': null,
    'dateStopped': null,
    'dateActivated': '2019-11-11T16:23:09.000+0300',
    'instructions': null,
    'orderer': {
      'uuid': '1e40ff78-d2b4-40e0-8c55-c4761f8dcc19',
      'display': '168473-7 - Test Orderer',
      'person': {
        'uuid': '57b90158-4b97-4893-8cd0-d6c38f94e241',
        'display': 'Test Orderer',
        'links': [
          {
            'rel': 'self',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/57b90158-4b97-4893-8cd0-d6c38f94e241'
          }
        ]
      },
      'identifier': '168473-7',
      'attributes': [],
      'retired': false,
      'links': [
        {
          'rel': 'self',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/provider/1e40ff78-d2b4-40e0-8c55-c4761f8dcc19'
        },
        {
          'rel': 'full',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/provider/1e40ff78-d2b4-40e0-8c55-c4761f8dcc19?v=full'
        }
      ],
      'resourceVersion': '1.9'
    },
    'encounter': {
      'uuid': '55adfa3b-772e-4a8d-9436-ff3c5913949a',
      'display': 'LABORDERENCOUNTER 11/11/2019',
      'encounterDatetime': '2019-11-11T16:23:08.000+0300',
      'patient': {
        'uuid': '767ba950-4822-4883-8f96-7be6c14ebbe0',
        'display': '749138740-8 - Test Male Enrollment',
        'links': [
          {
            'rel': 'self',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patient/767ba950-4822-4883-8f96-7be6c14ebbe0'
          }
        ]
      },
      'location': {
        'uuid': '18c343eb-b353-462a-9139-b16606e6b6c2',
        'display': 'Location Test',
        'name': 'Location Test',
        'description': 'This is a test location for POC Testers.',
        'address1': 'Eldoret',
        'address2': null,
        'cityVillage': null,
        'stateProvince': 'Test',
        'country': 'Kenya',
        'postalCode': null,
        'latitude': null,
        'longitude': null,
        'countyDistrict': 'test',
        'address3': null,
        'address4': 'Test',
        'address5': null,
        'address6': null,
        'tags': [],
        'parentLocation': null,
        'childLocations': [],
        'retired': false,
        'attributes': [],
        'address7': null,
        'address8': null,
        'address9': null,
        'address10': null,
        'address11': null,
        'address12': null,
        'address13': null,
        'address14': null,
        'address15': null,
        'links': [
          {
            'rel': 'self',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/location/18c343eb-b353-462a-9139-b16606e6b6c2'
          },
          {
            'rel': 'full',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/location/18c343eb-b353-462a-9139-b16606e6b6c2?v=full'
          }
        ],
        'resourceVersion': '2.0'
      },
      'form': null,
      'encounterType': {
        'uuid': '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
        'display': 'LABORDERENCOUNTER',
        'name': 'LABORDERENCOUNTER',
        'description': 'LABORDERENCOUNTER',
        'retired': false,
        'links': [
          {
            'rel': 'self',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/encountertype/5ef97eed-18f5-40f6-9fbf-a11b1f06484a'
          },
          {
            'rel': 'full',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/encountertype/5ef97eed-18f5-40f6-9fbf-a11b1f06484a?v=full'
          }
        ],
        'resourceVersion': '1.8'
      },
      'obs': [],
      'orders': [
        {
          'uuid': '10ebfb3f-b03c-4774-8340-cfd28c0be6d3',
          'orderNumber': 'ORD-263175',
          'accessionNumber': null,
          'patient': {
            'uuid': '767ba950-4822-4883-8f96-7be6c14ebbe0',
            'display': '749138740-8 - Test Male Enrollment',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patient/767ba950-4822-4883-8f96-7be6c14ebbe0'
              }
            ]
          },
          'concept': {
            'uuid': 'a894d544-1350-11df-a1f1-0026b9348838',
            'display': 'X-RAY, SHOULDER',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/concept/a894d544-1350-11df-a1f1-0026b9348838'
              }
            ]
          },
          'action': 'NEW',
          'careSetting': {
            'uuid': '6f0c9a92-6f24-11e3-af88-005056821db0',
            'display': 'Outpatient',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/caresetting/6f0c9a92-6f24-11e3-af88-005056821db0'
              }
            ]
          },
          'previousOrder': null,
          'dateActivated': '2019-11-11T16:23:09.000+0300',
          'scheduledDate': null,
          'dateStopped': null,
          'autoExpireDate': null,
          'encounter': {
            'uuid': '55adfa3b-772e-4a8d-9436-ff3c5913949a',
            'display': 'LABORDERENCOUNTER 11/11/2019',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/encounter/55adfa3b-772e-4a8d-9436-ff3c5913949a'
              }
            ]
          },
          'orderer': {
            'uuid': '1e40ff78-d2b4-40e0-8c55-c4761f8dcc19',
            'display': '168473-7 - Test Orderer',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/provider/1e40ff78-d2b4-40e0-8c55-c4761f8dcc19'
              }
            ]
          },
          'orderReason': null,
          'orderReasonNonCoded': null,
          'orderType': {
            'uuid': '53eb4768-1359-11df-a1f1-0026b9348838',
            'display': 'Test',
            'name': 'Test',
            'javaClassName': 'org.openmrs.TestOrder',
            'retired': false,
            'description': 'New test order',
            'conceptClasses': [
              {
                'uuid': '8d4907b2-c2cc-11de-8d13-0010c6dffd0f',
                'display': 'Test',
                'links': [
                  {
                    'rel': 'self',
                    'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/conceptclass/8d4907b2-c2cc-11de-8d13-0010c6dffd0f'
                  }
                ]
              },
              {
                'uuid': '8d492026-c2cc-11de-8d13-0010c6dffd0f',
                'display': 'LabSet',
                'links': [
                  {
                    'rel': 'self',
                    'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/conceptclass/8d492026-c2cc-11de-8d13-0010c6dffd0f'
                  }
                ]
              }
            ],
            'parent': null,
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/ordertype/53eb4768-1359-11df-a1f1-0026b9348838'
              },
              {
                'rel': 'full',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/ordertype/53eb4768-1359-11df-a1f1-0026b9348838?v=full'
              }
            ],
            'resourceVersion': '1.10'
          },
          'urgency': 'ROUTINE',
          'instructions': null,
          'commentToFulfiller': null,
          'display': 'X-RAY, SHOULDER',
          'specimenSource': null,
          'laterality': null,
          'clinicalHistory': null,
          'frequency': null,
          'numberOfRepeats': null,
          'links': [
            {
              'rel': 'self',
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/order/10ebfb3f-b03c-4774-8340-cfd28c0be6d3'
            },
            {
              'rel': 'full',
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/order/10ebfb3f-b03c-4774-8340-cfd28c0be6d3?v=full'
            }
          ],
          'type': 'testorder',
          'resourceVersion': '1.10'
        }
      ],
      'voided': false,
      'auditInfo': {
        'creator': {
          'uuid': '83c41fb5-2af2-4b3d-b20d-f3f1ba7a9d92',
          'display': 'dkigen',
          'links': [
            {
              'rel': 'self',
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/user/83c41fb5-2af2-4b3d-b20d-f3f1ba7a9d92'
            }
          ]
        },
        'dateCreated': '2019-11-11T16:23:09.000+0300',
        'changedBy': null,
        'dateChanged': null
      },
      'visit': null,
      'encounterProviders': [
        {
          'uuid': '2765d4ee-9f31-4ace-a915-4726a038c151',
          'provider': {
            'uuid': '1e40ff78-d2b4-40e0-8c55-c4761f8dcc19',
            'display': '168473-7 - Test Orderer',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/provider/1e40ff78-d2b4-40e0-8c55-c4761f8dcc19'
              }
            ]
          },
          'encounterRole': {
            'uuid': 'a0b03050-c99b-11e0-9572-0800200c9a66',
            'display': 'Unknown',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/encounterrole/a0b03050-c99b-11e0-9572-0800200c9a66'
              }
            ]
          },
          'voided': false,
          'links': [
            {
              'rel': 'full',
              // tslint:disable-next-line: max-line-length
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/encounter/55adfa3b-772e-4a8d-9436-ff3c5913949a/encounterprovider/2765d4ee-9f31-4ace-a915-4726a038c151?v=full'
            }
          ],
          'resourceVersion': '1.9'
        }
      ],
      'links': [
        {
          'rel': 'self',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/encounter/55adfa3b-772e-4a8d-9436-ff3c5913949a'
        }
      ],
      'resourceVersion': '1.9'
    },
    'patient': {
      'uuid': '767ba950-4822-4883-8f96-7be6c14ebbe0',
      'display': '749138740-8 - Test Male Enrollment',
      'identifiers': [
        {
          'display': 'AMRS Universal ID = 749138740-8',
          'uuid': 'edf9e3c8-8473-4f34-9a53-e15160de9ed8',
          'identifier': '749138740-8',
          'identifierType': {
            'uuid': '58a4732e-1359-11df-a1f1-0026b9348838',
            'display': 'AMRS Universal ID',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patientidentifiertype/58a4732e-1359-11df-a1f1-0026b9348838'
              }
            ]
          },
          'location': {
            'uuid': '18c343eb-b353-462a-9139-b16606e6b6c2',
            'display': 'Location Test',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/location/18c343eb-b353-462a-9139-b16606e6b6c2'
              }
            ]
          },
          'preferred': false,
          'voided': false,
          'links': [
            {
              'rel': 'self',
              // tslint:disable-next-line: max-line-length
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patient/767ba950-4822-4883-8f96-7be6c14ebbe0/identifier/edf9e3c8-8473-4f34-9a53-e15160de9ed8'
            },
            {
              'rel': 'full',
              // tslint:disable-next-line: max-line-length
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patient/767ba950-4822-4883-8f96-7be6c14ebbe0/identifier/edf9e3c8-8473-4f34-9a53-e15160de9ed8?v=full'
            }
          ],
          'resourceVersion': '1.8'
        }
      ],
      'person': {
        'uuid': '767ba950-4822-4883-8f96-7be6c14ebbe0',
        'display': 'Test Male Enrollment',
        'gender': 'M',
        'age': 35,
        'birthdate': '1984-01-01T00:00:00.000+0300',
        'birthdateEstimated': true,
        'dead': false,
        'deathDate': null,
        'causeOfDeath': null,
        'preferredName': {
          'display': 'Test Male Enrollment',
          'uuid': '8e3e732d-f132-4f81-9f69-f2074274b5b6',
          'givenName': 'Test',
          'middleName': 'Male',
          'familyName': 'Enrollment',
          'familyName2': null,
          'voided': false,
          'links': [
            {
              'rel': 'self',
              // tslint:disable-next-line: max-line-length
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0/name/8e3e732d-f132-4f81-9f69-f2074274b5b6'
            },
            {
              'rel': 'full',
              // tslint:disable-next-line: max-line-length
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0/name/8e3e732d-f132-4f81-9f69-f2074274b5b6?v=full'
            }
          ],
          'resourceVersion': '1.8'
        },
        'preferredAddress': null,
        'names': [
          {
            'display': 'Test Male Enrollment',
            'uuid': '8e3e732d-f132-4f81-9f69-f2074274b5b6',
            'givenName': 'Test',
            'middleName': 'Male',
            'familyName': 'Enrollment',
            'familyName2': null,
            'voided': false,
            'links': [
              {
                'rel': 'self',
                // tslint:disable-next-line: max-line-length
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0/name/8e3e732d-f132-4f81-9f69-f2074274b5b6'
              },
              {
                'rel': 'full',
                // tslint:disable-next-line: max-line-length
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0/name/8e3e732d-f132-4f81-9f69-f2074274b5b6?v=full'
              }
            ],
            'resourceVersion': '1.8'
          }
        ],
        'addresses': [],
        'attributes': [
          {
            'display': 'Health Center = 125',
            'uuid': '78389c11-4beb-4d3b-93aa-b62e88ab7216',
            'value': {
              'uuid': '291bdf8e-93ed-4898-a58f-7d9f7f74128e',
              'display': 'Aboloi',
              'links': [
                {
                  'rel': 'self',
                  'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/location/291bdf8e-93ed-4898-a58f-7d9f7f74128e'
                }
              ]
            },
            'attributeType': {
              'uuid': '8d87236c-c2cc-11de-8d13-0010c6dffd0f',
              'display': 'Health Center',
              'links': [
                {
                  'rel': 'self',
                  'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/personattributetype/8d87236c-c2cc-11de-8d13-0010c6dffd0f'
                }
              ]
            },
            'voided': false,
            'links': [
              {
                'rel': 'self',
                // tslint:disable-next-line: max-line-length
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0/attribute/78389c11-4beb-4d3b-93aa-b62e88ab7216'
              },
              {
                'rel': 'full',
                // tslint:disable-next-line: max-line-length
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0/attribute/78389c11-4beb-4d3b-93aa-b62e88ab7216?v=full'
              }
            ],
            'resourceVersion': '1.8'
          }
        ],
        'voided': false,
        'auditInfo': {
          'creator': {
            'uuid': '58f6f8f6-4f1e-4238-8d38-5321d889718f',
            'display': 'fmaiko',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/user/58f6f8f6-4f1e-4238-8d38-5321d889718f'
              }
            ]
          },
          'dateCreated': '2019-07-03T12:09:27.000+0300',
          'changedBy': null,
          'dateChanged': null
        },
        'deathdateEstimated': false,
        'birthtime': null,
        'links': [
          {
            'rel': 'self',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0'
          }
        ],
        'resourceVersion': '1.11'
      },
      'voided': false,
      'auditInfo': {
        'creator': {
          'uuid': '58f6f8f6-4f1e-4238-8d38-5321d889718f',
          'display': 'fmaiko',
          'links': [
            {
              'rel': 'self',
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/user/58f6f8f6-4f1e-4238-8d38-5321d889718f'
            }
          ]
        },
        'dateCreated': '2019-07-03T12:09:27.000+0300',
        'changedBy': null,
        'dateChanged': null
      },
      'links': [
        {
          'rel': 'self',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patient/767ba950-4822-4883-8f96-7be6c14ebbe0'
        }
      ],
      'resourceVersion': '1.8'
    },
    'concept': {
      'uuid': 'a899e7b4-1350-11df-a1f1-0026b9348838',
      'display': 'X-RAY, SHOULDER',
      'links': [
        {
          'rel': 'self',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/concept/a894d544-1350-11df-a1f1-0026b9348838'
        }
      ]
    },
    'status': {
      'status': 0,
      'picUrl': [],
      'findings': '',
      'obsUuid': ''
    }
  },
  {
    'display': 'X-RAY, SHOULDER',
    'uuid': '4c71c04c-3d01-44cc-8ae9-f6f9cb61b9a8',
    'orderNumber': 'ORD-263476',
    'orderType': {
      'uuid': '53eb4768-1359-11df-a1f1-0026b9348838',
      'display': 'Test',
      'name': 'Test',
      'javaClassName': 'org.openmrs.TestOrder',
      'retired': false,
      'description': 'New test order',
      'conceptClasses': [
        {
          'uuid': '8d4907b2-c2cc-11de-8d13-0010c6dffd0f',
          'display': 'Test',
          'links': [
            {
              'rel': 'self',
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/conceptclass/8d4907b2-c2cc-11de-8d13-0010c6dffd0f'
            }
          ]
        },
        {
          'uuid': '8d492026-c2cc-11de-8d13-0010c6dffd0f',
          'display': 'LabSet',
          'links': [
            {
              'rel': 'self',
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/conceptclass/8d492026-c2cc-11de-8d13-0010c6dffd0f'
            }
          ]
        }
      ],
      'parent': null,
      'links': [
        {
          'rel': 'self',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/ordertype/53eb4768-1359-11df-a1f1-0026b9348838'
        },
        {
          'rel': 'full',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/ordertype/53eb4768-1359-11df-a1f1-0026b9348838?v=full'
        }
      ],
      'resourceVersion': '1.10'
    },
    'orderReason': null,
    'orderReasonNonCoded': null,
    'urgency': 'ROUTINE',
    'action': 'NEW',
    'commentToFulfiller': null,
    'dateStopped': null,
    'dateActivated': '2019-11-12T14:38:13.000+0300',
    'instructions': null,
    'orderer': {
      'uuid': '1e40ff78-d2b4-40e0-8c55-c4761f8dcc19',
      'display': '168473-7 - Test Orderer',
      'person': {
        'uuid': '57b90158-4b97-4893-8cd0-d6c38f94e241',
        'display': 'Test Orderer',
        'links': [
          {
            'rel': 'self',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/57b90158-4b97-4893-8cd0-d6c38f94e241'
          }
        ]
      },
      'identifier': '168473-7',
      'attributes': [],
      'retired': false,
      'links': [
        {
          'rel': 'self',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/provider/1e40ff78-d2b4-40e0-8c55-c4761f8dcc19'
        },
        {
          'rel': 'full',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/provider/1e40ff78-d2b4-40e0-8c55-c4761f8dcc19?v=full'
        }
      ],
      'resourceVersion': '1.9'
    },
    'encounter': {
      'uuid': 'ca6b22f6-1eac-4f19-840f-608e9ff9577b',
      'display': 'LABORDERENCOUNTER 12/11/2019',
      'encounterDatetime': '2019-11-12T14:38:13.000+0300',
      'patient': {
        'uuid': '767ba950-4822-4883-8f96-7be6c14ebbe0',
        'display': '749138740-8 - Test Male Enrollment',
        'links': [
          {
            'rel': 'self',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patient/767ba950-4822-4883-8f96-7be6c14ebbe0'
          }
        ]
      },
      'location': {
        'uuid': '18c343eb-b353-462a-9139-b16606e6b6c2',
        'display': 'Location Test',
        'name': 'Location Test',
        'description': 'This is a test location for POC Testers.',
        'address1': 'Eldoret',
        'address2': null,
        'cityVillage': null,
        'stateProvince': 'Test',
        'country': 'Kenya',
        'postalCode': null,
        'latitude': null,
        'longitude': null,
        'countyDistrict': 'test',
        'address3': null,
        'address4': 'Test',
        'address5': null,
        'address6': null,
        'tags': [],
        'parentLocation': null,
        'childLocations': [],
        'retired': false,
        'attributes': [],
        'address7': null,
        'address8': null,
        'address9': null,
        'address10': null,
        'address11': null,
        'address12': null,
        'address13': null,
        'address14': null,
        'address15': null,
        'links': [
          {
            'rel': 'self',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/location/18c343eb-b353-462a-9139-b16606e6b6c2'
          },
          {
            'rel': 'full',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/location/18c343eb-b353-462a-9139-b16606e6b6c2?v=full'
          }
        ],
        'resourceVersion': '2.0'
      },
      'form': null,
      'encounterType': {
        'uuid': '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
        'display': 'LABORDERENCOUNTER',
        'name': 'LABORDERENCOUNTER',
        'description': 'LABORDERENCOUNTER',
        'retired': false,
        'links': [
          {
            'rel': 'self',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/encountertype/5ef97eed-18f5-40f6-9fbf-a11b1f06484a'
          },
          {
            'rel': 'full',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/encountertype/5ef97eed-18f5-40f6-9fbf-a11b1f06484a?v=full'
          }
        ],
        'resourceVersion': '1.8'
      },
      'obs': [],
      'orders': [
        {
          'uuid': '4c71c04c-3d01-44cc-8ae9-f6f9cb61b9a8',
          'orderNumber': 'ORD-263476',
          'accessionNumber': null,
          'patient': {
            'uuid': '767ba950-4822-4883-8f96-7be6c14ebbe0',
            'display': '749138740-8 - Test Male Enrollment',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patient/767ba950-4822-4883-8f96-7be6c14ebbe0'
              }
            ]
          },
          'concept': {
            'uuid': 'a894d544-1350-11df-a1f1-0026b9348838',
            'display': 'X-RAY, SHOULDER',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/concept/a894d544-1350-11df-a1f1-0026b9348838'
              }
            ]
          },
          'action': 'NEW',
          'careSetting': {
            'uuid': '6f0c9a92-6f24-11e3-af88-005056821db0',
            'display': 'Outpatient',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/caresetting/6f0c9a92-6f24-11e3-af88-005056821db0'
              }
            ]
          },
          'previousOrder': null,
          'dateActivated': '2019-11-12T14:38:13.000+0300',
          'scheduledDate': null,
          'dateStopped': null,
          'autoExpireDate': null,
          'encounter': {
            'uuid': 'ca6b22f6-1eac-4f19-840f-608e9ff9577b',
            'display': 'LABORDERENCOUNTER 12/11/2019',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/encounter/ca6b22f6-1eac-4f19-840f-608e9ff9577b'
              }
            ]
          },
          'orderer': {
            'uuid': '1e40ff78-d2b4-40e0-8c55-c4761f8dcc19',
            'display': '168473-7 - Test Orderer',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/provider/1e40ff78-d2b4-40e0-8c55-c4761f8dcc19'
              }
            ]
          },
          'orderReason': null,
          'orderReasonNonCoded': null,
          'orderType': {
            'uuid': '53eb4768-1359-11df-a1f1-0026b9348838',
            'display': 'Test',
            'name': 'Test',
            'javaClassName': 'org.openmrs.TestOrder',
            'retired': false,
            'description': 'New test order',
            'conceptClasses': [
              {
                'uuid': '8d4907b2-c2cc-11de-8d13-0010c6dffd0f',
                'display': 'Test',
                'links': [
                  {
                    'rel': 'self',
                    'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/conceptclass/8d4907b2-c2cc-11de-8d13-0010c6dffd0f'
                  }
                ]
              },
              {
                'uuid': '8d492026-c2cc-11de-8d13-0010c6dffd0f',
                'display': 'LabSet',
                'links': [
                  {
                    'rel': 'self',
                    'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/conceptclass/8d492026-c2cc-11de-8d13-0010c6dffd0f'
                  }
                ]
              }
            ],
            'parent': null,
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/ordertype/53eb4768-1359-11df-a1f1-0026b9348838'
              },
              {
                'rel': 'full',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/ordertype/53eb4768-1359-11df-a1f1-0026b9348838?v=full'
              }
            ],
            'resourceVersion': '1.10'
          },
          'urgency': 'ROUTINE',
          'instructions': null,
          'commentToFulfiller': null,
          'display': 'X-RAY, SHOULDER',
          'specimenSource': null,
          'laterality': null,
          'clinicalHistory': null,
          'frequency': null,
          'numberOfRepeats': null,
          'links': [
            {
              'rel': 'self',
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/order/4c71c04c-3d01-44cc-8ae9-f6f9cb61b9a8'
            },
            {
              'rel': 'full',
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/order/4c71c04c-3d01-44cc-8ae9-f6f9cb61b9a8?v=full'
            }
          ],
          'type': 'testorder',
          'resourceVersion': '1.10'
        }
      ],
      'voided': false,
      'auditInfo': {
        'creator': {
          'uuid': '83c41fb5-2af2-4b3d-b20d-f3f1ba7a9d92',
          'display': 'dkigen',
          'links': [
            {
              'rel': 'self',
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/user/83c41fb5-2af2-4b3d-b20d-f3f1ba7a9d92'
            }
          ]
        },
        'dateCreated': '2019-11-12T14:38:13.000+0300',
        'changedBy': null,
        'dateChanged': null
      },
      'visit': null,
      'encounterProviders': [
        {
          'uuid': '7580bd72-ea9d-4749-bef7-fac4ea5f7903',
          'provider': {
            'uuid': '1e40ff78-d2b4-40e0-8c55-c4761f8dcc19',
            'display': '168473-7 - Test Orderer',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/provider/1e40ff78-d2b4-40e0-8c55-c4761f8dcc19'
              }
            ]
          },
          'encounterRole': {
            'uuid': 'a0b03050-c99b-11e0-9572-0800200c9a66',
            'display': 'Unknown',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/encounterrole/a0b03050-c99b-11e0-9572-0800200c9a66'
              }
            ]
          },
          'voided': false,
          'links': [
            {
              'rel': 'full',
              // tslint:disable-next-line: max-line-length
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/encounter/ca6b22f6-1eac-4f19-840f-608e9ff9577b/encounterprovider/7580bd72-ea9d-4749-bef7-fac4ea5f7903?v=full'
            }
          ],
          'resourceVersion': '1.9'
        }
      ],
      'links': [
        {
          'rel': 'self',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/encounter/ca6b22f6-1eac-4f19-840f-608e9ff9577b'
        }
      ],
      'resourceVersion': '1.9'
    },
    'patient': {
      'uuid': '767ba950-4822-4883-8f96-7be6c14ebbe0',
      'display': '749138740-8 - Test Male Enrollment',
      'identifiers': [
        {
          'display': 'AMRS Universal ID = 749138740-8',
          'uuid': 'edf9e3c8-8473-4f34-9a53-e15160de9ed8',
          'identifier': '749138740-8',
          'identifierType': {
            'uuid': '58a4732e-1359-11df-a1f1-0026b9348838',
            'display': 'AMRS Universal ID',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patientidentifiertype/58a4732e-1359-11df-a1f1-0026b9348838'
              }
            ]
          },
          'location': {
            'uuid': '18c343eb-b353-462a-9139-b16606e6b6c2',
            'display': 'Location Test',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/location/18c343eb-b353-462a-9139-b16606e6b6c2'
              }
            ]
          },
          'preferred': false,
          'voided': false,
          'links': [
            {
              'rel': 'self',
              // tslint:disable-next-line: max-line-length
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patient/767ba950-4822-4883-8f96-7be6c14ebbe0/identifier/edf9e3c8-8473-4f34-9a53-e15160de9ed8'
            },
            {
              'rel': 'full',
              // tslint:disable-next-line: max-line-length
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patient/767ba950-4822-4883-8f96-7be6c14ebbe0/identifier/edf9e3c8-8473-4f34-9a53-e15160de9ed8?v=full'
            }
          ],
          'resourceVersion': '1.8'
        }
      ],
      'person': {
        'uuid': '767ba950-4822-4883-8f96-7be6c14ebbe0',
        'display': 'Test Male Enrollment',
        'gender': 'M',
        'age': 35,
        'birthdate': '1984-01-01T00:00:00.000+0300',
        'birthdateEstimated': true,
        'dead': false,
        'deathDate': null,
        'causeOfDeath': null,
        'preferredName': {
          'display': 'Test Male Enrollment',
          'uuid': '8e3e732d-f132-4f81-9f69-f2074274b5b6',
          'givenName': 'Test',
          'middleName': 'Male',
          'familyName': 'Enrollment',
          'familyName2': null,
          'voided': false,
          'links': [
            {
              'rel': 'self',
              // tslint:disable-next-line: max-line-length
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0/name/8e3e732d-f132-4f81-9f69-f2074274b5b6'
            },
            {
              'rel': 'full',
              // tslint:disable-next-line: max-line-length
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0/name/8e3e732d-f132-4f81-9f69-f2074274b5b6?v=full'
            }
          ],
          'resourceVersion': '1.8'
        },
        'preferredAddress': null,
        'names': [
          {
            'display': 'Test Male Enrollment',
            'uuid': '8e3e732d-f132-4f81-9f69-f2074274b5b6',
            'givenName': 'Test',
            'middleName': 'Male',
            'familyName': 'Enrollment',
            'familyName2': null,
            'voided': false,
            'links': [
              {
                'rel': 'self',
                // tslint:disable-next-line: max-line-length
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0/name/8e3e732d-f132-4f81-9f69-f2074274b5b6'
              },
              {
                'rel': 'full',
                // tslint:disable-next-line: max-line-length
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0/name/8e3e732d-f132-4f81-9f69-f2074274b5b6?v=full'
              }
            ],
            'resourceVersion': '1.8'
          }
        ],
        'addresses': [],
        'attributes': [
          {
            'display': 'Health Center = 125',
            'uuid': '78389c11-4beb-4d3b-93aa-b62e88ab7216',
            'value': {
              'uuid': '291bdf8e-93ed-4898-a58f-7d9f7f74128e',
              'display': 'Aboloi',
              'links': [
                {
                  'rel': 'self',
                  'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/location/291bdf8e-93ed-4898-a58f-7d9f7f74128e'
                }
              ]
            },
            'attributeType': {
              'uuid': '8d87236c-c2cc-11de-8d13-0010c6dffd0f',
              'display': 'Health Center',
              'links': [
                {
                  'rel': 'self',
                  'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/personattributetype/8d87236c-c2cc-11de-8d13-0010c6dffd0f'
                }
              ]
            },
            'voided': false,
            'links': [
              {
                'rel': 'self',
                // tslint:disable-next-line: max-line-length
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0/attribute/78389c11-4beb-4d3b-93aa-b62e88ab7216'
              },
              {
                'rel': 'full',
                // tslint:disable-next-line: max-line-length
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0/attribute/78389c11-4beb-4d3b-93aa-b62e88ab7216?v=full'
              }
            ],
            'resourceVersion': '1.8'
          }
        ],
        'voided': false,
        'auditInfo': {
          'creator': {
            'uuid': '58f6f8f6-4f1e-4238-8d38-5321d889718f',
            'display': 'fmaiko',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/user/58f6f8f6-4f1e-4238-8d38-5321d889718f'
              }
            ]
          },
          'dateCreated': '2019-07-03T12:09:27.000+0300',
          'changedBy': null,
          'dateChanged': null
        },
        'deathdateEstimated': false,
        'birthtime': null,
        'links': [
          {
            'rel': 'self',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0'
          }
        ],
        'resourceVersion': '1.11'
      },
      'voided': false,
      'auditInfo': {
        'creator': {
          'uuid': '58f6f8f6-4f1e-4238-8d38-5321d889718f',
          'display': 'fmaiko',
          'links': [
            {
              'rel': 'self',
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/user/58f6f8f6-4f1e-4238-8d38-5321d889718f'
            }
          ]
        },
        'dateCreated': '2019-07-03T12:09:27.000+0300',
        'changedBy': null,
        'dateChanged': null
      },
      'links': [
        {
          'rel': 'self',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patient/767ba950-4822-4883-8f96-7be6c14ebbe0'
        }
      ],
      'resourceVersion': '1.8'
    },
    'concept': {
      'uuid': 'a894d544-1350-11df-a1f1-0026b9348838',
      'display': 'X-RAY, SHOULDER',
      'links': [
        {
          'rel': 'self',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/concept/a894d544-1350-11df-a1f1-0026b9348838'
        }
      ]
    },
    'status': {
      'status': 0,
      'picUrl': [],
      'findings': '',
      'obsUuid': ''
    }
  },
  {
    'display': 'X-RAY, SHOULDER',
    'uuid': 'a78a367b-d20b-47b0-b113-60ac8b46eb82',
    'orderNumber': 'ORD-263485',
    'orderType': {
      'uuid': '53eb4768-1359-11df-a1f1-0026b9348838',
      'display': 'Test',
      'name': 'Test',
      'javaClassName': 'org.openmrs.TestOrder',
      'retired': false,
      'description': 'New test order',
      'conceptClasses': [
        {
          'uuid': '8d4907b2-c2cc-11de-8d13-0010c6dffd0f',
          'display': 'Test',
          'links': [
            {
              'rel': 'self',
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/conceptclass/8d4907b2-c2cc-11de-8d13-0010c6dffd0f'
            }
          ]
        },
        {
          'uuid': '8d492026-c2cc-11de-8d13-0010c6dffd0f',
          'display': 'LabSet',
          'links': [
            {
              'rel': 'self',
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/conceptclass/8d492026-c2cc-11de-8d13-0010c6dffd0f'
            }
          ]
        }
      ],
      'parent': null,
      'links': [
        {
          'rel': 'self',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/ordertype/53eb4768-1359-11df-a1f1-0026b9348838'
        },
        {
          'rel': 'full',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/ordertype/53eb4768-1359-11df-a1f1-0026b9348838?v=full'
        }
      ],
      'resourceVersion': '1.10'
    },
    'orderReason': null,
    'orderReasonNonCoded': null,
    'urgency': 'ROUTINE',
    'action': 'NEW',
    'commentToFulfiller': null,
    'dateStopped': null,
    'dateActivated': '2019-11-12T15:23:54.000+0300',
    'instructions': null,
    'orderer': {
      'uuid': '1e40ff78-d2b4-40e0-8c55-c4761f8dcc19',
      'display': '168473-7 - Test Orderer',
      'person': {
        'uuid': '57b90158-4b97-4893-8cd0-d6c38f94e241',
        'display': 'Test Orderer',
        'links': [
          {
            'rel': 'self',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/57b90158-4b97-4893-8cd0-d6c38f94e241'
          }
        ]
      },
      'identifier': '168473-7',
      'attributes': [],
      'retired': false,
      'links': [
        {
          'rel': 'self',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/provider/1e40ff78-d2b4-40e0-8c55-c4761f8dcc19'
        },
        {
          'rel': 'full',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/provider/1e40ff78-d2b4-40e0-8c55-c4761f8dcc19?v=full'
        }
      ],
      'resourceVersion': '1.9'
    },
    'encounter': {
      'uuid': 'eeddbbaa-0b9c-4714-ae92-2a28615e6f1f',
      'display': 'LABORDERENCOUNTER 12/11/2019',
      'encounterDatetime': '2019-11-12T15:23:53.000+0300',
      'patient': {
        'uuid': '767ba950-4822-4883-8f96-7be6c14ebbe0',
        'display': '749138740-8 - Test Male Enrollment',
        'links': [
          {
            'rel': 'self',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patient/767ba950-4822-4883-8f96-7be6c14ebbe0'
          }
        ]
      },
      'location': {
        'uuid': '18c343eb-b353-462a-9139-b16606e6b6c2',
        'display': 'Location Test',
        'name': 'Location Test',
        'description': 'This is a test location for POC Testers.',
        'address1': 'Eldoret',
        'address2': null,
        'cityVillage': null,
        'stateProvince': 'Test',
        'country': 'Kenya',
        'postalCode': null,
        'latitude': null,
        'longitude': null,
        'countyDistrict': 'test',
        'address3': null,
        'address4': 'Test',
        'address5': null,
        'address6': null,
        'tags': [],
        'parentLocation': null,
        'childLocations': [],
        'retired': false,
        'attributes': [],
        'address7': null,
        'address8': null,
        'address9': null,
        'address10': null,
        'address11': null,
        'address12': null,
        'address13': null,
        'address14': null,
        'address15': null,
        'links': [
          {
            'rel': 'self',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/location/18c343eb-b353-462a-9139-b16606e6b6c2'
          },
          {
            'rel': 'full',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/location/18c343eb-b353-462a-9139-b16606e6b6c2?v=full'
          }
        ],
        'resourceVersion': '2.0'
      },
      'form': null,
      'encounterType': {
        'uuid': '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
        'display': 'LABORDERENCOUNTER',
        'name': 'LABORDERENCOUNTER',
        'description': 'LABORDERENCOUNTER',
        'retired': false,
        'links': [
          {
            'rel': 'self',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/encountertype/5ef97eed-18f5-40f6-9fbf-a11b1f06484a'
          },
          {
            'rel': 'full',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/encountertype/5ef97eed-18f5-40f6-9fbf-a11b1f06484a?v=full'
          }
        ],
        'resourceVersion': '1.8'
      },
      'obs': [],
      'orders': [
        {
          'uuid': 'a78a367b-d20b-47b0-b113-60ac8b46eb82',
          'orderNumber': 'ORD-263485',
          'accessionNumber': null,
          'patient': {
            'uuid': '767ba950-4822-4883-8f96-7be6c14ebbe0',
            'display': '749138740-8 - Test Male Enrollment',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patient/767ba950-4822-4883-8f96-7be6c14ebbe0'
              }
            ]
          },
          'concept': {
            'uuid': 'a894d544-1350-11df-a1f1-0026b9348838',
            'display': 'X-RAY, SHOULDER',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/concept/a894d544-1350-11df-a1f1-0026b9348838'
              }
            ]
          },
          'action': 'NEW',
          'careSetting': {
            'uuid': '6f0c9a92-6f24-11e3-af88-005056821db0',
            'display': 'Outpatient',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/caresetting/6f0c9a92-6f24-11e3-af88-005056821db0'
              }
            ]
          },
          'previousOrder': null,
          'dateActivated': '2019-11-12T15:23:54.000+0300',
          'scheduledDate': null,
          'dateStopped': null,
          'autoExpireDate': null,
          'encounter': {
            'uuid': 'eeddbbaa-0b9c-4714-ae92-2a28615e6f1f',
            'display': 'LABORDERENCOUNTER 12/11/2019',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/encounter/eeddbbaa-0b9c-4714-ae92-2a28615e6f1f'
              }
            ]
          },
          'orderer': {
            'uuid': '1e40ff78-d2b4-40e0-8c55-c4761f8dcc19',
            'display': '168473-7 - Test Orderer',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/provider/1e40ff78-d2b4-40e0-8c55-c4761f8dcc19'
              }
            ]
          },
          'orderReason': null,
          'orderReasonNonCoded': null,
          'orderType': {
            'uuid': '53eb4768-1359-11df-a1f1-0026b9348838',
            'display': 'Test',
            'name': 'Test',
            'javaClassName': 'org.openmrs.TestOrder',
            'retired': false,
            'description': 'New test order',
            'conceptClasses': [
              {
                'uuid': '8d4907b2-c2cc-11de-8d13-0010c6dffd0f',
                'display': 'Test',
                'links': [
                  {
                    'rel': 'self',
                    'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/conceptclass/8d4907b2-c2cc-11de-8d13-0010c6dffd0f'
                  }
                ]
              },
              {
                'uuid': '8d492026-c2cc-11de-8d13-0010c6dffd0f',
                'display': 'LabSet',
                'links': [
                  {
                    'rel': 'self',
                    'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/conceptclass/8d492026-c2cc-11de-8d13-0010c6dffd0f'
                  }
                ]
              }
            ],
            'parent': null,
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/ordertype/53eb4768-1359-11df-a1f1-0026b9348838'
              },
              {
                'rel': 'full',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/ordertype/53eb4768-1359-11df-a1f1-0026b9348838?v=full'
              }
            ],
            'resourceVersion': '1.10'
          },
          'urgency': 'ROUTINE',
          'instructions': null,
          'commentToFulfiller': null,
          'display': 'X-RAY, SHOULDER',
          'specimenSource': null,
          'laterality': null,
          'clinicalHistory': null,
          'frequency': null,
          'numberOfRepeats': null,
          'links': [
            {
              'rel': 'self',
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/order/a78a367b-d20b-47b0-b113-60ac8b46eb82'
            },
            {
              'rel': 'full',
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/order/a78a367b-d20b-47b0-b113-60ac8b46eb82?v=full'
            }
          ],
          'type': 'testorder',
          'resourceVersion': '1.10'
        }
      ],
      'voided': false,
      'auditInfo': {
        'creator': {
          'uuid': '83c41fb5-2af2-4b3d-b20d-f3f1ba7a9d92',
          'display': 'dkigen',
          'links': [
            {
              'rel': 'self',
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/user/83c41fb5-2af2-4b3d-b20d-f3f1ba7a9d92'
            }
          ]
        },
        'dateCreated': '2019-11-12T15:23:54.000+0300',
        'changedBy': null,
        'dateChanged': null
      },
      'visit': null,
      'encounterProviders': [
        {
          'uuid': 'd5827e99-3782-4b76-89c5-72d3e3ae8841',
          'provider': {
            'uuid': '1e40ff78-d2b4-40e0-8c55-c4761f8dcc19',
            'display': '168473-7 - Test Orderer',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/provider/1e40ff78-d2b4-40e0-8c55-c4761f8dcc19'
              }
            ]
          },
          'encounterRole': {
            'uuid': 'a0b03050-c99b-11e0-9572-0800200c9a66',
            'display': 'Unknown',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/encounterrole/a0b03050-c99b-11e0-9572-0800200c9a66'
              }
            ]
          },
          'voided': false,
          'links': [
            {
              'rel': 'full',
              // tslint:disable-next-line: max-line-length
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/encounter/eeddbbaa-0b9c-4714-ae92-2a28615e6f1f/encounterprovider/d5827e99-3782-4b76-89c5-72d3e3ae8841?v=full'
            }
          ],
          'resourceVersion': '1.9'
        }
      ],
      'links': [
        {
          'rel': 'self',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/encounter/eeddbbaa-0b9c-4714-ae92-2a28615e6f1f'
        }
      ],
      'resourceVersion': '1.9'
    },
    'patient': {
      'uuid': '767ba950-4822-4883-8f96-7be6c14ebbe0',
      'display': '749138740-8 - Test Male Enrollment',
      'identifiers': [
        {
          'display': 'AMRS Universal ID = 749138740-8',
          'uuid': 'edf9e3c8-8473-4f34-9a53-e15160de9ed8',
          'identifier': '749138740-8',
          'identifierType': {
            'uuid': '58a4732e-1359-11df-a1f1-0026b9348838',
            'display': 'AMRS Universal ID',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patientidentifiertype/58a4732e-1359-11df-a1f1-0026b9348838'
              }
            ]
          },
          'location': {
            'uuid': '18c343eb-b353-462a-9139-b16606e6b6c2',
            'display': 'Location Test',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/location/18c343eb-b353-462a-9139-b16606e6b6c2'
              }
            ]
          },
          'preferred': false,
          'voided': false,
          'links': [
            {
              'rel': 'self',
              // tslint:disable-next-line: max-line-length
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patient/767ba950-4822-4883-8f96-7be6c14ebbe0/identifier/edf9e3c8-8473-4f34-9a53-e15160de9ed8'
            },
            {
              'rel': 'full',
              // tslint:disable-next-line: max-line-length
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patient/767ba950-4822-4883-8f96-7be6c14ebbe0/identifier/edf9e3c8-8473-4f34-9a53-e15160de9ed8?v=full'
            }
          ],
          'resourceVersion': '1.8'
        }
      ],
      'person': {
        'uuid': '767ba950-4822-4883-8f96-7be6c14ebbe0',
        'display': 'Test Male Enrollment',
        'gender': 'M',
        'age': 35,
        'birthdate': '1984-01-01T00:00:00.000+0300',
        'birthdateEstimated': true,
        'dead': false,
        'deathDate': null,
        'causeOfDeath': null,
        'preferredName': {
          'display': 'Test Male Enrollment',
          'uuid': '8e3e732d-f132-4f81-9f69-f2074274b5b6',
          'givenName': 'Test',
          'middleName': 'Male',
          'familyName': 'Enrollment',
          'familyName2': null,
          'voided': false,
          'links': [
            {
              'rel': 'self',
              // tslint:disable-next-line: max-line-length
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0/name/8e3e732d-f132-4f81-9f69-f2074274b5b6'
            },
            {
              'rel': 'full',
              // tslint:disable-next-line: max-line-length
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0/name/8e3e732d-f132-4f81-9f69-f2074274b5b6?v=full'
            }
          ],
          'resourceVersion': '1.8'
        },
        'preferredAddress': null,
        'names': [
          {
            'display': 'Test Male Enrollment',
            'uuid': '8e3e732d-f132-4f81-9f69-f2074274b5b6',
            'givenName': 'Test',
            'middleName': 'Male',
            'familyName': 'Enrollment',
            'familyName2': null,
            'voided': false,
            'links': [
              {
                'rel': 'self',
                // tslint:disable-next-line: max-line-length
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0/name/8e3e732d-f132-4f81-9f69-f2074274b5b6'
              },
              {
                'rel': 'full',
                // tslint:disable-next-line: max-line-length
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0/name/8e3e732d-f132-4f81-9f69-f2074274b5b6?v=full'
              }
            ],
            'resourceVersion': '1.8'
          }
        ],
        'addresses': [],
        'attributes': [
          {
            'display': 'Health Center = 125',
            'uuid': '78389c11-4beb-4d3b-93aa-b62e88ab7216',
            'value': {
              'uuid': '291bdf8e-93ed-4898-a58f-7d9f7f74128e',
              'display': 'Aboloi',
              'links': [
                {
                  'rel': 'self',
                  'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/location/291bdf8e-93ed-4898-a58f-7d9f7f74128e'
                }
              ]
            },
            'attributeType': {
              'uuid': '8d87236c-c2cc-11de-8d13-0010c6dffd0f',
              'display': 'Health Center',
              'links': [
                {
                  'rel': 'self',
                  'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/personattributetype/8d87236c-c2cc-11de-8d13-0010c6dffd0f'
                }
              ]
            },
            'voided': false,
            'links': [
              {
                'rel': 'self',
                // tslint:disable-next-line: max-line-length
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0/attribute/78389c11-4beb-4d3b-93aa-b62e88ab7216'
              },
              {
                'rel': 'full',
                // tslint:disable-next-line: max-line-length
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0/attribute/78389c11-4beb-4d3b-93aa-b62e88ab7216?v=full'
              }
            ],
            'resourceVersion': '1.8'
          }
        ],
        'voided': false,
        'auditInfo': {
          'creator': {
            'uuid': '58f6f8f6-4f1e-4238-8d38-5321d889718f',
            'display': 'fmaiko',
            'links': [
              {
                'rel': 'self',
                'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/user/58f6f8f6-4f1e-4238-8d38-5321d889718f'
              }
            ]
          },
          'dateCreated': '2019-07-03T12:09:27.000+0300',
          'changedBy': null,
          'dateChanged': null
        },
        'deathdateEstimated': false,
        'birthtime': null,
        'links': [
          {
            'rel': 'self',
            'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/person/767ba950-4822-4883-8f96-7be6c14ebbe0'
          }
        ],
        'resourceVersion': '1.11'
      },
      'voided': false,
      'auditInfo': {
        'creator': {
          'uuid': '58f6f8f6-4f1e-4238-8d38-5321d889718f',
          'display': 'fmaiko',
          'links': [
            {
              'rel': 'self',
              'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/user/58f6f8f6-4f1e-4238-8d38-5321d889718f'
            }
          ]
        },
        'dateCreated': '2019-07-03T12:09:27.000+0300',
        'changedBy': null,
        'dateChanged': null
      },
      'links': [
        {
          'rel': 'self',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patient/767ba950-4822-4883-8f96-7be6c14ebbe0'
        }
      ],
      'resourceVersion': '1.8'
    },
    'concept': {
      'uuid': 'a894d544-1350-11df-a1f1-0026b9348838',
      'display': 'X-RAY, SHOULDER',
      'links': [
        {
          'rel': 'self',
          'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/concept/a894d544-1350-11df-a1f1-0026b9348838'
        }
      ]
    },
    'status': {
      'status': 0,
      'picUrl': [],
      'findings': '',
      'obsUuid': ''
    }
  }
];

export const testPatient = new Patient({
  allIdentifiers: '297400783-9',
  commonIdentifiers: {
    ampathMrsUId: '297400783-9',
    amrsMrn: '',
    cCC: '',
    kenyaNationalId: ''
  },
  display: '297400783-9 - Test Anticoagulation Treatment',
  encounters: [
    {
      encounterDatetime: new Date(),
      encounterType: {
        display: 'ANTICOAGULATION TRIAGE',
        uuid: '6accd920-6254-4063-bfd1-0e1b70b3f201'
      },
      form: {
        name: 'ONCOLOGY POC Anticoagulation Triage Form',
        uuid: '84539fd3-842c-46a7-a595-fc64919badd6'
      },
      location: {
        display: 'Location Test',
        uuid: '18c343eb-b353-462a-9139-b16606e6b6c2'
      },
      patient: {
        uuid: '7ce98cb8-9785-4467-91cc-64afa2d59763'
      }
    }
  ],
  identifiers: {
    openmrsModel: [
      {
        identifier: '749138740-8',
        identifierType: {
          uuid: '58a4732e-1359-11df-a1f1-0026b9348838',
          name: 'AMRS Universal ID',
          format: null,
          formatDescription: null,
          validator: 'org.openmrs.patient.impl.LuhnIdentifierValidator'
        },
        location: {
          uuid: '18c343eb-b353-462a-9139-b16606e6b6c2',
          name: 'Location Test'
        },
        uuid: 'edf9e3c8-8473-4f34-9a53-e15160de9ed8',
        preferred: false
      }
    ]
  },
  uuid: '767ba950-4822-4883-8f96-7be6c14ebbe0'
});

export const mockOrderResourceServiceResponse = {
  'uuid': 'f05c86b7-b30b-4db2-a5f3-9e83735557eb',
  'orderNumber': 'ORD-263953',
  'accessionNumber': null,
  'patient': {
    'uuid': '767ba950-4822-4883-8f96-7be6c14ebbe0',
    'display': '749138740-8 - Test Male Enrollment',
    'links': [
      {
        'rel': 'self',
        'uri': 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/patient/767ba950-4822-4883-8f96-7be6c14ebbe0'
      }
    ]
  },
  'concept': {
    'uuid': 'a894d544-1350-11df-a1f1-0026b9348838',
    'display': 'X-RAY, SHOULDER'
  },
  'action': 'NEW',
  'careSetting': {
    'uuid': '6f0c9a92-6f24-11e3-af88-005056821db0',
    'display': 'Outpatient'
  },
  'previousOrder': null,
  'dateActivated': '2019-11-14T11:13:43.000+0300',
  'scheduledDate': null,
  'dateStopped': null,
  'autoExpireDate': null,
  'encounter': {
    'uuid': '21623739-b049-425b-b966-897cac1f7cad',
    'display': 'LABORDERENCOUNTER 14/11/2019'
  },
  'orderer': {
    'uuid': '1e40ff78-d2b4-40e0-8c55-c4761f8dcc19',
    'display': '168473-7 - Test Orderer'
  },
  'orderReason': null,
  'orderReasonNonCoded': null,
  'orderType': {
    'uuid': '53eb4768-1359-11df-a1f1-0026b9348838',
    'display': 'Test',
    'name': 'Test',
    'javaClassName': 'org.openmrs.TestOrder',
    'retired': false,
    'description': 'New test order',
    'conceptClasses': [
      {
        'uuid': '8d4907b2-c2cc-11de-8d13-0010c6dffd0f',
        'display': 'Test'
      },
      {
        'uuid': '8d492026-c2cc-11de-8d13-0010c6dffd0f',
        'display': 'LabSet'
      }
    ],
    'parent': null,
    'resourceVersion': '1.10'
  },
  'urgency': 'ROUTINE',
  'instructions': null,
  'commentToFulfiller': null,
  'display': 'X-RAY, SHOULDER',
  'specimenSource': null,
  'laterality': null,
  'clinicalHistory': null,
  'frequency': null,
  'numberOfRepeats': null,
  'type': 'testorder',
  'resourceVersion': '1.10',
  'status': {
    'status': 0,
    'picUrl': [],
    'findings': '',
    'obsUuid': ''
  }
};
