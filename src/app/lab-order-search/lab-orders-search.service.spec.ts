/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { LabOrdersSearchService } from './lab-orders-search.service';
import { OrderResourceService } from '../openmrs-api/order-resource.service';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';



describe('Service: LabOrdersSearchService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MockBackend,
                BaseRequestOptions,
                {
                    provide: Http,
                    useFactory: (backendInstance: MockBackend,
                        defaultOptions: BaseRequestOptions) => {
                        return new Http(backendInstance, defaultOptions);
                    },
                    deps: [MockBackend, BaseRequestOptions]
                },
                AppSettingsService,
                LocalStorageService,
                OrderResourceService,
                LabOrdersSearchService
            ],
        });
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should create an instance', () => {
        let service: LabOrdersSearchService = TestBed.get(LabOrdersSearchService);
        expect(service).toBeTruthy();
    });

    it('should get lab order by uuid', (done) => {
        let service: LabOrdersSearchService = TestBed.get(LabOrdersSearchService);
        let result = service.searchLabOrder('ORD-4312', false);

        result.subscribe((order) => {
            expect(order).toBeTruthy();
            expect(order.uuid).toEqual('2f949c58-0396-4eff-a398-bad3d5a9610e');
        });
        done();
    });

    it('should return an error when lab order cannot be loaded', (done) => {
        let service: LabOrdersSearchService = TestBed.get(LabOrdersSearchService);
        let res: OrderResourceService = TestBed.get(OrderResourceService);

        let results = service.searchLabOrder('ORD-4312', false);

        results.subscribe((result) => {
        },
            (error) => {
                // when it gets here, then it returned an error
            });
        done();
    });
});

