import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Http, Response, BaseRequestOptions, ResponseOptions, RequestMethod } from '@angular/http';
import { IndicatorResourceService } from './indicator-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';

// Load the implementations that should be tested
describe('IndicatorResourceService Unit Tests', () => {
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
        IndicatorResourceService,
        LocalStorageService
      ],
    });
  }));

  it('should have getIndicators defined',
    inject([IndicatorResourceService],
      (indicatorResourceService: IndicatorResourceService) => {
        expect(indicatorResourceService.getReportIndicators({ report: 'reportName' })).toBeTruthy();
      }));

  it('should make API call with correct URL',
    inject([IndicatorResourceService, MockBackend],
      fakeAsync((indicatorResourceService: IndicatorResourceService, backend: MockBackend) => {
        backend.connections.subscribe((connection: MockConnection) => {

          expect(connection.request.method).toBe(RequestMethod.Get);
          expect(connection.request.url).toContain('/indicators-schema?report=reportName');
        });
        expect(indicatorResourceService.getReportIndicators({ report: 'reportName' }));
      })));

  it('It should return an array of Indicator object when getIndicator is invoked',
    inject([MockBackend, IndicatorResourceService],
      (backend: MockBackend, indicatorResourceService: IndicatorResourceService) => {
        // stubbing
        backend.connections.subscribe((connection: MockConnection) => {
          let options = new ResponseOptions({
            body: JSON.stringify({
              result: [
                { name: 'Indicator1' },
                { name: 'Indicator2' }
              ]
            })
          });
          connection.mockRespond(new Response(options));
        });

        indicatorResourceService.getReportIndicators({ report: 'reportName' })
          .subscribe((response) => {
            expect(response).toContain({ name: 'Indicator1' });
            expect(response).toBeDefined();
            expect(response['length']).toBeGreaterThan(1);

          });
      }));

});
