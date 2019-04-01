import { Patient } from '../../../models/patient.model';

export const fakeUser = {
  display: 'Test User',
  personUuid: '57b90158-4b97-4893-8cd0-d6c38f94e241'
};

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

export const fakeProvider = {
  'uuid': '1e40ff78-d2b4-40e0-8c55-c4761f8dcc19',
  'display': '143643-5 - Test Provider',
  'person': {
    'uuid': '57b90158-4b97-4893-8cd0-d6c323a4f241',
    'display': 'Test Provider',
    'gender': 'M',
    'age': null,
    'birthdate': null,
    'birthdateEstimated': false,
    'dead': false,
    'deathDate': null,
    'causeOfDeath': null,
    'preferredName': {
      'uuid': '621110d5-b01b-4812-ae27-d9755323f31ec',
      'display': 'Test Provider',
    },
    'preferredAddress': null,
    'attributes': [],
    'voided': false,
    'deathdateEstimated': false,
    'birthtime': null,
    'resourceVersion': '1.11'
  },
  'identifier': '168473-7',
  'attributes': [],
  'retired': false,
  'auditInfo': {
    'creator': {
      'uuid': '5cd4d5c4-13a9-11df-a1f1-231e34221331',
      'display': 'Test Administrator'
    },
    'dateCreated': '2019-08-15T09:33:32.000+0300',
    'changedBy': null,
    'dateChanged': null
  }
};

