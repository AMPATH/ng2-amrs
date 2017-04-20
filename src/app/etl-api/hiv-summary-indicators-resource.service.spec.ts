import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
    BaseRequestOptions, XHRBackend, Http, RequestMethod,
    ResponseOptions, Response
} from '@angular/http';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HivSummaryIndicatorsResourceService } from './hiv-summary-indicators-resource.service';
import { MockHivSummaryIndicatorsResourceService }
    from './hiv-summary-indicators-resource.service.mock';
import { CacheService } from 'ionic-cache/ionic-cache';
import { DataCacheService } from '../shared/services/data-cache.service';


describe('HivSummaryIndicatorsResourceService Tests', () => {
    let service: HivSummaryIndicatorsResourceService;


    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                MockBackend,
                BaseRequestOptions,
                AppSettingsService,
                LocalStorageService,
                CacheService,
                DataCacheService,
                HivSummaryIndicatorsResourceService,
                MockHivSummaryIndicatorsResourceService,
                {
                    provide: Http,
                    deps: [MockBackend, BaseRequestOptions],
                    useFactory:
                    (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                }
            ]
        });
    });

    it('should be defined',
        inject([HivSummaryIndicatorsResourceService], (s: HivSummaryIndicatorsResourceService) => {
            expect(s).toBeTruthy();
        })
    );

    it('all hiv summary indicators resource methods should be defined',
        inject([HivSummaryIndicatorsResourceService], (s: HivSummaryIndicatorsResourceService) => {
            expect(s.getHivSummaryIndicators).toBeDefined();
            expect(s.getUrl).toBeDefined();
        })
    );

    it('should return hiv summary indicators for a given '
        + ' date range, location,gender and indicators ',
        inject([HivSummaryIndicatorsResourceService, MockBackend,
            MockHivSummaryIndicatorsResourceService],
            (s: HivSummaryIndicatorsResourceService, backend: MockBackend
                , m: MockHivSummaryIndicatorsResourceService) => {
                let expectedResults = m.getHivSummaryIndicatorsDummyData();
                backend.connections.subscribe((connection: MockConnection) => {
                    expect(connection.request.method).toBe(RequestMethod.Get);
                    expect(connection.request.url).toContain('/etl/hiv-summary-indicators');
                    expect(connection.request.url).toEqual('https://amrsreporting.ampath.or.ke:8002'
                        + '/etl/hiv-summary-indicators?endDate=2017-04-29&gender=F'
                        + '&indicators=indicators&limit=300&locationUuids=uuid&startIndex=0');
                    expect(connection.request.url).toContain('locationUuids=uuid');
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: expectedResults
                        }
                        )));
                });
                s.getHivSummaryIndicators('uuid', '2017-03-29',
                    '2017-04-29',
                    'F', 'indicators', undefined, undefined)
                    .subscribe((result) => {
                        expect(result).toBeDefined();
                        expect(result).toEqual(expectedResults);
                    });
            })
    );

});
