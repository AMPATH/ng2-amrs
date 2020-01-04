import { async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { of } from 'rxjs';

import { AppSettingsService } from '../../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../../utils/local-storage.service';
import { PersonResourceService } from '../../../../openmrs-api/person-resource.service';
import { ProcedureOrdersService } from './procedure-orders.service';
import { ProviderResourceService } from '../../../../openmrs-api/provider-resource.service';
import { SessionStorageService } from '../../../../utils/session-storage.service';
import { UserService } from '../../../../openmrs-api/user.service';

const fakeUrl = 'https://ngx.ampath.or.ke/amrs/ws/rest/v1/';
const fakePersonUuid = '223d458-4b97-4893-8edf-d6c38f94e241';

const fakeLoggedInUser = {
  'uuid': '83c41fb5-2af2-4b3d-b20d-f3f1ba7a9d92',
  'display': 'testuser',
  'systemId': '16324-5',
  'userProperties': {
    'loginAttempts': '0',
    'grantAccessToLocationOperationalData[*]': '*',
    'grantAccessToLocationAggregateData[*]': '*'
  },
  'person': {
    'uuid': '223d458-4b97-4893-8edf-d6c38f94e241',
    'display': 'Test User',
  },
  'privileges': [
    {
      'uuid': 'd05118c6-2490-4d78-a41a-390e3596a237',
      'display': 'Get Concept Datatypes'
    },
    {
      'uuid': '78163008-1359-11df-a1f1-0026b9348838',
      'display': 'Access REST API'
    },
    {
      'uuid': 'd05118c6-2490-4d78-a41a-390e3596a238',
      'display': 'Get Concept Classes'
    },
    {
      'uuid': '7816d63e-1359-11df-a1f1-0026b9348838',
      'display': 'Patient Dashboard - View Regimen Section',
    },
    {
      'uuid': 'd05118c6-2490-4d78-a41a-390e3596a233',
      'display': 'Get Order Types'
    },
    {
      'uuid': 'd05118c6-2490-4d78-a41a-390e3596a234',
      'display': 'Get Field Types'
    },
    {
      'uuid': 'd05118c6-2490-4d78-a41a-390e3596a232',
      'display': 'Get Relationship Types'
    },
    {
      'uuid': '7816a362-1359-11df-a1f1-0026b9348838',
      'display': 'Export Remote Form Entry'
    },
    {
      'uuid': '7816425a-1359-11df-a1f1-0026b9348838',
      'display': 'Add Patients'
    },
    {
      'uuid': 'd05118c6-2490-4d78-a41a-390e3596a239',
      'display': 'Get Identifier Types'
    },
    {
      'uuid': '0aa567a7-d986-421e-9641-e9bd9edcd6c9',
      'display': 'Remove Allergies'
    },
    {
      'uuid': 'd9c074f3-53bd-4181-b45b-8f45fffe65a0',
      'display': 'View Problems'
    },
    {
      'uuid': 'a47bd206-8a52-4803-95d5-d0682d20be3d',
      'display': 'Update HL7 Inbound Archive'
    },
    {
      'uuid': 'd05118c6-2490-4d78-a41a-390e3596a240',
      'display': 'Get Forms'
    }
  ],
  'roles': [
    {
      'uuid': 'b59981e6-6a8f-49ba-835d-0d4567b1adb6',
      'display': 'P.O.C Clinic Dashboard Viewer',
    },
    {
      'uuid': '4d675ad0-edf7-4317-8e6d-13af02bf4b8e',
      'display': 'P.O.C Data Analytics Viewer'
    }
  ],
  'retired': false
};

const fakeProvider = {
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

const appSettingsServiceStub = {
  getOpenmrsRestbaseurl: () => fakeUrl
};

const providerResourceServiceStub = {
  getProviderByPersonUuid: () => of(fakeProvider)
};

const userServiceStub = {
  getLoggedInUser: () => fakeLoggedInUser
};

describe('ProcedureOrdersService', () => {
  let service: ProcedureOrdersService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        LocalStorageService,
        PersonResourceService,
        ProcedureOrdersService,
        SessionStorageService,
        {
          provide: AppSettingsService,
          useValue: appSettingsServiceStub
        },
        {
          provide: ProviderResourceService,
          useValue: providerResourceServiceStub
        },
        {
          provide: UserService,
          useValue: userServiceStub
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.get(ProcedureOrdersService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have all of its methods defined', () => {
    expect(service.getUrl).toBeDefined();
    expect(service.getAllConcepts).toBeDefined();
    expect(service.determineIfUserHasVoidingPrivileges).toBeDefined();
    expect(service.getProviderByPersonUuid).toBeDefined();
  });

  it('should get the API endpoint URL', () => {
    const apiUrl = service.getUrl();
    expect(apiUrl).toBe('https://ngx.ampath.or.ke/amrs/ws/rest/v1/concept');
  });

  it('should determine whether the logged-in user is able to void orders', () => {
    const canVoidOrders = service.determineIfUserHasVoidingPrivileges();
    expect(canVoidOrders).toBe(false);
  });

  it('should determine the provider from their person uuid', async(() => {
    service.getProviderByPersonUuid(fakePersonUuid)
      .subscribe(
        (provider) => {
          expect(provider).toBeDefined();
          expect(provider).toEqual(jasmine.objectContaining({
            label: fakeProvider.display,
            value: fakeProvider.person.uuid,
            providerUuid: fakeProvider.uuid
          }));
        },
        (error) => {
          console.error('Error fetching provider: ', error);
        }
      );
  }));
});
