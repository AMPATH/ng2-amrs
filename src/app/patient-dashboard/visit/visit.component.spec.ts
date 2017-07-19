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
import { PatientProgramResourceService } from '../../etl-api/patient-program-resource.service';

@Pipe({ name: 'translate' })
export class FakeTranslatePipe implements PipeTransform {
    transform(value: any, decimalPlaces: number): any {
        return value;
    }
}

describe('Component: Visit', () => {
    let fakePatientService = {};
    let prog = {
      '781d85b0-1359-11df-a1f1-0026b9348838': {
        'name': 'HIV TREATMENT',
        'visitTypes': [
          {
            'uuid': '9adb4697-3667-4d72-b2ab-bd9033818ff6',
            'name': 'Youth Transfer In Visit ',
            'encounterTypes': [
              {
                'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
                'display': 'HIVTRIAGE'
              },
              {
                'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
                'display': 'TRANSFERENCOUNTER'
              },
              {
                'uuid': '*????????????YouthTransferIn??????????',
                'display': 'YouthTransferIn'
              }
            ]
          },
          {
            'uuid': '4c84516f-279e-4994-b111-84d4d35a2d97',
            'name': 'Youth HIV Return Visit ',
            'encounterTypes': [
              {
                'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
                'display': 'HIVTRIAGE'
              },
              {
                'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
                'display': 'TRANSFERENCOUNTER'
              },
              {
                'uuid': '4e7553b4-373d-452f-bc89-3f4ad9a01ce7',
                'display': 'YOUTHRETURN'
              }
            ]
          },
          {
            'uuid': '410c1874-65eb-4def-9a53-c09823b764e4',
            'name': 'Differentiated Care Clinical Visit ',
            'encounterTypes': [
              {
                'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
                'display': 'HIVTRIAGE'
              },
              {
                'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
                'display': 'TRANSFERENCOUNTER'
              },
              {
                'uuid': 'e3202a01-8cd5-4224-b0dd-760557f85310',
                'display': 'DIFFERENTIATEDCARE'
              }
            ]
          },
          {
            'uuid': 'b9b75f23-7fcc-492f-9a44-5544590c4760',
            'name': 'Differentiated Care Pharmacy Visit ',
            'encounterTypes': [
              {
                'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
                'display': 'HIVTRIAGE'
              },
              {
                'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
                'display': 'TRANSFERENCOUNTER'
              },
              {
                'uuid': 'e3202a01-8cd5-4224-b0dd-760557f85310',
                'display': 'DIFFERENTIATEDCARE'
              }
            ]
          },
          {
            'uuid': 'd1b92b20-c087-4036-8a61-54d978316fe9',
            'name': 'Express Care Visit ',
            'encounterTypes': [
              {
                'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
                'display': 'HIVTRIAGE'
              },
              {
                'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
                'display': 'TRANSFERENCOUNTER'
              },
              {
                'uuid': 'df554398-1350-11df-a1f1-0026b9348838',
                'display': 'ECSTABLE'
              }
            ]
          },
          {
            'uuid': 'a21e0f58-adb0-4a88-8877-b1a8af9c5cab',
            'name': 'Resistance Clinic Visit ',
            'encounterTypes': [
              {
                'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
                'display': 'HIVTRIAGE'
              },
              {
                'uuid': 'cbe2d31d-2201-44ce-b52e-fbd5dc7cff33',
                'display': 'TRANSFERENCOUNTER'
              },
              {
                'uuid': '425ee5d1-bf39-4e09-b372-fc86abfea0c1',
                'display': 'RESISTANCECLINIC'
              }
            ]
          },
          {
            'uuid': '1c9ec4a1-5383-4f92-b972-ada376256cf7',
            'name': 'Between Care Visit ',
            'encounterTypes': [
              {
                'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
                'display': 'HIVTRIAGE'
              },
              {
                'uuid': '*??????????????????Between-Care-Visit?????????????',
                'display': 'Between-Care-Visit'
              }
            ]
          },
          {
            'uuid': '1782fc7b-acfb-4820-b5a6-98188d7a9c17',
            'name': 'Transit Care Visit ',
            'encounterTypes': [
              {
                'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
                'display': 'HIVTRIAGE'
              },
              {
                'uuid': '*??????????????????transit-Visit?????????????',
                'display': 'transit-Visit'
              }
            ]
          },
          {
            'uuid': 'dd577eb9-03ed-4bc1-a784-0c0bd9affca5',
            'name': 'Inpatient Peer Visit ',
            'encounterTypes': [
              {
                'uuid': '10a86a62-b771-44d1-b1ad-3b8496c7bc47',
                'display': 'INPATIENTPEER'
              }
            ]
          },
          {
            'uuid': '3d2f6f84-0a0b-47c3-b209-ba26d2accd18',
            'name': 'MDT Visit ',
            'encounterTypes': [
              {
                'uuid': 'a44ad5e2-b3ec-42e7-8cfa-8ba3dbcf5ed7',
                'display': 'HIVTRIAGE'
              },
              {
                'uuid': '8d5b3108-c2cc-11de-8d13-0010c6dffd0f',
                'display': 'PEDSRETURN'
              },
              {
                'uuid': '4e7553b4-373d-452f-bc89-3f4ad9a01ce7',
                'display': 'YOUTHRETURN'
              },
              {
                'uuid': '8d5b2be0-c2cc-11de-8d13-0010c6dffd0f',
                'display': 'ADULTRETURN'
              },
              {
                'uuid': '*??????????????????MDT-Form?????????????',
                'display': 'MDT-Form'
              }
            ]
          }
        ]
      },
    };
    let fakePatientProgramResourceService = {
      getPatientPrograms : (patientUuid: string) => {
        return Observable.of(prog);
      }
    };
    let router = {
      navigate: jasmine.createSpy('navigate')
    };

    let fakeVisitResourceService = {
        getVisitTypes: (args) => {
            return Observable.of([{
              'uuid': '4c84516f-279e-4994-b111-84d4d35a2d97',
              'name': 'Youth HIV Return Visit '
            },
            {
              'uuid': 'a21e0f58-adb0-4a88-8877-b1a8af9c5cab',
              'name': 'Resistance Clinic Visit '
            }]);
        },
        getPatientVisits: (args) => {
          return Observable.of(null);
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
                { provide: Router, useValue: router },
                { provide: ActivatedRoute, useValue: {
                  queryParams: Observable.of({ }),
                  snapshot: { params: { program: '781d85b0-1359-11df-a1f1-0026b9348838'} },
                  params: Observable.of({ program: '781d85b0-1359-11df-a1f1-0026b9348838' }),
                  }
                },
                VisitComponent,
                PatientService,
                {
                  provide: PatientProgramResourceService,
                  useValue: fakePatientProgramResourceService
                },
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
                comp.programVisitsConfig = prog;
                nativeElement = fixture.nativeElement;
                fixture.detectChanges();
            });
    }));

    it('should fetch visit types depending on the loaded program',
        inject([VisitComponent], (service: VisitResourceService) => {
            comp.filterVisitTypesByProgram([{
              'uuid': '4c84516f-279e-4994-b111-84d4d35a2d97',
              'name': 'Youth HIV Return Visit '
            },
              {
                'uuid': 'a21e0f58-adb0-4a88-8877-b1a8af9c5cab',
                'name': 'Resistance Clinic Visit '
              }]);
            fixture.detectChanges();
            expect(comp.visitTypes).toBeTruthy();
            expect(comp.visitTypes.length).toBe(2); // expect to render 10 visits
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

    it('should hide visit types if a visit is already started',
        inject([VisitComponent], (service: VisitResourceService) => {
            comp.ngOnInit();
            fixture.detectChanges();
            comp.startVisit('uuid');
            fixture.detectChanges();
            expect(this.visitTypes).not.toBeDefined();
        }));

    it('should show the encounters and forms components if a visit has been started',
        inject([VisitComponent], (service: VisitResourceService) => {
            comp.ngOnInit();
            fixture.detectChanges();
            comp.startVisit('uuid');
            fixture.detectChanges();
            let formsComponent = nativeElement.querySelectorAll('#formsComponent');
            expect(formsComponent.length).toBe(1);
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
