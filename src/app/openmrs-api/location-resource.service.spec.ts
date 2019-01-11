import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocationResourceService } from './location-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';

class MockCacheStorageService {
  constructor(a, b) {
  }

  public ready() {
    return true;
  }
}
describe('LocationResourceService Unit Tests', () => {

  let service: LocationResourceService;

  let httpMock: HttpTestingController;

  let appSettingsService: AppSettingsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CacheModule, HttpClientTestingModule],
      declarations: [],
      providers: [
        AppSettingsService,
        LocationResourceService,
        LocalStorageService,
        DataCacheService,
        CacheService,
        {
          provide: CacheStorageService, usefactory: () => {
            return new MockCacheStorageService(null, null);
          }
        }
      ]
    });

    service = TestBed.get(LocationResourceService);

    httpMock = TestBed.get(HttpTestingController);

    appSettingsService = TestBed.get(AppSettingsService);

  }));

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should have getLocations defined', () => {
    expect(service).toBeDefined();
  });

  it('should make API call with correct URL', fakeAsync(() => {
    tick(50);
    service.getLocations(true);

    const req = httpMock.expectOne(appSettingsService.getOpenmrsRestbaseurl().trim() + 'location' + '?v=full');
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams)
      .toContain('/ws/rest/v1/location?v=full');
  }));

  it('It should return an array of location object when getLocation is invoked', () => {

    const results = [
      {
        uuid: 'uuid',
        display: 'location'
      }, {
        uuid: 'uuid',
        display: 'location'
      }
    ];
    service.getLocations()
      .subscribe((result) => {
        expect(results).toContain({ uuid: 'uuid', display: 'location' });
        expect(results).toBeDefined();

      });

    const req = httpMock.expectOne(appSettingsService.getOpenmrsRestbaseurl().trim() + 'location' + '?v=full');
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams)
      .toContain('/ws/rest/v1/location?v=full');
    req.flush(results);
  });


  it('should return a location when the correct uuid is provided without v', () => {
    const locationUuid = 'xxx-xxx-xxx-xxx';
    const results = [
      {
        uuid: 'xxx-xxx-xxx-xxx',
        display: 'location'
      }
    ];

    service.getLocationByUuid(locationUuid)
      .subscribe((result) => {
        expect(results[0].uuid).toBe('xxx-xxx-xxx-xxx');
      });

    // stubbing
    const req = httpMock.expectOne(appSettingsService.getOpenmrsRestbaseurl().trim() + 'location' + '/' + locationUuid + '?v=full');
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams).toContain('location/' + locationUuid);
    expect(req.request.urlWithParams).toContain('v=');
    req.flush(results);
  });
  it('should return a location when the correct uuid is provided with v', (done) => {
    const locationUuid = 'xxx-xxx-xxx-xxx';
    const results = [
      {
        uuid: 'xxx-xxx-xxx-xxx',
        display: 'location'
      }
    ];

    service.getLocationByUuid(locationUuid, false, '9')
      .subscribe((response) => {
        done();
      });

    // stubbing
    const req = httpMock.expectOne(appSettingsService.getOpenmrsRestbaseurl().trim() + 'location' + '/' + locationUuid + '?v=9');
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams).toContain('location/' + locationUuid);
    expect(req.request.urlWithParams).toContain('v=9');
    req.flush(results);
  });

  it('should return a list of locations matching search string provided without v', () => {
    const searchText = 'test';
    const results = [
      {
        uuid: 'uuid',
        display: ''
      },
      {
        uuid: 'uuid',
        display: ''
      }
    ];
    service.searchLocation(searchText)
      .subscribe((data) => {
        // expect(data.length).toBeGreaterThan(0);
      });

    const req = httpMock.expectOne(appSettingsService.getOpenmrsRestbaseurl().trim() + 'location' + '?q=' + searchText + '&v=full');
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams).toContain('q=' + searchText);
    expect(req.request.urlWithParams).toContain('v=');
    req.flush(results);
  });
  it('should return a list of locations matching search string provided with v', (done) => {
    const searchText = 'test';
    const results = [
      {
        uuid: 'uuid',
        display: ''
      },
      {
        uuid: 'uuid',
        display: ''
      }
    ];
    service.searchLocation(searchText, false, '9')
      .subscribe((data) => {
        done();
      });

    const req = httpMock.expectOne(appSettingsService.getOpenmrsRestbaseurl().trim() + 'location' + '?q=' + searchText + '&v=9');
    expect(req.request.method).toBe('GET');
    expect(req.request.urlWithParams).toContain('q=' + searchText);
    expect(req.request.urlWithParams).toContain('v=9');
    req.flush(results);
  });

});
