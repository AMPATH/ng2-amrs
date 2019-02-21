import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Pipe, PipeTransform } from '@angular/core';
import { of } from 'rxjs';

import { Patient } from '../../../models/patient.model';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { LabsResourceService } from '../../../etl-api/labs-resource.service';
import { LabSyncComponent } from './lab-sync.component';
import { PatientService } from '../../services/patient.service';

@Pipe({ name: 'translate' })
export class FakeTranslatePipe implements PipeTransform {
    transform(value: any, decimalPlaces: number): any {
        return value;
    }
}
describe('LabSyncComponent', () => {
    const fakePatientService = {
        currentlyLoadedPatient: of({ uuid: '', person: { uuid: 'persion_uui' } })
    };
    const fakeLabsServiceName = {
        getNewPatientLabResults: (args) => {
            return of(
                [{
                    obsDatetime: new Date(),
                    concept: {
                        uuid: 'a898fe80-1350-11df-a1f1-0026b9348838'
                    }, value: {
                        display: 'Test'
                    },
                    groupMembers: [
                        {
                            display: ''
                        }
                    ]
                },
                {
                    obsDatetime: new Date(),
                    concept: {
                        uuid: 'a8a8bb18-1350-11df-a1f1-0026b9348838'
                    }, value: '',
                    groupMembers: [
                        {
                            display: ''
                        }
                    ]
                },
                {
                    obsDatetime: new Date(),
                    concept: {
                        uuid: 'a8970a26-1350-11df-a1f1-0026b9348838'
                    }, value: '',
                    groupMembers: [
                        {
                            display: ''
                        }
                    ]
                },
                {
                    obsDatetime: new Date(),
                    concept: {
                        uuid: 'a8982474-1350-11df-a1f1-0026b9348838'
                    }, value: '',
                    groupMembers: [
                        {
                            display: ''
                        }
                    ]
                },
                {
                    obsDatetime: new Date(),
                    concept: {
                        uuid: '457c741d-8f71-4829-b59d-594e0a618892'
                    }, value: '',
                    groupMembers: [
                        {
                            display: ''
                        }
                    ]
                }
                ]);
        }
    };

    const fakeChangeDetectorRef = {
        markForCheck: () => { }
    };

    let fixture, comp, nativeElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            schemas: [NO_ERRORS_SCHEMA],
            declarations: [
                LabSyncComponent,
                FakeTranslatePipe
            ],
            providers: [
                { provide: ChangeDetectorRef, useValue: fakeChangeDetectorRef },
                { provide: LabsResourceService, useValue: fakeLabsServiceName },
                {
                    provide: PatientService, useValue: fakePatientService
                },
                LabSyncComponent
            ]
        })
            .compileComponents()
            .then(() => {
                fixture = TestBed.createComponent(LabSyncComponent);
                comp = fixture.componentInstance;
                nativeElement = fixture.nativeElement;
                fixture.detectChanges();
            });
    }));

    afterEach(() => {
        TestBed.resetTestingModule();
    });
/*
    it('should be defined', () => {
            expect(comp).toBeDefined();
        });
    it('should render result table when there are new results',
        inject([LabsResourceService, PatientService],
            (service: LabsResourceService) => {
                comp.ngOnInit();
                fixture.detectChanges();
                const table = nativeElement.querySelectorAll('table');
                expect(table.length).toBe(1);
                const trs = nativeElement.querySelectorAll('tr');
                expect(trs.length).toBe(6);
            }));
    it('should not render new results table if results is empty',
        inject([LabsResourceService, PatientService],
            (service: LabsResourceService) => {
                spyOn(service, 'getNewPatientLabResults').and.returnValue(of(
                    []
                ));
                comp.ngOnInit();
                fixture.detectChanges();
                const table = nativeElement.querySelectorAll('table');
                expect(table.length).toBe(0);
                const trs = nativeElement.querySelectorAll('tr');
                expect(trs.length).toBe(0);
            }));*/
});
