import { TestBed, async, inject } from '@angular/core/testing';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { MonthlyScheduleResourceService } from './monthly-scheduled-resource.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
class MockCacheStorageService {
    constructor(a, b) { }

    public ready() {
        return true;
    }
}

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
    let service, httpMock;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [CacheModule, HttpClientTestingModule],
            providers: [
                MonthlyScheduleResourceService,
                AppSettingsService,
                LocalStorageService,
                DataCacheService,
                CacheService,
                {
                    provide: CacheStorageService, useFactory: () => {
                        return new MockCacheStorageService(null, null);
                    }
                }
            ]
        });
        service = TestBed.get(MonthlyScheduleResourceService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });


    it('should be defined',
        inject([MonthlyScheduleResourceService], (s: MonthlyScheduleResourceService,
            dataCacheService: DataCacheService,
            cacheService: CacheService) => {
            expect(s).toBeTruthy();
        })
    );

    it('should return a list containing visits and appointments for a given months', () => {

        expect(service.getMonthlySchedule).toBeDefined();
        service.getMonthlySchedule({
            startDate: '2017-02-01',
            endDate: '2017-02-28',
            locationUuids: 'uuid',
            limit: '1000000'
        }).subscribe((result) => {
            expect(result).toBeDefined();
            expect(result).toEqual(expected.results);
        });

        // const req = httpMock.expectOne(service.getUrl() + '?startDate=2017-02-01&endDate=2017-02-28&locationUuids=uuid&limit=1000000');
        // req.flush(expected);
    });
});
