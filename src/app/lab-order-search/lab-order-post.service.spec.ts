/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { LabOrderPostService } from './lab-order-post.service';
import { FakeLabOrderResourceService } from '../etl-api/lab-order-resource.mock';


describe('Service: LabOrderPostService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                LabOrderPostService,
                {
                    provide: LabOrderPostService, useFactory: () => {
                        return new FakeLabOrderResourceService();
                    }, deps: []
                }
            ]
        });
    });

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should create an instance', () => {
        const service: LabOrderPostService = TestBed.get(LabOrderPostService);
        expect(service).toBeTruthy();
    });

    it('should post orders to eid', (done) => {
        const service: LabOrderPostService = TestBed.get(LabOrderPostService);
        const payload = {
          'type': 'VL',
          'locationUuid': 'xxxxxx',
          'orderNumber': 'ORD-1',
          'providerIdentifier': 'bbbb',
          'patientName': 'TEST PATIENT',
          'patientIdentifier': 'yyyyyyy',
          'sex': 'F',
          'birthDate': '1990-01-01',
          'artStartDateInitial': '2012-01-01',
          'artStartDateCurrent': '2012-01-01',
          'sampleType': 1,
          'artRegimenUuid': '6964',
          'vlJustificationUuid': 'xxxxx',
          'dateDrawn': '2017-01-01',
          'dateReceived': '2017-01-05'
        };

        const result = service.postOrderToEid(location, payload);

        result.subscribe((results) => {
            expect(results).toBeTruthy();
            done();
        });

    });
});
