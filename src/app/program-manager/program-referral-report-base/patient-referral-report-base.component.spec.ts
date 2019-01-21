
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { Observable, Subject } from 'rxjs';

import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2Piwik } from 'angulartics2/piwik';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { PatientReferralBaseComponent } from './patient-referral-report-base.component';
import { PatientReferralResourceService } from '../../etl-api/patient-referral-resource.service';
import {
  DataAnalyticsDashboardService
} from '../../data-analytics-dashboard/services/data-analytics-dashboard.services';
import {
  ReportFiltersComponent
} from '../../shared/report-filters/report-filters.component';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { DataCacheService } from '../../shared/services/data-cache.service';
import { CacheService } from 'ionic-cache';
import {
  PatinetReferralResourceServiceMock
} from '../../etl-api/patient-referral.service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';


describe('PatientReferralBaseComponent:', () => {
  let comp: PatientReferralBaseComponent;
  class FakeActivatedRoute {
    url = '';
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PatientReferralBaseComponent,
        ReportFiltersComponent,
      ],
      providers: [
        { provide: PatientReferralResourceService,
          useClass: PatinetReferralResourceServiceMock
        },
        AppSettingsService,
        PatientReferralBaseComponent,
        LocalStorageService,
        DataCacheService,
        CacheService,
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
        FormsModule, HttpClientTestingModule,
        RouterTestingModule
      ]
    }).compileComponents();
    comp = TestBed.get(PatientReferralBaseComponent);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected', () => {
    expect(comp).toBeTruthy();
  });

  it('should generate patient referral report using paramaters supplied',
    () => {
      const fakeReply: any = {
        result: [{
          'location': 'MTRH Module 1',
          'location_uuid': '08feae7c-1352-11df-a1f1-0026b9348838',
          'location_id': 1,
          'encounter_datetime': '2017-04-12T09:35:13.000Z',
          'month': '2017-04-12T09:35:13.000Z',
          'referred': 10,
          'in_carae': 1081
        }]
      };

      comp.startDate = new Date('2017-01-01');
      comp.endDate = new Date('2017-02-01');

      // simulate previous erroneous state
      comp.isLoadingReport = false;
      comp.encounteredError = true;
      comp.errorMessage = 'some error';
    });

  it('should report errors when generating patient referral report fails',
    (done) => {
      const service = TestBed.get(PatientReferralResourceService);
      const referralSpy = spyOn(service, 'getPatientReferralReport')
        .and.callFake((endDate, startDate, locationUuids) => {
          const subject = new Subject<any>();

          setTimeout(() => {
            subject.error('some error');

            // check for state after successful loading
            expect(comp.isLoadingReport).toBe(false);
            expect(comp.encounteredError).toBe(true);
            expect(comp.errorMessage).toEqual('some error');

            // results should be set
            expect(comp.sectionsDef).toEqual([]);
            expect(comp.data).toEqual([]);
            done();
          });

          return subject.asObservable();
        });
      comp.generateReport();
      expect(service.getPatientReferralReport).toHaveBeenCalled();
    });

});
