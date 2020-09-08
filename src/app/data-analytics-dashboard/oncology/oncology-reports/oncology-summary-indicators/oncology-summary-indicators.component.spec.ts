import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';

import { of } from 'rxjs';

import { DataAnalyticsDashboardService } from '../../../services/data-analytics-dashboard.services';
import { OncologySummaryIndicatorsComponent } from './oncology-summary-indicators.component';
import { OncologySummaryFiltersComponent } from '../oncology-summary-filters/oncology-summary-filters.component';
import { OncologySummaryIndicatorsTableComponent } from '../oncology-summary-indicators-table/oncology-summary-indicators-table.component';
import { OncologySummaryIndicatorsResourceService } from '../../../../etl-api/oncology-summary-indicators-resource.service';
import { OncologyReportService } from '../../../../etl-api/oncology-reports.service';

import { AppFeatureAnalytics } from '../../../../shared/app-analytics/app-feature-analytics.service';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2Piwik } from 'angulartics2/piwik';
import { FakeAppFeatureAnalytics } from '../../../../shared/app-analytics/app-feature-analytcis.mock';

import { AppSettingsService } from '../../../../app-settings/app-settings.service';
import { CacheService } from 'ionic-cache';
import { DataCacheService } from '../../../../shared/services/data-cache.service';
import { LocalStorageService } from '../../../../utils/local-storage.service';

const getOncologySummaryService = jasmine.createSpyObj(
  'OncologyMonthlySummaryIndicatorsResourceService',
  [
    'getUrlRequestParams',
    'getOncologySummaryMonthlyIndicatorsReport',
    'getOncologySummaryMonthlyIndicatorsPatientList'
  ]
);

const getOncologyReportsService = jasmine.createSpyObj(
  'OncologyReportService',
  ['getOncologyReports', 'getSpecificOncologyReport']
);

const mockReportsResponse: any = [
  {
    program: 'Test program 1',
    uuid: 'uuid1',
    reports: [
      {
        name: 'B1. Test report 1',
        type: 'test-1-screening-numbers',
        description: 'Test report 1 description'
      }
    ]
  },
  {
    program: 'Test Program 2',
    uuid: 'uuid2',
    reports: [
      {
        name: 'C1. Cervical screening numbers',
        type: 'test-2-screening-numbers',
        description: 'Test report2 descriprion'
      }
    ]
  }
];

// Make the spy return a synchronous Observable with the test data
const getReportsSpy = getOncologySummaryService.getOncologySummaryMonthlyIndicatorsReport.and.returnValue(
  of(mockReportsResponse)
);

const mockParams = {};

class MockRouter {
  public navigate = jasmine.createSpy('navigate');
}

const mockActivatedRoute = {
  queryParams: {
    subscribe: jasmine.createSpy('subscribe').and.returnValue(of(mockParams))
  }
};

describe('Component: Oncology Monthly Indicator', () => {
  let fixture: ComponentFixture<OncologySummaryIndicatorsComponent>;
  let comp: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [
        OncologySummaryIndicatorsComponent,
        OncologySummaryFiltersComponent,
        OncologySummaryIndicatorsTableComponent
      ],
      providers: [
        Angulartics2,
        Angulartics2Piwik,
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
        {
          provide: OncologySummaryIndicatorsResourceService,
          useValue: getOncologyReportsService
        },
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
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(OncologySummaryIndicatorsComponent);
        comp = fixture.componentInstance;
      });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    expect(comp).toBeDefined();
  });
});
