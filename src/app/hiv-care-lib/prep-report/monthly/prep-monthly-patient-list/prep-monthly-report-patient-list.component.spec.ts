import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/clinic-dashboard/clinic-dashboard.routes';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClinicDashboardComponent } from 'src/app/clinic-dashboard/clinic-dashboard.component';
import { PrepMonthlyReportPatientListComponent } from './prep-monthly-report-patient-list.component';

describe('PrepMonthlyReportPatientListComponent', () => {
  let component: PrepMonthlyReportPatientListComponent;
  let fixture: ComponentFixture<PrepMonthlyReportPatientListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PrepMonthlyReportPatientListComponent,
        ClinicDashboardComponent
      ],
      providers: [
        // { provide: PrepResourceService, useClass: PrepResouceServiceMock },
        AppSettingsService,
        LocalStorageService
      ],
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepMonthlyReportPatientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
