import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { Observable, Subject } from 'rxjs';
import { ReportFiltersComponent } from '../../../shared/report-filters/report-filters.component';
import {
  DataAnalyticsDashboardService
} from '../../../data-analytics-dashboard/services/data-analytics-dashboard.services';
import {
  FacilityReferralBaseComponent
} from './facility-referral-report-base';
import {
  CdmIndicatorsResourceService
} from '../../../etl-api/cdm-indicators-resource.service';
import {
  CdmIndicatorsResServiceMock
} from '../../../etl-api/cdm-indicators.service.mock';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2Piwik } from 'angulartics2/piwik';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';


describe('cdmSummaryIndicatorBaseComponent:', () => {
  let fixture: ComponentFixture<FacilityReferralBaseComponent>;
  let comp: FacilityReferralBaseComponent;
  class FakeActivatedRoute {
    url = '';
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        FacilityReferralBaseComponent,
        ReportFiltersComponent
      ],
      providers: [
        {
          provide: CdmIndicatorsResourceService,
          useClass: CdmIndicatorsResServiceMock
        },
        DataAnalyticsDashboardService,
        FakeAppFeatureAnalytics,
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        Angulartics2,
        Angulartics2Piwik,
        { provide: ActivatedRoute, useValue: FakeActivatedRoute },
        {
          provide: Location,
          useClass: SpyLocation
        }
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        FormsModule
      ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(FacilityReferralBaseComponent);
      comp = fixture.componentInstance;
    });
  }));
});
