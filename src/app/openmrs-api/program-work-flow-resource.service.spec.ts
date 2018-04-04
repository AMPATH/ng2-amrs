import { async, inject, TestBed } from '@angular/core/testing';
import {
  BaseRequestOptions, Http, HttpModule, Response,
  ResponseOptions, RequestMethod
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings';
import { ProgramWorkFlowResourceService } from './program-workflow-resource.service';

describe('Service: ProgramWorkFlowResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgramWorkFlowResourceService,
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

  let programWorkFlowResponse = {
    results: [
      {
          'uuid': 'fc15ac01-5381-4854-bf5e-917c907aa77f',
          'display': 'CDM',
          'allWorkflows': [
            {
          'uuid': '2f37c1c4-4461-41fa-b737-1768e668164c',
          'concept': {
          'uuid': 'a893436e-1350-11df-a1f1-0026b9348838',
          'display': 'DIABETES MELLITUS'
          }
          },
            {
          'uuid': '9ed17a8d-d26b-426a-8ff8-1cf39d2d2b76',
          'concept': {
          'uuid': 'a8986880-1350-11df-a1f1-0026b9348838',
          'display': 'HYPERTENSION'
          }
         }
],
}]
  };

  it('should be defined', async(inject(
    [ProgramWorkFlowResourceService, MockBackend], (service, mockBackend) => {

      expect(service).toBeDefined();
    })));


  it('should return null when programUuid not specified', async(inject(
    [ProgramWorkFlowResourceService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.subscribe((conn) => {
        throw new Error('No requests should be made.');
      });

      const result = service.getProgramWorkFlows(null);

      expect(result).toBeNull();
    })));

  it('should call the right endpoint', async(inject(
    [ProgramWorkFlowResourceService, MockBackend], (service, mockBackend) => {
      let programUuid = 'uuid';
      mockBackend.connections.subscribe((conn) => {
        expect(conn.request.url)
          .toBe('http://example.url.com/ws/rest/v1/program/uuid?v=custom:(uuid,display,' +
            'allWorkflows:(uuid,concept:(uuid,display),states:(uuid,initial,terminal,' +
            'concept:(uuid,display))))');
        expect(conn.request.method).toBe(RequestMethod.Get);
        conn.mockRespond(new Response(
          new ResponseOptions({body: JSON.stringify(programWorkFlowResponse)})));
      });

      service.getProgramWorkFlows(programUuid);
    })));


  it('should return null when params are not specified', async(inject(
    [ProgramWorkFlowResourceService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.subscribe((conn) => {
        throw new Error('No requests should be made.');
      });

      const result = service.getProgramWorkFlows(null);

      expect(result).toBeNull();
    })));
});





