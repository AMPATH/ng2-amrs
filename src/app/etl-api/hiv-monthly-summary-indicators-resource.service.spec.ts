import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { LocalStorageService } from '../utils/local-storage.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import {
    HivMonthlySummaryIndicatorsResourceService
} from './hiv-monthly-summary-indicators-resource.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';

class MockCacheStorageService {
    constructor(a, b) { }

    public ready() {
        return true;
    }
}

const expectedHivMonthlySummaryIndicatorsResults = {
    startIndex: 0,
    size: 1,
    result: [
        {
            location: 'location name',
            location_uuid: 'location-uuid',
            location_id: 13,
            encounter_datetime: '2017-04-26T05:48:32.000Z',
            month: '2017-04-26T05:48:32.000Z',
            reporting_month: '04/2017',
            on_arvs: 2889,
        },
        {
            location: 'location name',
            location_uuid: 'location-uuid',
            location_id: 13,
            encounter_datetime: '2017-04-26T05:48:32.000Z',
            month: '2017-05-26T05:48:32.000Z',
            reporting_month: '05/2017',
            on_arvs: 2889,
        }
    ],
    indicatorDefinitions: [{

    }]
};

const reportParams = {
    startIndex: 0,
    startDate: '2017-03-01',
    locationUuids: '08fec056-1352-11df-a1f1-0026b9348838',
    limit: 10,
    endDate: '2017-04-27',
    gender: 'M,F',
    indicators: 'on_arvs',
    startAge: 0,
    endAge: 110
};

const patientList = {
    startIndex: 0,
    size: 3,
    result: [
        {
            person_id: 1817,
            encounter_id: 6774060,
            location_id: 13,
            location_uuid: '08fec056-1352-11df-a1f1-0026b9348838',
            patient_uuid: '5b737014-1359-11df-a1f1-0026b9348838',
            gender: 'F',
            birthdate: '1982-12-11T21:00:00.000Z',
            age: 34

        }
    ]
};

describe('HivMonthlySummaryIndicatorsResourceService Tests', () => {
    let s, httpMock;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [CacheModule, HttpClientTestingModule],
            providers: [
                HivMonthlySummaryIndicatorsResourceService,
                AppSettingsService,
                LocalStorageService,
                CacheService,
                DataCacheService,
                {
                    provide: CacheStorageService, useFactory: () => {
                        return new MockCacheStorageService(null, null);
                    }
                }
            ]
        });
        s = TestBed.get(HivMonthlySummaryIndicatorsResourceService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should be defined', () => {
        expect(s).toBeTruthy();
    });

    it('Hiv monthly Summary Indicators resource service resource methods should be defined', () => {
        expect(s.getUrl).toBeDefined();
        expect(s.getPatientListUrl).toBeDefined();
        expect(s.getHivSummaryMonthlyIndicatorsReport).toBeDefined();
        expect(s.getHivSummaryMonthlyIndicatorsPatientList).toBeDefined();
    });

    xit('should return report urlRequest parameters', () => {
        const urlParams = s.getUrlRequestParams(reportParams);
        const params = urlParams.toString();
        expect(params).toContain('locationUuids=08fec056-1352-11df-a1f1-0026b9348838');
        expect(params).toContain('endDate=2017-04-27');
        expect(params).toContain('gender=M,F');
        expect(params).toContain('startDate=2017-03-01');
        expect(params).toContain('indicators=on_arvs');
        expect(params).toContain('startAge=0');
        expect(params).toContain('endAge=110');

    });

    it('should return Hiv monthly Summary Indicators Report', () => {

        s.getHivSummaryMonthlyIndicatorsReport(reportParams).subscribe((result) => { });

        const req = httpMock.expectNone('');
    });

    it('should return Hiv monthly Summary Indicators Report Patient List', () => {

        s.getHivSummaryMonthlyIndicatorsPatientList(reportParams).subscribe((result) => {
            expect(result).toBeDefined();
            expect(result).toEqual(patientList.result);
        });

    });

});
