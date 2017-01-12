


import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, async, inject } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { APP_BASE_HREF } from '@angular/common';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import {
  Http, Response, Headers, BaseRequestOptions, ResponseOptions,
  RequestMethod
} from '@angular/http';
import { LocalStorageService } from '../utils/local-storage.service';
import { PersonResourceService } from './person-resource.service';


// Load the implementations that should be tested

describe('Service: PersonResourceService Unit Tests', () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [],
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        AppSettingsService,
        LocalStorageService,
        PersonResourceService
      ],
    });
  }));
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  let personuid = 'uuid';
  let personPayload = {
    age: 21,
    names: [
      {
        // adding new person name
        middleName: 'Tests',
        familyName2: 'Tester'
      },
      { // Editing existing person name
        uuid: '0cfcb36e-a92f-4b71-b37e-2eedd24abe31',
        middleName: 'Test',
        familyName2: 'Ampath Tester'
      }],
    attributes: [
      // when creating new or updating, Api handles updates automatically
      {
        attributeType: 'attribute-type-uuid',
        value: 'Test Race'
      }
    ],
    addresses: [
      { // creating new person address
        address3: 'Third Address',
        address4: 'Fourth Address'
      },
      { // editing an existing person address
        address5: 'Fifth Address',
        address6: 'Sixth Address',
        uuid: 'person-address-uuid'// provide uuid if updating
      }
    ]
  };

  it('should be injected with all dependencies',
    inject([PersonResourceService],
      (personResourceService: PersonResourceService) => {
        expect(personResourceService).toBeTruthy();
      }));

  it('should return a person when the correct uuid is provided', (done) => {

    let personResourceService: PersonResourceService = TestBed.get(PersonResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.url).toContain('person/' + personuid);
      expect(connection.request.url).toContain('v=');
      let options = new ResponseOptions({
        body: JSON.stringify({
        })
      });
      connection.mockRespond(new Response(options));
    });

    personResourceService.getPersonByUuid(personuid)
      .subscribe((response) => {
        done();
      });
  });

  it('should return null when params are not specified', async(inject(
    [PersonResourceService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.subscribe(conn => {
        throw new Error('No requests should be made.');
      });

      const result = service.saveUpdatePerson(null);

      expect(result).toBeNull();
    })));

  it('should call the right endpoint when updating a person', (done) => {

    let s: PersonResourceService = TestBed.get(PersonResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);
    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.url)
        .toEqual('http://example.url.com/ws/rest/v1/person/' + personuid);
      expect(connection.request.method).toBe(RequestMethod.Post);
      let options = new ResponseOptions({
        body: JSON.stringify({})
      });
      connection.mockRespond(new Response(options));
    });

    s.saveUpdatePerson(personuid, personPayload)
      .subscribe((response) => {
        done();
      });
  });
});

