/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { LabOrdersSearchService } from './lab-orders-search.service';
import { OrderResourceService } from '../openmrs-api/order-resource.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';



describe('Service: LabOrdersSearchService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
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
        const service: LabOrdersSearchService = TestBed.get(LabOrdersSearchService);
        expect(service).toBeTruthy();
    });


    it('should return an error when lab order cannot be loaded', (done) => {
        const service: LabOrdersSearchService = TestBed.get(LabOrdersSearchService);
        const res: OrderResourceService = TestBed.get(OrderResourceService);

        const results = service.searchLabOrder('ORD-4312', false);

        results.subscribe((result) => {
        },
            (error) => {
                // when it gets here, then it returned an error
            });
        done();
    });
});

