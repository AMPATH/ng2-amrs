import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { SurgeResourceService } from 'src/app/etl-api/surge-resource.service';
import { PatientListComponent } from 'src/app/shared/data-lists/patient-list/patient-list.component';
import { LocationStrategy } from '@angular/common';
import { SurgeReportPatientListComponent } from './surge-report-patient-list.component';

const routes = [{
    path: 'test',
    component: SurgeReportPatientListComponent
  }];

describe('SurgePatientList', () => {
    let comp: SurgeReportPatientListComponent;
    let fixture: ComponentFixture<SurgeReportPatientListComponent>;
    // tslint:disable-next-line: prefer-const
    let debugElement: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [
                PatientListComponent,
                SurgeReportPatientListComponent
            ],
            providers : [
                SurgeResourceService,
                LocationStrategy,
                AppSettingsService,
                LocalStorageService
            ],
            imports: [
                RouterTestingModule.withRoutes(routes),
                HttpClientTestingModule
            ],
            schemas: [
                NO_ERRORS_SCHEMA
            ]
        }).compileComponents();
    });

    beforeEach(async() => {
        fixture = TestBed.createComponent(SurgeReportPatientListComponent);
        comp = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(comp).toBeTruthy();
    });

    it('should be injected', () => {
        fixture.detectChanges();
        expect(fixture.componentInstance).toBeTruthy();
        expect(fixture.componentInstance.surgeResource instanceof SurgeResourceService).toBeTruthy();
    });
});
