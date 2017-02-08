import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, BaseRequestOptions, ResponseOptions, RequestMethod } from '@angular/http';
import { LocationResourceService } from './location-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';

// Load the implementations that should be tested

describe('LocationResourceService Unit Tests', () => {
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
          expect(connection.request.url).toContain('/ws/rest/v1/location?v=full');
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
                {
                  uuid: 'uuid',
                  display: 'location'
                }, {
                  uuid: 'uuid',
                  display: 'location'
                }
              ]
            })
          });
          connection.mockRespond(new Response(options));
        });

        locationResourceService.getLocations()
          .subscribe((response) => {
            expect(response).toContain({ uuid: 'uuid', display: 'location' });
            expect(response).toBeDefined();

          });
      }));

  it('should return a location when the correct uuid is provided',
    inject([MockBackend, LocationResourceService],
      (backend: MockBackend, locationResourceService: LocationResourceService) => {
        // stubbing
        let locationUuid = 'xxx-xxx-xxx-xxx';
        backend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.url).toContain('location/' + locationUuid);
          expect(connection.request.url).toContain('v=');

          let options = new ResponseOptions({
            body: JSON.stringify({
              results: [
                {
                  uuid: 'xxx-xxx-xxx-xxx',
                  display: 'location'
                }
              ]
            })
          });
          connection.mockRespond(new Response(options));
        });

        locationResourceService.getLocationByUuid(locationUuid)
          .subscribe((response) => {
            expect(response.results[0].uuid).toBe('xxx-xxx-xxx-xxx');
          });
      }));

  it('should return a list of locations matching search string provided',
    inject([MockBackend, LocationResourceService],
      (backend: MockBackend, locationResourceService: LocationResourceService) => {
        // stubbing
        let searchText = 'test';
        backend.connections.subscribe((connection: MockConnection) => {
          expect(connection.request.url).toContain('q=' + searchText);
          expect(connection.request.url).toContain('v=');

          let options = new ResponseOptions({
            body: JSON.stringify({
              results: [
                {
                  uuid: 'uuid',
                  display: ''
                },
                {
                  uuid: 'uuid',
                  display: ''
                }
              ]
            })
          });
          connection.mockRespond(new Response(options));
        });

        locationResourceService.searchLocation(searchText)
          .subscribe((data) => {
            expect(data.length).toBeGreaterThan(0);
          });

      }));

});
