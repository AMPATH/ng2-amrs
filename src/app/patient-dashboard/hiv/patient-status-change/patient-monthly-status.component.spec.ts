/*
 * Testing a simple Angular 2 component
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#simple-component-test
 */


import { throwError as observableThrowError, Observable, of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { PatientMonthlyStatusComponent } from './patient-monthly-status.component';
import { PatientCareStatusResourceService } from '../../../etl-api/patient-care-status-resource.service';
import { PatientService } from '../../services/patient.service';
class MockPatientService {
    currentlyLoadedPatient = of({ uuid: '', person: { uuid: 'persion_uui' } });
}
class MockPatientCareStatusResourceService {
    getMonthlyPatientCareStatus(options) { return of({ month: '' }); };
}
describe('PatientMonthlyStatusComponent', () => {
    let fixture: ComponentFixture<PatientMonthlyStatusComponent>;
    let comp: PatientMonthlyStatusComponent;
    let dataStub;

    const fakePatientService = {
        currentlyLoadedPatient: of({ uuid: '', person: { uuid: 'persion_uui' } })
    };

    const fakeMonthlyStatus = {
        getMonthlyPatientCareStatus: of({ month: '' })
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

    afterEach(() => {
        TestBed.resetTestingModule();
    });

    it('Should hit the success when the history is fetched', () => {
        fixture.detectChanges();
        const spy = spyOn(dataStub, 'getMonthlyPatientCareStatus').and.returnValue(
            of([
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
            observableThrowError({ error: '' })
        );
        comp.getCareStatusHistory();
        fixture.detectChanges();
        // expect(comp.error).toEqual(true);
        expect(spy.calls.any()).toEqual(true);
    });
});
