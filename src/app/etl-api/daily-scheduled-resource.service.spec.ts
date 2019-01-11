import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DailyScheduleResourceService } from './daily-scheduled-resource.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';

class MockCacheStorageService {
    constructor(a, b) { }

    public ready() {
        return true;
    }
}

const expectedResults = {
    startIndex: 0,
    size: 3,
    result: [
        {
            person_id: 111,
            uuid: 'uuid-1',
            given_name: 'GIven Name',
            middle_name: 'Middle Name',
            family_name: 'Family Name',
            identifiers: 'identifier-1,identifier-2',
            gender: 'M',
            age: 66
        },
        {
            person_id: 112,
            uuid: 'uuid-2',
            given_name: 'GIven Name',
            middle_name: 'Middle Name',
            family_name: 'Family Name',
            identifiers: 'identifier-11,identifier-22',
            gender: 'F',
            age: 47
        }
    ]
};
describe('DailyScheduleResourceService Tests', () => {
    let s: DailyScheduleResourceService;
    let httpMock: HttpTestingController;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [CacheModule, HttpClientTestingModule],
            providers: [
                DailyScheduleResourceService,
                AppSettingsService,
                LocalStorageService,
                CacheService,
                DataCacheService,
                {
                    provide: CacheStorageService, useFactory: () => {
                        return new MockCacheStorageService(null, null);
                    }
                },
            ]
        });
        httpMock = TestBed.get(HttpTestingController);
        s = TestBed.get(DailyScheduleResourceService);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should be defined', () => {
        expect(s).toBeTruthy();
    });

    it('all daily schedule resource methods should be defined', () => {
        expect(s.getDailyVisits).toBeDefined();
        expect(s.getDailyAppointments).toBeDefined();
        expect(s.getDailyHasNotReturned).toBeDefined();
    });

    it('should return a list containing daily appointments for a given date', () => {

        s.getDailyAppointments({
            startDate: '2017-02-01',
            startIndex: undefined,
            locationUuids: 'uuid',
            limit: undefined
        }).subscribe((result) => {
            expect(result).toBeDefined();
            expect(result).toEqual(expectedResults.result);
        });

        const req = httpMock.expectOne('https://amrsreporting.ampath.or.ke:8002'
            + '/etl/daily-appointments/2017-02-01?'
            + 'startIndex=0&startDate=2017-02-01&locationUuids=uuid&limit=300');
        expect(req.request.method).toBe('GET');
        expect(req.request.urlWithParams).toContain('/etl/daily-appointments/2017-02-01');
        expect(req.request.urlWithParams).toContain('locationUuids=uuid');
        expect(req.request.urlWithParams).toContain('limit=300');
        req.flush(expectedResults);
    });

    it('should return a list containing visits for a given date', () => {
        s.getDailyVisits({
            startDate: '2017-02-01',
            startIndex: '0',
            locationUuids: 'uuid',
            limit: '100'
        }).subscribe((result) => {
            expect(result).toBeDefined();
            expect(result).toEqual(expectedResults.result);
        });

        const req = httpMock.expectOne('https://amrsreporting.ampath.or.ke:8002'
            + '/etl/daily-visits/2017-02-01?startIndex=0'
            + '&startDate=2017-02-01&locationUuids=uuid&limit=100');
        expect(req.request.method).toBe('GET');
        expect(req.request.urlWithParams).toContain('/etl/daily-visits/2017-02-01');
        expect(req.request.urlWithParams).toContain('locationUuids=uuid');
        expect(req.request.urlWithParams).toContain('limit=100');
        req.flush(expectedResults);
    });


    it('should return a list containing daily-has-not-returned for a given date', () => {
        s.getDailyHasNotReturned({
            startDate: '2017-02-01',
            startIndex: '0',
            locationUuids: 'uuid',
            limit: '100'
        }).subscribe((result) => {
            expect(result).toBeDefined();
            expect(result).toEqual(expectedResults.result);
        });

        const req = httpMock.expectOne('https://amrsreporting.ampath.or.ke:8002'
            + '/etl/daily-has-not-returned/2017-02-01?'
            + 'startIndex=0&startDate=2017-02-01&locationUuids=uuid&limit=100');
        expect(req.request.method).toBe('GET');
        expect(req.request.urlWithParams).
            toContain('/etl/daily-has-not-returned/2017-02-01');
        expect(req.request.urlWithParams).toContain('locationUuids=uuid');
        expect(req.request.urlWithParams).toContain('limit=100');
        req.flush(expectedResults);
    });

});
