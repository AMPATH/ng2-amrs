/*
 * Testing a Component with async services
 * More info: https://angular.io/docs/ts/latest/guide/testing.html#!#component-with-async-service
 */
import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router, ActivatedRoute } from '@angular/router';

import { BusyModule, BusyConfig } from 'angular2-busy';
import { VisitResourceService } from '../../openmrs-api/visit-resource.service';
import { VisitComponent } from './visit.component';
import { PatientService } from '../patient.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import {
    ProgramEnrollmentResourceService
} from '../../openmrs-api/program-enrollment-resource.service';
import {
    FakeProgramEnrollmentResourceService
} from '../../openmrs-api/program-enrollment-resource.service.mock';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';
import { FakeEncounterResourceService } from '../../openmrs-api/fake-encounter-resource.service';
import { UserDefaultPropertiesModule
} from '../../user-default-properties/user-default-properties.module';
import { FakeDefaultUserPropertiesFactory
} from '../formentry/mock/default-user-properties-factory.service.mock';
import { UserDefaultPropertiesService
} from '../../user-default-properties/user-default-properties.service';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';

@Pipe({ name: 'translate' })
export class FakeTranslatePipe implements PipeTransform {
    transform(value: any, decimalPlaces: number): any {
        return value;
    }
}

describe('Component: Visit', () => {
    let fakePatientService = {};
    let fakeVisitResourceService = {
        getVisitTypes: (args) => {
            return Observable.of([{
                uuid: '77b6e076-e866-46cf-9959-4a3703dba3fc',
                name: 'INITIAL HIV CLINIC VISIT',
                description: 'This is the first visit a patient makes to the HIV clinic.'
            },
            {
                uuid: 'd4ac2aa5-2899-42fb-b08a-d40161815b48', 'name': 'RETURN HIV CLINIC VISIT',
                description: 'This is the subsequent visit a patient makes to the HIV clinic.'
            }]);
        },
        saveVisit: (payload) => {
            let response = {
                uuid: 'visituuid',
                voided: false,
                stopDatetime: null,
                visitType: {
                    uuid: payload.visitType
                },
                startDatetime: new Date()
            };
            return Observable.of(response);
        },
        updateVisit: (uuid, payload) => {
            let response = {
                uuid: uuid,
                voided: false,
                stopDatetime: new Date(),
                visitType: {
                    uuid: payload.visitType
                },
                startDatetime: new Date()
            };
            if (payload.voided) {
                response.voided = true;
            }

            return Observable.of(response);
        }
    };

    let fakeChangeDetectorRef = {
        markForCheck: () => { }
    };

    let fixture, comp, nativeElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [
                VisitComponent,
                FakeTranslatePipe
            ],
            providers: [
                { provide: ChangeDetectorRef, useValue: fakeChangeDetectorRef },
                { provide: VisitResourceService, useValue: fakeVisitResourceService },
                { provide: Router, useValue: {} },
                { provide: ActivatedRoute, useValue: {} },
                VisitComponent,
                PatientService,
                {
                  provide: EncounterResourceService, useFactory: () => {
                    return new FakeEncounterResourceService(null, null);
                  }
                },
              {
                  provide: UserDefaultPropertiesService, useFactory: () => {
                  return new FakeDefaultUserPropertiesFactory();
                }
                },
                {
                  provide: AppFeatureAnalytics,
                  useClass: FakeAppFeatureAnalytics
                },
                { provide: PatientResourceService, useValue: fakeVisitResourceService },
                {
                    provide: ProgramEnrollmentResourceService,
                    useValue: FakeProgramEnrollmentResourceService
                }
            ],
            imports: [BusyModule, UserDefaultPropertiesModule]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(VisitComponent);
                comp = fixture.componentInstance;
                comp.patient = {
                    uuid: 'uuid',
                    person: { uuid: 'uuid' }
                };
                nativeElement = fixture.nativeElement;
                fixture.detectChanges();
            });
    }));

    it('should render visit types table when visit types are loaded',
        inject([VisitComponent], (service: VisitResourceService) => {
            comp.getVisitTypes();
            fixture.detectChanges();
            expect(comp.visitTypes).toBeTruthy();
            let table = nativeElement.querySelectorAll('table');
            expect(table.length).toBe(1);
            let trs = nativeElement.querySelectorAll('tr');
            expect(trs.length).toBe(2);
        }));

    it('should start a visit when startVisit is called',
        inject([VisitComponent], (service: VisitResourceService) => {
            comp.startVisit('uuid');
            expect(comp.visit).toBeTruthy();
            expect(comp.visit.stopDatetime).toBeNull();
            expect(comp.visit.visitType.uuid).toBe('uuid');
            expect(comp.visit.voided).toBeFalsy();
        }));

    it('should start a visit when the visit button is clicked',
        inject([VisitComponent], (service: VisitResourceService) => {
            comp.getVisitTypes();
            fixture.detectChanges();
            let startButton = nativeElement.querySelector('#startButton');
            expect(startButton).toBeTruthy();
            startButton.click();
            fixture.detectChanges();
        }));

    it('should hide visit types table if a visit is already started',
        inject([VisitComponent], (service: VisitResourceService) => {
            comp.ngOnInit();
            fixture.detectChanges();
            comp.startVisit('uuid');
            fixture.detectChanges();
            let table = nativeElement.querySelectorAll('table');
            expect(table.length).toBe(0);
        }));

    it('should show the encounters and forms components if a visit has been started',
        inject([VisitComponent], (service: VisitResourceService) => {
            comp.ngOnInit();
            fixture.detectChanges();
            comp.startVisit('uuid');
            fixture.detectChanges();
            let table = nativeElement.querySelectorAll('table');
            expect(table.length).toBe(0);
        }));

    it('should show the stop and cancel button when a visit has been started',
        inject([VisitComponent], (service: VisitResourceService) => {
            comp.ngOnInit();
            fixture.detectChanges();
            comp.startVisit('uuid');
            fixture.detectChanges();
            let cancelVisitButton = nativeElement.querySelector('#cancelVisitButton');
            let endVisitButton = nativeElement.querySelector('#endVisitButton');
            expect(cancelVisitButton).toBeTruthy();
            expect(endVisitButton).toBeTruthy();
        }));

    it('should end visit when end visit button clicked is confirmed',
        inject([VisitComponent, VisitResourceService], (service: VisitResourceService) => {

            comp.ngOnInit();
            fixture.detectChanges();
            comp.startVisit('uuid');
            fixture.detectChanges();
            let endVisitButton = nativeElement.querySelector('#endVisitButton');
            expect(endVisitButton).toBeTruthy();
            endVisitButton.click();

            expect(comp.visit).toBeDefined();
        }));
});
