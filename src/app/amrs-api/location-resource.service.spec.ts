import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, BaseRequestOptions, ResponseOptions, RequestMethod } from '@angular/http';
import { LocationResourceService } from './location-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';

// Load the implementations that should be tested

describe('FormsResourceService Unit Tests', () => {
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
        LocationResourceService,
        LocalStorageService
      ],
    });
  }));

  it('should have getLocations defined',
    inject([LocationResourceService],
      (locationResourceService: LocationResourceService) => {
        expect(locationResourceService.getLocations()).toBeTruthy();
      }));

  it('should make API call with correct URL',
    inject([LocationResourceService, MockBackend],
      fakeAsync((locationResourceService: LocationResourceService, backend: MockBackend) => {
        backend.connections.subscribe((connection: MockConnection) => {

          expect(connection.request.method).toBe(RequestMethod.Get);
          expect(connection.request.url).toBe(
            'http://localhost:8080/openmrs/ws/rest/v1/location?v=default');
        });
        expect(locationResourceService.getLocations());
      })));

  it('It should return an array of location object when getLocation is invoked',
    inject([MockBackend, LocationResourceService],
      (backend: MockBackend, locationResourceService: LocationResourceService) => {
        // stubbing
        backend.connections.subscribe((connection: MockConnection) => {
          let options = new ResponseOptions({
            body: JSON.stringify({
              results: [
                {name: 'location1'},
                {name: 'location2'}
              ]
            })
          });
          connection.mockRespond(new Response(options));
        });

        locationResourceService.getLocations()
          .subscribe((response) => {
            expect(response).toContain({name: 'location1'});
            expect(response).toBeDefined();
            expect(response.length).toBeGreaterThan(1);

          });
      }));

});
