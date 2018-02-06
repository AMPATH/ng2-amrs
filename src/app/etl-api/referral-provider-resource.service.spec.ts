import { TestBed, async, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, BaseRequestOptions, ResponseOptions, Response, RequestMethod } from '@angular/http';

import { AppSettingsService } from '../app-settings';
import { LocalStorageService } from '../utils/local-storage.service';
import { ReferralProviderResourceService } from './referral-provider-resource.service';


describe('Referral Provider Resource Service Unit Tests', () => {

  let backend: MockBackend, locationUuid = 'location-uuid',
   providerUuids = 'provider-uuid', stateUuids = 'state-uuid';

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
        ReferralProviderResourceService,
        AppSettingsService,
        LocalStorageService
      ]
    });

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([ReferralProviderResourceService],
     (referralResourceService: ReferralProviderResourceService) => {
      expect(referralResourceService).toBeTruthy();
    }));

  it('should make API call with the correct url parameters', () => {

    backend = TestBed.get(MockBackend);

    backend.connections.subscribe((connection: MockConnection) => {

      expect(connection.request.method).toBe(RequestMethod.Get);
      expect(connection.request.url).toMatch('/patient-referral-list');
      expect(connection.request.url).toContain('startIndex=');
      expect(connection.request.url).toContain('limit=20');

    });


  });

  it('should return the correct parameters from the api',
    async(inject([ReferralProviderResourceService, MockBackend],
      (referralResourceService: ReferralProviderResourceService, mockBackend: MockBackend) => {

        mockBackend.connections.subscribe((c) =>
          c.mockError(new Error('An error occured while processing the request')));

        referralResourceService.getReferralProviders(locationUuid, providerUuids, stateUuids,
         0, 20).subscribe((data) => { },
          (error: Error) => {
            expect(error).toBeTruthy();

          });

      })));

});
