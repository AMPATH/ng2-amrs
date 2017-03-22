import { TestBed, async, inject } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
    BaseRequestOptions, XHRBackend, Http, RequestMethod,
    ResponseOptions, Response
} from '@angular/http';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { MonthlyScheduleResourceService } from './monthly-scheduled-resource.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheService } from 'ionic-cache/ionic-cache';
const expected = {
    'results': [
        {
            'date': '2017-02-01',
            'count': {
                'attended': 84,
                'scheduled': 102,
                'not_attended': 37,
                'has_not_returned': 23
            }
        },
        {
            'date': '2017-02-02',
            'count': {
                'attended': 93,
                'scheduled': 119,
                'not_attended': 33,
                'has_not_returned': 32
            }
        },
        {
            'date': '2017-02-03',
            'count': {
                'attended': 30,
                'scheduled': 27,
                'not_attended': 10,
                'has_not_returned': 11
            }
        },
        {
            'date': '2017-02-06',
            'count': {
                'attended': 61,
                'scheduled': 74,
                'not_attended': 22,
                'has_not_returned': 24
            }
        },
        {
            'date': '2017-02-07',
            'count': {
                'attended': 72,
                'scheduled': 89,
                'not_attended': 19,
                'has_not_returned': 29
            }
        },
        {
            'date': '2017-02-08',
            'count': {
                'attended': 96,
                'scheduled': 98,
                'not_attended': 19,
                'has_not_returned': 23
            }
        },
        {
            'date': '2017-02-09',
            'count': {
                'attended': 82,
                'scheduled': 86,
                'not_attended': 11,
                'has_not_returned': 30
            }
        },
        {
            'date': '2017-02-10',
            'count': {
                'attended': 29,
                'scheduled': 13,
                'not_attended': 3,
                'has_not_returned': 4
            }
        },
        {
            'date': '2017-02-13',
            'count': {
                'attended': 37,
                'scheduled': 79,
                'not_attended': 12,
                'has_not_returned': 0
            }
        },
        {
            'date': '2017-02-14',
            'count': {
                'scheduled': 117,
                'not_attended': 12,
                'has_not_returned': 0
            }
        },
        {
            'date': '2017-02-15',
            'count': {
                'scheduled': 109,
                'not_attended': 16,
                'has_not_returned': 0
            }
        }
    ]
};
describe('MonthlyScheduleResourceService Tests', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            providers: [
                MonthlyScheduleResourceService,
                MockBackend,
                BaseRequestOptions,
                AppSettingsService,
                LocalStorageService,
                DataCacheService,
                CacheService,
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
        inject([MonthlyScheduleResourceService], (s: MonthlyScheduleResourceService,
                dataCacheService: DataCacheService,
                cacheService: CacheService) => {
            expect(s).toBeTruthy();
        })
    );

    it('should return a list containing visits and appointments for a given months',
        inject([MonthlyScheduleResourceService, MockBackend],
            (s: MonthlyScheduleResourceService, backend: MockBackend) => {
                backend.connections.subscribe((connection: MockConnection) => {
                    expect(connection.request.method).toBe(RequestMethod.Get);
                    expect(connection.request.url).toContain('/etl/get-monthly-schedule');
                    expect(connection.request.url).toContain('endDate=2017-02-28');
                    expect(connection.request.url).toContain('startDate=2017-02-01');
                    expect(connection.request.url).toContain('locationUuids=uuid');
                    expect(connection.request.url).toContain('limit=1000000');
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: expected
                        }
                        )));
                });

                expect(s.getMonthlySchedule).toBeDefined();
                s.getMonthlySchedule({
                    startDate: '2017-02-01',
                    endDate: '2017-02-28',
                    locationUuids: 'uuid',
                    limit: '1000000'
                }).subscribe((result) => {
                    expect(result).toBeDefined();
                    expect(result).toEqual(expected.results);
                });
            })
    );
});
