import { async, inject, TestBed } from '@angular/core/testing';
import {
  BaseRequestOptions, Http, HttpModule, Response,
  ResponseOptions, RequestMethod
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';

import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings';
import { ProgramWorkFlowStateResourceService } from './program-workflow-state-resource.service';

describe('Service: ProgramWorkFlowStateResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgramWorkFlowStateResourceService,
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

  let programWorkFlowStateResponse = {
              'results': [
                {
              'uuid': '78238ed8-1359-11df-a1f1-0026b9348838',
              'concept': {
              'uuid': 'a8b0ea90-1350-11df-a1f1-0026b9348838',
              'display': 'C1'
              }
              },
                {
              'uuid': '7823ecfc-1359-11df-a1f1-0026b9348838',
              'concept': {
              'uuid': 'a8b0eb6c-1350-11df-a1f1-0026b9348838',
              'display': 'C2'
              }
              }
              ]
};

  it('should be defined', async(inject(
    [ProgramWorkFlowStateResourceService, MockBackend], (service, mockBackend) => {

      expect(service).toBeDefined();
    })));


  it('should return null when programWorkFlowUuid not specified', async(inject(
    [ProgramWorkFlowStateResourceService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.subscribe((conn) => {
        throw new Error('No requests should be made.');
      });

      const result = service.getProgramWorkFlowState(null);

      expect(result).toBeNull();
    })));

  it('should call the right endpoint when fetching workflow states', async(inject(
    [ProgramWorkFlowStateResourceService, MockBackend], (service, mockBackend) => {
      let programWorkFlowUuid = 'uuid';
      mockBackend.connections.subscribe((conn) => {
        expect(conn.request.url)
          .toBe('http://example.url.com/ws/rest/v1/workflow/uuid/state?v=' +
            'custom:(uuid,initial,terminal,concept:(uuid,retired,display))');
        expect(conn.request.method).toBe(RequestMethod.Get);
        conn.mockRespond(new Response(
          new ResponseOptions({body: JSON.stringify(programWorkFlowStateResponse)})));
      });

      service.getProgramWorkFlowState(programWorkFlowUuid);
    })));


  it('should return null when params are not specified', async(inject(
    [ProgramWorkFlowStateResourceService, MockBackend], (service, mockBackend) => {

      mockBackend.connections.subscribe((conn) => {
        throw new Error('No requests should be made.');
      });

      const result = service.getProgramWorkFlowState(null);

      expect(result).toBeNull();
    })));

});





