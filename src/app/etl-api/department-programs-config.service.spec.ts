import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {
    BaseRequestOptions, XHRBackend, Http, RequestMethod,
    ResponseOptions, Response
} from '@angular/http';
import { AppSettingsService } from '../app-settings';
import { DepartmentProgramsConfigService } from './department-programs-config.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { DataCacheService } from '../shared/services/data-cache.service';
import { LocalStorageService } from '../utils/local-storage.service';

const mockResponse = {
    'uud1': {
        'name': 'HIV',
        'programs': [
            {
                'uuid': '781d85b0-1359-11df-a1f1-0026b9348838',
                'name': 'STANDARD HIV TREATMENT'
            },
            {
                'uuid': 'c4246ff0-b081-460c-bcc5-b0678012659e',
                'name': 'MDT PROGRAM'

            },
            {
                'uuid': '781d8768-1359-11df-a1f1-0026b9348838',
                'name': 'OVC PROGRAM'
            }



        ]
    },
    'uud2': {
        'name': 'ONCOLOGY',
        'programs': [
            {
                'uuid': '142939b0-28a9-4649-baf9-a9d012bf3b3d',
                'name': 'BREAST CANCER SCREENING PROGRAM'
            },
            {
                'uuid': 'cad71628-692c-4d8f-8dac-b2e20bece27f',
                'name': 'CERVICAL CANCER SCREENING PROGRAM'
            },
            {
                'uuid': '725b5193-3452-43fc-aca3-6a80432d9bfa',
                'name': 'GENERAL ONCOLOGY PROGRAM'
            }
        ]
    },
    'uud3': {
        'name': 'CDM',
        'programs': [
            {
                'uuid': 'fc15ac01-5381-4854-bf5e-917c907aa77f',
                'name': 'CDM PROGRAM'
            },
            {
                'uuid': 'b731ba72-cf99-4176-9fcd-37cd186400c7',
                'name': 'DIABETES AND HYPERTENSION CARE AT HEALTH CENTER PROGRAM'
            },
            {
                'uuid': 'bd9a8b06-73c7-44a8-928c-5e72247f4c1d',
                'name': 'DIABETES AND HYPERTENSION AT CENTER OF EXCELLENCE PROGRAM'
            }


        ]
    },
    'uud4': {
        'name': 'BSG',
        'programs': [
            {
                'uuid': '781d8a88-1359-11df-a1f1-0026b9348838',
                'name': 'BSG PROGRAM'
            }

        ]
    },
    'uud5': {
        'name': 'DERMATOLOGY',
        'programs': [
            {
                'uuid': 'b3575274-1850-429b-bb8f-2ff83faedbaf',
                'name': 'DERMATOLOGY'
            }

        ]
    }
};

describe('Service :  Department Programs Configuration Service', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [CacheModule],
            providers: [
                DepartmentProgramsConfigService,
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
        inject([DepartmentProgramsConfigService], (d: DepartmentProgramsConfigService) => {
            expect(d).toBeTruthy();
        })
    );


    it('Should return a list of department programs ',
        inject([DepartmentProgramsConfigService, MockBackend],
            (d: DepartmentProgramsConfigService, backend: MockBackend) => {
                backend.connections.subscribe((connection: MockConnection) => {
                    expect(connection.request.method).toBe(RequestMethod.Get);
                    expect(connection.request.url).toContain('/etl/departments-programs-config');
                    connection.mockRespond(new Response(
                        new ResponseOptions({
                            body: mockResponse
                        }
                        )));
                    d.getDartmentProgramsConfig().subscribe((result) => {
                        expect(result).toBeDefined();
                        expect(result).toEqual(mockResponse);
                    });
                });
            })
    );


});

