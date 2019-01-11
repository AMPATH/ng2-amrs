import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { IndicatorResourceService } from './indicator-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheService, CacheModule } from 'ionic-cache';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';

// Load the implementations that should be tested
class MockCacheStorageService {
  constructor(a, b) { }

  public ready() {
    return true;
}
}

describe('IndicatorResourceService Unit Tests', () => {
  let service, httpMock;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [CacheModule, HttpClientTestingModule],
      declarations: [],
      providers: [
        AppSettingsService,
        IndicatorResourceService,
        LocalStorageService,
        DataCacheService,
        CacheService,
        {
          provide: CacheStorageService, useFactory: () => {
            return new MockCacheStorageService(null, null);
          }
        },
      ],
    });
    service = TestBed.get(IndicatorResourceService);
    httpMock = TestBed.get(HttpTestingController);
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have getIndicators defined',
    inject([IndicatorResourceService],
      (indicatorResourceService: IndicatorResourceService) => {
        expect(indicatorResourceService.getReportIndicators({ report: 'reportName' })).toBeTruthy();
      }));

  it('should make API call with correct URL', () => {
    expect(service.getReportIndicators({ report: 'reportName' }));
    service.getReportIndicators({ report: 'reportName' }).subscribe();
    const req = httpMock.expectOne(service.getUrl() + '?report=reportName');
    expect(req.request.urlWithParams).toContain('?report=reportName');
    expect(req.request.method).toBe('GET');
    req.flush(JSON.stringify({
      result: [
        { name: 'Indicator1' },
        { name: 'Indicator2' }
      ]
    }));
  });

  it('It should return an array of Indicator object when getIndicator is invoked', () => {

    service.getReportIndicators({ report: 'reportName' })
      .subscribe((response) => {
        expect(response['length']).toBeGreaterThan(1);

      });

    // tslint:disable-next-line:no-shadowed-variable
    const req = httpMock.expectOne(service.getUrl() + '?report=reportName');
    expect(req.request.method).toBe('GET');
    req.flush(JSON.stringify({
      result: [
        { name: 'Indicator1' },
        { name: 'Indicator2' }
      ]
    }));

  });
});
