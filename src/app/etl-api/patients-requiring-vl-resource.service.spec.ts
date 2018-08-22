import { async, inject, TestBed } from '@angular/core/testing';
import {
    BaseRequestOptions, Http, HttpModule, Response,
    ResponseOptions, RequestMethod
} from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheService, CacheModule } from 'ionic-cache';
import { Observable } from 'rxjs/Rx';
import { Router, ActivatedRoute } from '@angular/router';
import {
    PatientsRequiringVLResourceService
} from './patients-requiring-vl-resource.service';

describe('Service : PatientsRequiringVL Resource Service Unit Tests', () => {

    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [CacheModule],
            providers: [
                PatientsRequiringVLResourceService,
                MockBackend,
                BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (backend, options) => new Http(backend, options),
                    deps: [MockBackend, BaseRequestOptions]
                },
                AppSettingsService,
                LocalStorageService,
                DataCacheService,
                CacheService
            ]

        });


    });

    let patientsRequiringVLResponse = {
        'startIndex': '0',
        'size': 100000,
        'result': [
            {
                'person_id': 825337,
                'encounter_id': 6966652,
                'location_id': 13,
                'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
                'patient_uuid': '1aae87d5-555d-4337-9a09-6b8940f15b1c',
                'gender': 'M',
                'birthdate': '1983-08-22T21:00:00.000Z',
                'age': 33,
                'has_pending_vl_test': 0,
                'current_vl': null,
                'current_vl_date': null,
                'days_since_last_order': null,
                'last_vl_order_date': null,
                'cur_regimen_arv_start_date': '25-01-2017',
                'cur_arv_line': 1,
                'cur_arv_meds': '6964',
                'arv_first_regimen': '6964',
                'person_name': 'Denilee',
                'identifiers': '901837562-7, 15204-35961'
            },
            {
                'person_id': 692158,
                'encounter_id': 6956479,
                'location_id': 13,
                'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
                'patient_uuid': 'cf8c7d21-d8dd-4d07-8794-8cb3a6a771bd',
                'gender': 'M',
                'birthdate': '1962-12-31T21:00:00.000Z',
                'age': 54,
                'has_pending_vl_test': 0,
                'current_vl': 1807,
                'current_vl_date': '28-03-2017',
                'days_since_last_order': null,
                'last_vl_order_date': null,
                'cur_regimen_arv_start_date': '07-08-2013',
                'cur_arv_line': 1,
                'cur_arv_meds': '631 ## 1400',
                'arv_first_regimen': '631 ## 1400',
                'person_name': 'Bdd',
                'identifiers': '508346897-4, 7134043, 15204-30612'
            },
        ]
    };


    it('Should construct PatientsRequiringViralLoadOrder Resource Service', async(inject(
        [PatientsRequiringVLResourceService, MockBackend],
        (service, mockBackend) => {
            expect(service).toBeDefined();
        })));

    describe('Get PatientList', () => {

        it('should hit right endpoint for getPatientList and get right response', async(inject(

            [PatientsRequiringVLResourceService, MockBackend],
            (service, mockBackend) => {
                mockBackend.connections.subscribe(conn => {
                    expect(conn.request.url)
                        .toContain('/etl/patients-requiring-viral-load-order');
                    expect(conn.request.method).toBe(RequestMethod.Get);
                });

                service.getPatientList().subscribe(res => {
                    expect(res).toEqual(patientsRequiringVLResponse);
                });

            })));

    });
});
