import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
    BaseRequestOptions, XHRBackend, Http, RequestMethod,
    ResponseOptions, Response
} from '@angular/http';
import { AppSettingsService } from '../app-settings';
import { DashboardListService } from './dashboard-list.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { DataCacheService } from '../shared/services/data-cache.service';
import { LocalStorageService } from '../utils/local-storage.service';

const mockResponse = [
    {
        'id': 1,
        'title': 'MOH 731 Monthly Analysis',
        'department': 'hiv',
        'width': '99%',
        'height': '1680',
        'description': 'MOH 731 Monthly Analysis by Month',
        'url': 'kibana-dashboard-vis-url',
        'allowedDashboards': [
            'clinic',
            'data-analytics'
        ]
    }
];

describe('Service :  Department Programs Configuration Service', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CacheModule],
            providers: [
                DashboardListService,
                MockBackend,
                BaseRequestOptions,
                AppSettingsService,
                CacheService,
                LocalStorageService,
                DataCacheService,
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
        inject([DashboardListService], (d: DashboardListService) => {
            expect(d).toBeTruthy();
        })
    );


    it('Should return a list of department programs ',
        inject([DashboardListService, MockBackend],
            (d: DashboardListService, backend: MockBackend) => {
                backend.connections.subscribe((connection: MockConnection) => {
                    expect(connection.request.method).toBe(RequestMethod.Get);
                    expect(connection.request.url).toContain('/etl/kibana-dashboards');
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: mockResponse
                        }
                        )));
                    d.fetchDashboards().subscribe((result) => {
                        expect(result).toBeDefined();
                        expect(result).toEqual(mockResponse);
                    });
                });
            })
    );


});

