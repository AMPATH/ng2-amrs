
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { Observable, Subject } from 'rxjs/Rx';

import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { Angulartics2 } from 'angulartics2';
import { Angulartics2Piwik } from 'angulartics2/dist/providers';
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
import {BaseRequestOptions, Http, HttpModule} from '@angular/http';
import { AppSettingsService } from '../../app-settings/index';
import { LocalStorageService } from '../../utils/local-storage.service';
import { DataCacheService } from '../../shared/services/data-cache.service';
import { CacheService } from 'ionic-cache';
import { MockBackend } from '@angular/http/testing';
import {
  PatinetReferralResourceServiceMock
} from '../../etl-api/patient-referral.service.mock';


describe('PatientReferralBaseComponent:', () => {
  let fixture: ComponentFixture<PatientReferralBaseComponent>;
  let comp: PatientReferralBaseComponent;
  let el;
  class FakeActivatedRoute {
    url = '';
  }
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        PatientReferralBaseComponent,
        ReportFiltersComponent
      ],
      providers: [
        { provide: PatientReferralResourceService,
          useClass: PatinetReferralResourceServiceMock
        },
        AppSettingsService,
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
        },
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        FormsModule,HttpModule
      ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(PatientReferralBaseComponent);
      comp = fixture.componentInstance;
    });
  }));

  it('should be injected', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.componentInstance.patientReferralResourceService
      instanceof PatinetReferralResourceServiceMock)
      .toBe(true);
  });

  it('should generate patient referral report using paramaters supplied',
    (done) => {
      let fakeReply: any = {
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

      comp = fixture.componentInstance;
      let service = fixture.componentInstance.patientReferralResourceService;
      let hivSpy = spyOn(service, 'getPatientReferralReport')
        .and.callFake(({endDate: endDate, gender: gender,  startDate: startDate,
          programUuids: programUuids, locationUuids: locationUuids, stateUuids: stateUuids,
          startAge: startAge, endAge: endAge}) => {
          let subject =  new Subject<any>();

          // check for params conversion accuracy
          expect(endDate).toEqual('2017-02-01T03:00:00+03:00');
          expect(gender).toEqual(['M']);
          expect(startDate).toEqual('2017-01-01T03:00:00+03:00');
          //expect(programUuids).toBe('uuid-1,uuid-2');
          expect(locationUuids).toBe('uuid-1,uuid-2');
         // expect(stateUuids).toBe('state-uuid');
          expect(startAge).toEqual(0);
          expect(endAge).toEqual(120);

          // check for state during fetching
          expect(comp.isLoadingReport).toBe(true);
          expect(comp.encounteredError).toBe(false);
          expect(comp.errorMessage).toBe('');
          setTimeout(() => {
            subject.next(fakeReply);

            // check for state after successful loading
            expect(comp.isLoadingReport).toBe(false);
            expect(comp.encounteredError).toBe(false);
            expect(comp.errorMessage).toBe('');
            done();
          });

          return subject.asObservable();
        });

      // simulate user input
      comp.startDate = new Date('2017-01-01');
      comp.endDate = new Date('2017-02-01');
      comp.locationUuids = ['uuid-1', 'uuid-2'];
      comp.gender = ['M'];
      //comp.programUuids = ['uuid-1','uuid-2'];
      comp.stateUuids = ['uuid-3','uuid-6'];
      comp.startAge = 0;
      comp.endAge = 120;

      // simulate previous erroneous state
      comp.isLoadingReport = false;
      comp.encounteredError = true;
      comp.errorMessage = 'some error';
      fixture.detectChanges();
      comp.generateReport();

    });

  it('should report errors when generating patient referral report fails',
    (done) => {
      comp = fixture.componentInstance;
      let service = fixture.componentInstance.patientReferralResourceService;
      let referralSpy = spyOn(service, 'getPatientReferralReport')
        .and.callFake((locationUuids, startDate, endDate) => {
          let subject = new Subject<any>();

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
    });

});
