import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
    BaseRequestOptions, XHRBackend, Http, RequestMethod,
    ResponseOptions, Response
} from '@angular/http';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings';
import { HivClinicFlowResourceService } from './hiv-clinic-flow-resource.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { DataCacheService } from '../shared/services/data-cache.service';
import { MockHivClinicFlowResourceService } from './hiv-clinic-flow-resource.service.mock';

describe('HivClinicFlowResourceService Tests', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [],
          imports: [CacheModule],
            providers: [
                HivClinicFlowResourceService,
                MockBackend,
                BaseRequestOptions,
                AppSettingsService,
                LocalStorageService,
                CacheService,
                DataCacheService,
                MockHivClinicFlowResourceService,
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
        inject([HivClinicFlowResourceService], (s: HivClinicFlowResourceService) => {
            expect(s).toBeTruthy();
        })
    );

    it('all hiv clinic flow resource methods should be defined',
        inject([HivClinicFlowResourceService], (s: HivClinicFlowResourceService) => {
            expect(s.getClinicFlow).toBeDefined();
            expect(s.getUrl).toBeDefined();
        })
    );

    it('should return clinic flow information for a given '
        + ' date  and location ',
        inject([HivClinicFlowResourceService, MockBackend],
            (s: HivClinicFlowResourceService, backend: MockBackend) => {
                backend.connections.subscribe((connection: MockConnection) => {
                    expect(connection.request.method).toBe(RequestMethod.Get);
                    expect(connection.request.url).toContain('/etl/patient-flow-data');
                    expect(connection.request.url).toEqual('https://amrsreporting.ampath.or.ke:8002'
                        + '/etl/patient-flow-data?dateStarted=2017-03-29T12:03:48.190Z'
                        + '&locationUuids=uuid');
                    expect(connection.request.url).toContain('locationUuids=uuid');

                    let mockHivClinicFlow = TestBed.get(MockHivClinicFlowResourceService);
                    let expectedResults = mockHivClinicFlow.getHivDummyData();

                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: expectedResults
                        }
                        )));
                });
                s.getClinicFlow('2017-03-29T12:03:48.190Z', 'uuid')
                    .subscribe((result) => {
                        expect(result).toBeDefined();
                        let mockHivClinicFlow = TestBed.get(MockHivClinicFlowResourceService);
                        let expectedResults = mockHivClinicFlow.getHivDummyData();
                        expect(result).toEqual(expectedResults.result);
                    });
            })
    );

});
