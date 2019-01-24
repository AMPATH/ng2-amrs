import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { of, Subject } from 'rxjs';
import { PatientsRequiringVLBaseComponent } from './patients-requiring-vl-base.component';
import { PatientsRequiringVLReportFiltersComponent
    } from './patients-requiring-vl-report-filters.component';
import {
    PatientsRequiringVLResourceServiceMock
} from '../../etl-api/patients-requiring-vl-resource.service.mock';
import {
    PatientsRequiringVLResourceService
} from '../../etl-api/patients-requiring-vl-resource.service';
import { ActivatedRoute, Router } from '@angular/router';

class MockRouter {
    public navigate = jasmine.createSpy('navigate');
}
class MockActivatedRoute {
    public params = of([{ startDate: '2017-07-31T03:00:00+03:00' }]);

}

describe('PatientsRequiringVLBaseComponent:', () => {
    let fixture: ComponentFixture<PatientsRequiringVLBaseComponent>;
    let comp: PatientsRequiringVLBaseComponent;
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                PatientsRequiringVLBaseComponent,
                PatientsRequiringVLReportFiltersComponent
            ],
            providers: [
                {
                    provide: PatientsRequiringVLResourceService,
                    useClass: PatientsRequiringVLResourceServiceMock
                },
                { provide: Router, useClass: MockRouter },
                {
                    provide: ActivatedRoute, useClass: MockActivatedRoute
                }
            ],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [
                FormsModule
            ]
        });
    });

    beforeEach(async(() => {
        TestBed.compileComponents().then(() => {
            fixture = TestBed.createComponent(PatientsRequiringVLBaseComponent);
            comp = fixture.componentInstance;
        });
    }));

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('should be injected', () => {
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeTruthy();
        expect(fixture.componentInstance.patientsRequiringVLResourceService
            instanceof PatientsRequiringVLResourceServiceMock)
            .toBe(true);
    });

    it('should generate patients requiring vl patient list using paramaters supplied',
        (done) => {
            const fakeReply: any = {
                result: [
                   {
                    'person_id': 800302,
                    'encounter_id': 7027747,
                    'location_id': 13,
                    'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
                    'patient_uuid': 'f8c900f2-99fa-4fb6-8347-33701a9ae322',
                    'gender': 'M',
                    'birthdate': '1983-12-31T21:00:00.000Z',
                    'age': 33,
                    'has_pending_vl_test': 0,
                    'current_vl': 82,
                    'current_vl_date': '29-07-2016',
                    'days_since_last_order': null,
                    'last_vl_order_date': null,
                    'cur_regimen_arv_start_date': '18-01-2016',
                    'cur_arv_line': 1,
                    'cur_arv_meds': '6964',
                    'arv_first_regimen': '6964',
                    'person_name': 'mathew kipyegon koech',
                    'identifiers': '056362671-2, 15204-34763'
                },
                {
                    'person_id': 814536,
                    'encounter_id': 7026891,
                    'location_id': 13,
                    'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
                    'patient_uuid': '3176b41c-5692-45fb-a81f-26dab3467a9f',
                    'gender': 'F',
                    'birthdate': '1968-06-21T21:00:00.000Z',
                    'age': 49,
                    'has_pending_vl_test': 0,
                    'current_vl': 5683,
                    'current_vl_date': '15-03-2017',
                    'days_since_last_order': null,
                    'last_vl_order_date': null,
                    'cur_regimen_arv_start_date': '15-03-2017',
                    'cur_arv_line': 1,
                    'cur_arv_meds': '6964',
                    'arv_first_regimen': '6964',
                    'person_name': 'jane kigen chepkonga',
                    'identifiers': '654106214-4, 15204-35527'
                }]
            };

            comp = fixture.componentInstance;
            const service = fixture.componentInstance.patientsRequiringVLResourceService;
            const hivSpy = spyOn(service, 'getPatientList')
                .and.callFake((startDate, endDate, locationUuids) => {
                    const subject = new Subject<any>();

                    // check for params conversion accuracy
                    expect(endDate).toEqual('2017-07-31T03:00:00+03:00');
                    expect(startDate).toEqual('2017-07-01T03:00:00+03:00');
                    expect(locationUuids).toBe('uuid-1,uuid-2');

                    // check for state during fetching
                    expect(comp.isLoadingReport).toBe(true);
                    expect(comp.encounteredError).toBe(false);
                    expect(comp.errorMessage).toBe('');
                    setTimeout(() => {
                        subject.next(fakeReply);

                        // check for state after successful loading
                        expect(comp.isLoadingReport).toBe(false);
                        expect(comp.encounteredError).toBe(false);
                        expect(comp.errorMessage).toBe('');
                        done();
                    });

                    return subject.asObservable();
                });

            // simulate user input
            comp.startDate = new Date('2017-07-01');
            comp.endDate = new Date('2017-07-31');
            comp.locationUuids = ['uuid-1', 'uuid-2'];

            // simulate previous erroneous state
            comp.isLoadingReport = false;
            comp.encounteredError = true;
            comp.errorMessage = 'some error';
            fixture.detectChanges();
            comp.generateReport();

        });

    it('should report errors when generating patients requiring vl patient list fails',
        (done) => {
            comp = fixture.componentInstance;
            const service = fixture.componentInstance.patientsRequiringVLResourceService;
            const hivSpy = spyOn(service, 'getPatientList')
                .and.callFake((startDate, endDate, locationUuids) => {
                    const subject = new Subject<any>();

                    setTimeout(() => {
                        subject.error('some error');

                        // check for state after successful loading
                        expect(comp.isLoadingReport).toBe(false);
                        expect(comp.encounteredError).toBe(true);
                        expect(comp.errorMessage).toEqual('some error');

                        // results should be set
                        expect(comp.data).toEqual([]);
                        done();
                    });

                    return subject.asObservable();
                });
            comp.generateReport();
        });

});
