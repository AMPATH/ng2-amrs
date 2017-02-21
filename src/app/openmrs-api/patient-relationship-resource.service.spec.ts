import { async, inject, TestBed } from '@angular/core/testing';
import {
  BaseRequestOptions, Http, HttpModule, Response,
  ResponseOptions, RequestMethod
} from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';

import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { PatientRelationshipResourceService } from './patient-relationship-resource.service';

describe('Service: Pratient Relationship ResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientRelationshipResourceService,
        AppSettingsService,
        LocalStorageService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
      imports: [
        HttpModule
      ]
    });
  });

  let patientRelationshipResponse = {
    results: [
      {
        uuid: 'c7a62ab1-f034-4da3-bdce-87ce655521b8',
        display: 'Robai is the Caretaker of BRAVIN',
        personA: {
          uuid: 'b4ddd369-bec5-446e-b8f8-47fd5567b295',
          display: 'Robai Tests Robai'
        },
        relationshipType: {
          uuid: '7878de42-1359-11df-a1f1-0026b9348838',
          display: 'Caretaker/Patient'
        },
        personB: {
          uuid: '922fc86d-ad42-4c50-98a6-b1f310863c07',
          display: 'BRAVIN TESTIMONY ALUSA'
        },
        voided: false,
        startDate: '2016-07-22T00:00:00.000+0300',
        endDate: null,
        resourceVersion: '1.9'
      }]
  };

  let relationshipPayload = {
    personA: 'personAuuid',
    relationshipType: 'relationshipTypeUUid',
    personB: 'personBuuid',
    startDate: '2016-07-22T00:00:00.000+0300'
  };

  it('should be defined', async(inject(
    [PatientRelationshipResourceService, MockBackend], (service, mockBackend) => {

      expect(service).toBeDefined();
    })));

  it('should return null when PatientUuid not specified'
    + 'when fetching patient relationships', async(inject(
      [PatientRelationshipResourceService, MockBackend], (service, mockBackend) => {

        mockBackend.connections.subscribe(conn => {
          throw new Error('No requests should be made.');
        });

        const result = service.getPatientRelationships(null);
        expect(result).toBeNull();
      })));



  it('should call the right endpoint when getting person relationships', (done) => {

    let s: PatientRelationshipResourceService = TestBed.get(PatientRelationshipResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);

    let personUuid = 'uuid';

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.url)
        .toEqual('http://example.url.com/ws/rest/v1/relationship?v=full&person=uuid');
      expect(connection.request.url).toContain('v=');
      expect(connection.request.method).toBe(RequestMethod.Get);
      let options = new ResponseOptions({
        body: JSON.stringify(patientRelationshipResponse)
      });
      connection.mockRespond(new Response(options));
    });

    s.getPatientRelationships(personUuid)
      .subscribe((response) => {
        done();
      });
  });

  it('should call the right endpoint when updating person relationships', (done) => {

    let s: PatientRelationshipResourceService = TestBed.get(PatientRelationshipResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);
    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.url)
        .toEqual('http://example.url.com/ws/rest/v1/relationship');
      expect(connection.request.method).toBe(RequestMethod.Post);
      let options = new ResponseOptions({
        body: JSON.stringify(patientRelationshipResponse)
      });
      connection.mockRespond(new Response(options));
    });

    s.saveRelationship(relationshipPayload)
      .subscribe((response) => {
        done();
      });
  });


  it('should return null when PatientUuid not specified'
    + 'when deleting person relationships', async(inject(
      [PatientRelationshipResourceService, MockBackend], (service, mockBackend) => {

        mockBackend.connections.subscribe(conn => {
          throw new Error('No requests should be made.');
        });

        const result = service.deleteRelationship(null);
        expect(result).toBeNull();
      })));

  it('should call the right endpoint when deleting person relationships', (done) => {

    let s: PatientRelationshipResourceService = TestBed.get(PatientRelationshipResourceService);
    let backend: MockBackend = TestBed.get(MockBackend);
    let relationshipUuid = 'uuid';
    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.url)
        .toEqual('http://example.url.com/ws/rest/v1/relationship/uuid');
      expect(connection.request.method).toBe(RequestMethod.Delete);
      let options = new ResponseOptions({
        body: JSON.stringify(patientRelationshipResponse)
      });
      connection.mockRespond(new Response(options));
    });

    s.deleteRelationship(relationshipUuid)
      .subscribe((response) => {
        done();
      });
  });


});





