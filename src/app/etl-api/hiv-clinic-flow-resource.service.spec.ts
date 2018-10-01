import { TestBed, async, inject, fakeAsync, flush } from '@angular/core/testing';
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
                { provide: MockHivClinicFlowResourceService,
                    useFactory: () => {
                        return new MockHivClinicFlowResourceService();
                    }
                },
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

    afterEach(() => {
        TestBed.resetTestingModule();
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
        inject([HivClinicFlowResourceService, MockBackend, MockHivClinicFlowResourceService],
            fakeAsync((s: HivClinicFlowResourceService, backend: MockBackend, mockHivClinicFlow: MockHivClinicFlowResourceService) => {
                try {
                backend.connections.subscribe((connection: MockConnection) => {
                    expect(connection.request.method).toBe(RequestMethod.Get);
                    expect(connection.request.url).toContain('/etl/patient-flow-data');
                    expect(connection.request.url).toEqual('https://amrsreporting.ampath.or.ke:8002'
                        + '/etl/patient-flow-data?dateStarted=2017-03-29T12:03:48.190Z'
                        + '&locationUuids=uuid');
                    expect(connection.request.url).toContain('locationUuids=uuid');

                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: mockHivClinicFlow.getHivDummyData()
                        }
                        )));
                });
                s.getClinicFlow('2017-03-29T12:03:48.190Z', 'uuid')
                    .subscribe((result) => {
                        expect(result).toBeDefined();
                        const expectedResults = mockHivClinicFlow.getHivDummyData();
                        expect(result).toEqual(expectedResults);
                    });
                flush();
                } catch (er) {
                    console.log('err', er);
                    throw er;
                }
            }))
    );

});
