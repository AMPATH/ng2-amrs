import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrepReportBaseComponent } from './prep-report-base.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from 'src/app/clinic-dashboard/clinic-dashboard.routes';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReportFilterComponent } from 'src/app/reporting-utilities/report-filter/report-filter.component';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { ClinicDashboardComponent } from 'src/app/clinic-dashboard/clinic-dashboard.component';

describe('PrepReportBaseComponent', () => {
  let component: PrepReportBaseComponent;
  let fixture: ComponentFixture<PrepReportBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrepReportBaseComponent, ReportFilterComponent, ClinicDashboardComponent ],
      providers: [
        // { provide: PrepResourceService, useClass: SurgeResourceServiceMock },
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
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrepReportBaseComponent);
    component = fixture.componentInstance;
    component.params = {'_month': '2020-09-12'};
    fixture.detectChanges();
  });

  it('should create and display report name', () => {
    expect(component).toBeTruthy();
    fixture.detectChanges();
    const reportName = fixture.nativeElement.querySelector('.component-title');
    expect(reportName.innerHTML).toContain('PrEP Report');
  });
});
