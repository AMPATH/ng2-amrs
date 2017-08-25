
import { TestBed, async, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, ResponseOptions, Response, RequestMethod } from '@angular/http';

import { AppSettingsService } from '../app-settings';
import { LocalStorageService } from '../utils/local-storage.service';
import { LabOrderResourceService } from './lab-order-resource.service';

describe('Lab Order Resource Service Unit Tests', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
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
        LabOrderResourceService,
        AppSettingsService,
        LocalStorageService
      ]
    });

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([LabOrderResourceService],
      (labOrderResourceService: LabOrderResourceService) => {
      expect(labOrderResourceService).toBeTruthy();
    }));

  it('should make a call with the correct parameters',
    inject([LabOrderResourceService, MockBackend],
      (labOrderResourceService: LabOrderResourceService, backend: MockBackend) => {
        let expectedResults = {'result': {'locationUuid': '1234'}};
        backend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.method).toBe(RequestMethod.Post);
          expect(connection.request.url).toContain('eid/order');
          connection.mockRespond(new Response(
            new ResponseOptions({
                body: expectedResults
              }
            )));
        });

        let location = 'ampath';
        let payload = {
          'test': 'test'
        };

        labOrderResourceService.postOrderToEid(location, payload)
          .subscribe((result) => {
            expect(result).toBeDefined();
            expect(result).toEqual(expectedResults);
          });
      })
  );
});
