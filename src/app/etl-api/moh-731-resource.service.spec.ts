import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
    BaseRequestOptions, XHRBackend, Http, RequestMethod,
    ResponseOptions, Response
} from '@angular/http';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

import { CacheModule, CacheService } from 'ionic-cache';

import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings';
import { Moh731ResourceService } from './moh-731-resource.service';
import { DataCacheService } from '../shared/services/data-cache.service';
describe('Moh731ResourceService Tests', () => {
    let service;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
          imports: [CacheModule],
            providers: [
                MockBackend,
                BaseRequestOptions,
                AppSettingsService,
                LocalStorageService,
                CacheService,
                DataCacheService,
                {
                    provide: Http,
                    deps: [MockBackend, BaseRequestOptions],
                    useFactory:
                    (backend: XHRBackend, defaultOptions: BaseRequestOptions) => {
                        return new Http(backend, defaultOptions);
                    }
                },
                Moh731ResourceService
            ]
        });
    });

    it('should be defined',
        inject([Moh731ResourceService], (s: Moh731ResourceService) => {
            expect(s).toBeTruthy();
        })
    );

    it('should hit moh report end-point with the correct parameters',
        (done) => {
            let s: Moh731ResourceService = TestBed.get(Moh731ResourceService);
            let backend: MockBackend = TestBed.get(MockBackend);
            let triggeredBackend = false;
            let errorOnNext = false;
            const mockedResults = {
                result: []
            };

            backend.connections.subscribe((connection: MockConnection) => {
                expect(connection.request.method).toBe(RequestMethod.Get);
                expect(connection.request.url).toEqual('https://amrsreporting.ampath.or.ke:8002'
                    + '/etl/MOH-731-report?locationUuids=uuid-1,uuid-2&startDate=2017-01-01'
                    + '&endDate=2017-03-01&reportName=MOH-731-report-2017&isAggregated=true');
                triggeredBackend = true;
                if (!errorOnNext === true) {
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: mockedResults
                        }
                        )));
                } else {
                    connection.mockError(new Error('unknown error'));
                }
            });

            s.getMoh731Report('uuid-1,uuid-2', '2017-01-01', '2017-03-01', false, true)
                .subscribe((result) => {
                    expect(result).toBeDefined();
                    expect(result).toEqual(mockedResults);
                    expect(triggeredBackend).toBe(true);

                    // test for error handling
                    errorOnNext = true;

                    s.getMoh731Report('uuid-1,uuid-2', '2017-01-01', '2017-03-01', false, true)
                        .subscribe((result2) => {
                            // didn't expect error at this point
                            expect(true).toBe(false); // force test to fail
                            done();
                        }, (error) => {
                            expect(true).toBe(true);
                            done();
                        });
                });
        });

    it('should cache moh report data for specified amount of time',
        (done) => {
            const mockedResults = {
                result: []
            };

            let s: Moh731ResourceService = TestBed.get(Moh731ResourceService);
            let cacheService: DataCacheService = TestBed.get(DataCacheService);

            let spy = spyOn(cacheService, 'cacheSingleRequest')
                .and.callFake(() => {
                    let subj = new BehaviorSubject<any>(mockedResults);
                    return subj.asObservable();
                });

            let triggeredBackend = false;
            let backendHitCount = 0;

            s.getMoh731Report('uuid-1,uuid-2', '2017-01-01', '2017-03-01', false, true,
                5 * 60 * 1000) // cache for 5 minutes
                .subscribe((result) => {
                    expect(result).toBeDefined();
                    expect(result).toEqual(mockedResults);

                    // test for data caching
                    s.getMoh731Report('uuid-1,uuid-2', '2017-01-01', '2017-03-01', false, true,
                        5 * 60 * 1000) // cache for 5 minutes)
                        .subscribe((result2) => {
                            expect(result2).toEqual(mockedResults);
                            expect(spy.calls.count()).toBe(2);
                            done();
                        });
                });
        });
});