export const mockOrders = {
  'results': [
    {
      'display': 'X-RAY, SKULL',
      'uuid': '4fc0d803-b589-44e9-8dde-dc7f70d8d938',
      'orderNumber': 'ORD-262748',
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
      'orderReason': null,
      'orderReasonNonCoded': null,
      'urgency': 'ROUTINE',
      'action': 'NEW',
      'commentToFulfiller': null,
      'dateStopped': null,
      'dateActivated': '2019-11-08T12:31:31.000+0300',
      'instructions': null,
      'orderer': {
        'uuid': '1e40ff78-d2b4-40e0-8c55-c4761f8dcc19',
        'display': '168473-7 - Test Orderer',
        'person': {
          'uuid': '57b90158-4b44-4893-8cd0-d6c98f94e241',
          'display': 'Test Person'
        },
        'identifier': '162313-7',
        'attributes': [],
        'retired': false,
        'resourceVersion': '1.9'
      },
      'encounter': {
        'uuid': '609820fb-88ee-4496-b7eb-5d4991d37ab2',
        'display': 'LABORDERENCOUNTER 08/11/2019',
        'encounterDatetime': '2019-11-08T12:31:30.000+0300',
        'patient': {
          'uuid': '767ba950-4822-4883-8f96-7be6c14ebbe0',
          'display': '749138740-8 - Test Male Enrollment'
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
          'resourceVersion': '2.0'
        },
        'form': null,
        'encounterType': {
          'uuid': '5ef97eed-18f5-40f6-9fbf-a11b1f06484a',
          'display': 'LABORDERENCOUNTER',
          'name': 'LABORDERENCOUNTER',
          'description': 'LABORDERENCOUNTER',
          'retired': false,
          'resourceVersion': '1.8'
        },
        'obs': [],
        'orders': [
          {
            'uuid': '4fc0d803-b589-44e9-8dde-dc7f70d8d938',
            'orderNumber': 'ORD-262748',
            'accessionNumber': null,
            'patient': {
              'uuid': '767ba950-4822-4883-8f96-7be6c14ebbe0',
              'display': '749138740-8 - Test Male Enrollment'
            },
            'concept': {
              'uuid': 'a894c266-1350-11df-a1f1-0026b9348838',
              'display': 'X-RAY, SKULL'
            },
            'action': 'NEW',
            'careSetting': {
              'uuid': '6f0c9a92-6f24-11e3-af88-005056821db0',
              'display': 'Outpatient'
            },
            'previousOrder': null,
            'dateActivated': '2019-11-08T12:31:31.000+0300',
            'scheduledDate': null,
            'dateStopped': null,
            'autoExpireDate': null,
            'encounter': {
              'uuid': '609820fb-88ee-4496-b7eb-5d4991d37ab2',
              'display': 'LABORDERENCOUNTER 08/11/2019'
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
            'display': 'X-RAY, SKULL',
            'specimenSource': null,
            'laterality': null,
            'clinicalHistory': null,
            'frequency': null,
            'numberOfRepeats': null,
            'type': 'testorder',
            'resourceVersion': '1.10'
          }
        ],
        'voided': false,
        'auditInfo': {
          'creator': {
            'uuid': '83c41fb5-2af2-4b3d-b20d-f3f1ba7a34e3',
            'display': 'testuser',
          },
          'dateCreated': '2019-11-08T12:31:30.000+0300',
          'changedBy': null,
          'dateChanged': null
        },
        'visit': null,
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
              'display': 'AMRS Universal ID'
            },
            'location': {
              'uuid': '18c343eb-b353-462a-9139-b16606e6b6c2',
              'display': 'Location Test'
            },
            'preferred': false,
            'voided': false,
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
              'resourceVersion': '1.8'
            }
          ],
          'addresses': [],
          'voided': false,
          'deathdateEstimated': false,
          'birthtime': null,
          'resourceVersion': '1.11'
        },
        'voided': false,
        'resourceVersion': '1.8'
      },
      'concept': {
        'uuid': 'a894c266-1350-11df-a1f1-0026b9348838',
        'display': 'X-RAY, SKULL'
      },
      'status': {
        'status': 0,
        'picUrl': [],
        'findings': '',
        'obsUuid': ''
      }
    },
    {
      'display': 'BARIUM SWALLOW',
      'uuid': 'a6eec60c-f0bc-4ec1-853d-542f3cfe2ae7',
      'orderNumber': 'ORD-263170',
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
      'orderReason': null,
      'orderReasonNonCoded': null,
      'urgency': 'ROUTINE',
      'action': 'NEW',
      'commentToFulfiller': null,
      'dateStopped': null,
      'dateActivated': '2019-11-11T16:06:59.000+0300',
      'instructions': null,
      'orderer': {
        'uuid': '1e40ff78-d2b4-40e0-8c55-c4761f8dcc19',
        'display': '168473-7 - Test Orderer',
        'person': {
          'uuid': '57b90158-4b44-4893-8cd0-d6c98f94e241',
          'display': 'Test Person'
        },
        'identifier': '168473-7',
        'attributes': [],
        'retired': false,
        'resourceVersion': '1.9'
      },
      'encounter': {
        'uuid': 'a354b0aa-daee-4bf2-a209-f99b0a99d5a6',
        'display': 'LABORDERENCOUNTER 11/11/2019',
        'encounterDatetime': '2019-11-11T16:06:59.000+0300',
        'patient': {
          'uuid': '767ba950-4822-4883-8f96-7be6c14ebbe0',
          'display': '749138740-8 - Test Male Enrollment'
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
            'uuid': 'a6eec60c-f0bc-4ec1-853d-542f3cfe2ae7',
            'orderNumber': 'ORD-263170',
            'accessionNumber': null,
            'patient': {
              'uuid': '767ba950-4822-4883-8f96-7be6c14ebbe0',
              'display': '749138740-8 - Test Male Enrollment'
            },
            'concept': {
              'uuid': 'a89dc7ee-1350-11df-a1f1-0026b9348838',
              'display': 'BARIUM SWALLOW'
            },
            'action': 'NEW',
            'careSetting': {
              'uuid': '6f0c9a92-6f24-11e3-af88-005056821db0',
              'display': 'Outpatient'
            },
            'previousOrder': null,
            'dateActivated': '2019-11-11T16:06:59.000+0300',
            'scheduledDate': null,
            'dateStopped': null,
            'autoExpireDate': null,
            'encounter': {
              'uuid': 'a354b0aa-daee-4bf2-a209-f99b0a99d5a6',
              'display': 'LABORDERENCOUNTER 11/11/2019'
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
            'display': 'BARIUM SWALLOW',
            'specimenSource': null,
            'laterality': null,
            'clinicalHistory': null,
            'frequency': null,
            'numberOfRepeats': null,
            'type': 'testorder',
            'resourceVersion': '1.10'
          }
        ],
        'voided': false,
        'visit': null,
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
              'display': 'AMRS Universal ID'
            },
            'location': {
              'uuid': '18c343eb-b353-462a-9139-b16606e6b6c2',
              'display': 'Location Test'
            },
            'preferred': false,
            'voided': false,
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
              'resourceVersion': '1.8'
            }
          ],
          'addresses': [],
          'attributes': [],
          'voided': false,
          'deathdateEstimated': false,
          'birthtime': null,
          'resourceVersion': '1.11'
        },
        'voided': false,
        'resourceVersion': '1.8'
      },
      'concept': {
        'uuid': 'a89dc7ee-1350-11df-a1f1-0026b9348838',
        'display': 'BARIUM SWALLOW'
      },
      'status': {
        'status': 0,
        'picUrl': [],
        'findings': '',
        'obsUuid': ''
      }
    }
  ]
};
