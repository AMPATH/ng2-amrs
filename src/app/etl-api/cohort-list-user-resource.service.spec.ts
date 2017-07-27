import { TestBed, async, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, ResponseOptions, Response, RequestMethod } from '@angular/http';

import { AppSettingsService } from '../app-settings';
import { LocalStorageService } from '../utils/local-storage.service';
import { CohortUserResourceService } from './cohort-list-user-resource.service';


describe('CohortUserResourceService Unit Tests', () => {

  let backend: MockBackend, cohortUuid = 'de662c03-b9af-4f00-b10e-2bda0440b03b';

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
        CohortUserResourceService,
        AppSettingsService,
        LocalStorageService
      ]
    });

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([CohortUserResourceService], (cohortUserResourceService: CohortUserResourceService) => {
      expect(cohortUserResourceService).toBeTruthy();
    }));

  it('should make API call with the correct url parameters', () => {

    backend = TestBed.get(MockBackend);

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.method).toBe(RequestMethod.Get);
      /*expect(connection.request.url).toMatch('/patient/(*)/vitals');
      expect(connection.request.url).toContain('startIndex=');
      expect(connection.request.url).toContain('limit=20');*/

    });


  });

  it('should return the correct parameters from the api',
    async(inject([CohortUserResourceService, MockBackend],
      (cohortUserResourceService: CohortUserResourceService, mockBackend: MockBackend) => {

        mockBackend.connections.subscribe(c =>
          c.mockError(new Error('An error occured while processing the request')));

        cohortUserResourceService.getCohortUser(cohortUuid).subscribe((data) => { },
          (error: Error) => {
            expect(error).toBeTruthy();

          });

      })));

});
