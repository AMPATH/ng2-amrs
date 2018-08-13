import { Observable } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed, async, fakeAsync, ComponentFixture } from '@angular/core/testing';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { AgGridModule } from 'ag-grid-angular';
import { OncologyMonthlyIndicatorSummaryComponent } from
'./oncology-monthly-indicators.component';
import { OncologySummaryFiltersComponent } from
'../oncology-summary-filters/oncology-summary-filters.component';
import { OncologySummaryIndicatorsTableComponent } from
'../oncology-summary-indicators-table/oncology-summary-indicators-table.component';
import { OncolgyMonthlySummaryIndicatorsResourceService }
from '../../../../etl-api/oncology-summary-indicators-resource.service';
import { OncologyReportService } from '../../../../etl-api/oncology-reports.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ReportFiltersComponent } from
'../../../../../app/shared/report-filters/report-filters.component';

import { AppFeatureAnalytics } from
'../../../../shared/app-analytics/app-feature-analytics.service';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2Piwik } from 'angulartics2/dist/providers';
import { FakeAppFeatureAnalytics } from
'../../../../shared/app-analytics/app-feature-analytcis.mock';
import { LocalStorageService } from '../../../../utils/local-storage.service';
import { DataCacheService } from '../../../../shared/services/data-cache.service';
import { CacheService } from 'ionic-cache';
import { AppSettingsService } from '../../../../../app/app-settings/index';
import {
    DataAnalyticsDashboardService
  } from '../../../../data-analytics-dashboard/services/data-analytics-dashboard.services';

const getOncologySummaryService =
jasmine.createSpyObj('OncolgyMonthlySummaryIndicatorsResourceService', ['getUrlRequestParams',
'getOncologySummaryMonthlyIndicatorsReport', 'getOncologySummaryMonthlyIndicatorsPatientList']);

const getOncologyReportsService =
jasmine.createSpyObj('OncologyReportService', ['getOncologyReports', 'getSpecificOncologyReport']);

let mockReportsResponse: any = [
    {
        'program': 'Test program 1',
        'uuid': 'uuid1',
        'reports': [
            {
                'name': 'B1. Test report 1',
                'type': 'test-1-screening-numbers',
                'description': 'Test report 1 description'
            }]
          },
        {
                'program': 'Test Program 2',
                'uuid': 'uuid2',
                'reports': [
                    {
                        'name': 'C1. Cervical screening numbers',
                        'type': 'test-2-screening-numbers',
                        'description': 'Test report2 descriprion'
                    }
                ]
        }
];

// Make the spy return a synchronous Observable with the test data
const getReportsSpy = getOncologySummaryService.getOncologySummaryMonthlyIndicatorsReport
.and.returnValue(Observable.of(mockReportsResponse) );

const mockParams = {};

class MockRouter {
    public navigate = jasmine.createSpy('navigate');
   }

const mockActivatedRoute = {
  queryParams: {
    subscribe: jasmine.createSpy('subscribe')
      .and
      .returnValue(Observable.of(mockParams))
  }
};

describe('Component: Oncology Monthly Indicator', () => {
  let fixture: ComponentFixture<OncologyMonthlyIndicatorSummaryComponent>;
  let cd: ChangeDetectorRef;
  let comp: any;
  let route: Router;
  let router: ActivatedRoute;
  let oncologySummryService: OncolgyMonthlySummaryIndicatorsResourceService;
  let oncologyReportService: OncologyReportService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:
      [
      ],
      declarations: [
        OncologyMonthlyIndicatorSummaryComponent,
        OncologySummaryFiltersComponent,
        OncologySummaryIndicatorsTableComponent
      ],
      providers: [
        {
            provide: OncolgyMonthlySummaryIndicatorsResourceService,
            useValue: getOncologyReportsService
        },
        AppSettingsService,
        LocalStorageService,
        DataCacheService,
        DataAnalyticsDashboardService,
        CacheService,
        FakeAppFeatureAnalytics,
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        Angulartics2,
        Angulartics2Piwik,
        {
            provide: OncologyReportService,
            useValue: getOncologySummaryService
        },
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(OncologyMonthlyIndicatorSummaryComponent);
        comp = fixture.componentInstance;
        oncologyReportService = fixture.debugElement.injector
        .get(OncologyReportService);
        oncologySummryService = fixture.debugElement.injector
        .get(OncolgyMonthlySummaryIndicatorsResourceService);
        route = fixture.debugElement.injector.get(Router);
        cd = fixture.debugElement.injector.get(ChangeDetectorRef);
        router = fixture.debugElement.injector.get(ActivatedRoute);

      });
  }));

  it('should create an instance', () => {
      expect(comp).toBeTruthy();
  });

});
