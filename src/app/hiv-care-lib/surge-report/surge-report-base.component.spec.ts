import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';

import { SurgeReportBaseComponent } from './surge-report-base.component';
import { SurgeResourceService } from 'src/app/etl-api/surge-resource.service';
import { SurgeReportTabularComponent } from './surge-report-tabular.component';
import { ReportFilterComponent } from 'src/app/reporting-utilities/report-filter/report-filter.component';
import { SurgeResourceServiceMock } from 'src/app/etl-api/surge-resource-mock';
import { Subject } from 'rxjs';

const routes = [{
  path: 'test',
  component: SurgeReportTabularComponent
}];

const weeklyQueryParams = {
  'year_week': 201805,
  'locationUuids': '294efcca-cf90-40da-8abb-1e082866388d'
};

describe('SurgeReportBaseComponent', () => {
  let component: SurgeReportBaseComponent;
  let fixture: ComponentFixture<SurgeReportBaseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        SurgeReportBaseComponent,
        SurgeReportTabularComponent,
        ReportFilterComponent
      ],
      providers: [
        { provide: SurgeResourceService, useClass: SurgeResourceServiceMock },
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
  });

  beforeEach(async() => {
    fixture = TestBed.createComponent(SurgeReportBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be injected', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.surgeReport instanceof SurgeResourceService).toBeTruthy();
  });

});
