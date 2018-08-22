/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { PatientMonthlyStatusComponent } from './patient-monthly-status.component';
import { PatientCareStatusResourceService } from
  '../../../etl-api/patient-care-status-resource.service';
import { PatientService } from '../../services/patient.service';
class MockPatientService {
    currentlyLoadedPatient = Observable.of({ uuid: '', person: { uuid: 'persion_uui' } });
}
class MockPatientCareStatusResourceService {
    getMonthlyPatientCareStatus(options) { return Observable.of({ month: '' }); };
}
describe('PatientMonthlyStatusComponent', () => {
    let fixture: ComponentFixture<PatientMonthlyStatusComponent>;
    let comp: PatientMonthlyStatusComponent;
    let el;
    let dataStub;

    let fakePatientService = {
        currentlyLoadedPatient: Observable.of({ uuid: '', person: { uuid: 'persion_uui' } })
    };

    let fakeMonthlyStatus = {
        getMonthlyPatientCareStatus: Observable.of({ month: '' })
    };
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                PatientMonthlyStatusComponent
            ],
            providers: [
                {
                    provide: PatientService,
                    useClass: MockPatientService
                },
                {
                    provide: PatientCareStatusResourceService,
                    useClass: MockPatientCareStatusResourceService
                }],
            schemas: [NO_ERRORS_SCHEMA]
        }).compileComponents().then(() => {
            fixture = TestBed.createComponent(PatientMonthlyStatusComponent);
            comp = fixture.componentInstance;
            dataStub = fixture.debugElement.injector.get(PatientCareStatusResourceService);
            // el = fixture.debugElement.query(By.css('h1'));
        });
    }));

    it('Should hit the success when the history is fetched', () => {
        fixture.detectChanges();
        const spy = spyOn(dataStub, 'getMonthlyPatientCareStatus').and.returnValue(
            Observable.of([
                {
                    month: ''
                }
            ])
        );
        comp.getCareStatusHistory();
        fixture.detectChanges();
        // expect(comp.success).toEqual(true);
        expect(spy.calls.any()).toEqual(true);
    });

    it('Should hit the error callback when an error occurs', () => {
        const spy = spyOn(dataStub, 'getMonthlyPatientCareStatus').and.returnValue(
            Observable.throw({ error: '' })
        );
        comp.getCareStatusHistory();
        fixture.detectChanges();
        // expect(comp.error).toEqual(true);
        expect(spy.calls.any()).toEqual(true);
    });
});
