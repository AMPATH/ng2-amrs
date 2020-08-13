import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { Observable, BehaviorSubject } from 'rxjs';

import { CacheModule, CacheService } from 'ionic-cache';

import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Moh731ResourceService } from './moh-731-resource.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';

class MockCacheStorageService {
    constructor(a, b) { }

    public ready() {
        return true;
    }
}

describe('Moh731ResourceService Tests', () => {
    let service, httpMok;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [CacheModule, HttpClientTestingModule],
            providers: [
                AppSettingsService,
                LocalStorageService,
                CacheService,
                DataCacheService,
                Moh731ResourceService,
                {
                    provide: CacheStorageService, useFactory: () => {
                        return new MockCacheStorageService(null, null);
                    }
                },
            ]
        });
        service = TestBed.get(Moh731ResourceService);
        httpMok = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should be defined',
        inject([Moh731ResourceService], (s: Moh731ResourceService) => {
            expect(s).toBeTruthy();
        })
    );

    it('should hit moh report end-point with the correct parameters',
        () => {
            const s: Moh731ResourceService = TestBed.get(Moh731ResourceService);
            let triggeredBackend = false;
            let errorOnNext = false;
            const mockedResults = {
                result: []
            };

            triggeredBackend = true;

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
                        }, (error) => {
                            expect(true).toBe(true);
                        });
                });

            const req = httpMok.expectOne('https://ngx.ampath.or.ke/etl-latest/etl' +
              '/MOH-731-report?locationUuids=uuid-1,uuid-2&startDate=2017-01-01'
                + '&endDate=2017-03-01&reportName=MOH-731-report-2017&isAggregated=true');
            expect(req.request.method).toBe('GET');
            if (!errorOnNext === true) {
                req.flush(mockedResults);

            } else {
                req.flush({ type: Error, message: 'unknown error' });

            }
        });

    it('should cache moh report data for specified amount of time',
        (done) => {
            const mockedResults = {
                result: []
            };

            const s: Moh731ResourceService = TestBed.get(Moh731ResourceService);
            const cacheService: DataCacheService = TestBed.get(DataCacheService);

            const spy = spyOn(cacheService, 'cacheSingleRequest')
                .and.callFake(() => {
                    const subj = new BehaviorSubject<any>(mockedResults);
                    return subj.asObservable();
                });

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

