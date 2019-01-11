import { TestBed, async, inject, fakeAsync, flush } from '@angular/core/testing';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HivClinicFlowResourceService } from './hiv-clinic-flow-resource.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { DataCacheService } from '../shared/services/data-cache.service';
import { MockHivClinicFlowResourceService } from './hiv-clinic-flow-resource.service.mock';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';

class MockCacheStorageService {
    constructor(a, b) { }

    public ready() {
        return true;
    }
}
describe('HivClinicFlowResourceService Tests', () => {
    let s, httpMock;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
            imports: [CacheModule, HttpClientTestingModule],
            providers: [
                HivClinicFlowResourceService,
                AppSettingsService,
                LocalStorageService,
                CacheService,
                DataCacheService,
                {
                    provide: MockHivClinicFlowResourceService,
                    useFactory: () => {
                        return new MockHivClinicFlowResourceService();
                    }
                },
                {
                    provide: CacheStorageService, useFactory: () => {
                        return new MockCacheStorageService(null, null);
                    }
                }

            ]
        });
        s = TestBed.get(HivClinicFlowResourceService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should be defined', () => {
        expect(s).toBeTruthy();
    });

    it('all hiv clinic flow resource methods should be defined', () => {
        expect(s.getClinicFlow).toBeDefined();
        expect(s.getUrl).toBeDefined();
    });

    it('should return clinic flow information for a given '
        + ' date  and location ', () => {
            const mockHivClinicFlow = TestBed.get(MockHivClinicFlowResourceService);

            s.getClinicFlow('2017-03-29T12:03:48.190Z', 'uuid')
                .subscribe((result) => {
                    expect(result).toBeDefined();
                    const expectedResults = mockHivClinicFlow.getHivDummyData();
                    expect(result).toEqual(expectedResults);
                });

            const req = httpMock.expectOne('https://amrsreporting.ampath.or.ke:8002'
                + '/etl/patient-flow-data?dateStarted=2017-03-29T12:03:48.190Z'
                + '&locationUuids=uuid');
            expect(req.request.urlWithParams).toContain('/etl/patient-flow-data');
            expect(req.request.urlWithParams).toContain('locationUuids=uuid');
            expect(req.request.method).toBe('GET');
            req.flush(mockHivClinicFlow.getHivDummyData());
        });

});
