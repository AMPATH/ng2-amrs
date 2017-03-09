/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DataListsModule } from '../../data-lists/data-lists.module';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import {
  DailyScheduleResourceService
} from
  '../../etl-api/daily-scheduled-resource.service';
import { DailyScheduleNotReturned } from './daily-schedule-not-returned.component';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { BusyModule, BusyConfig } from 'angular2-busy';
import {
  AccordionModule, DataTableModule, SharedModule, TabViewModule,
  GrowlModule, PanelModule, ConfirmDialogModule, ConfirmationService,
  DialogModule, InputTextModule, MessagesModule, InputTextareaModule,
  DropdownModule, ButtonModule, CalendarModule
} from 'primeng/primeng';
import { Router, ActivatedRoute } from '@angular/router';
import { CacheService } from 'ionic-cache/ionic-cache';
import { DataCacheService } from '../../shared/services/data-cache.service';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
describe('Component: DailyScheduleNotReturned', () => {
  let fakeAppFeatureAnalytics: AppFeatureAnalytics, component,
    dailyScheduleResource: DailyScheduleResourceService,
    clinicDashBoardCacheService: ClinicDashboardCacheService,
    fixture, componentInstance;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
        DailyScheduleResourceService,
        ClinicDashboardCacheService,
        MockBackend,
        BaseRequestOptions,
        AppSettingsService,
        LocalStorageService,
        CacheService,
        DataCacheService,
        {
          provide: Router,
          useClass: class { navigate = jasmine.createSpy('navigate'); }
        },
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend,
            defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: AppFeatureAnalytics, useFactory: () => {
            return new FakeAppFeatureAnalytics();
          }, deps: []
        }

      ],
      declarations: [DailyScheduleNotReturned],
      imports: [BusyModule,
        FormsModule,
        DialogModule,
        CalendarModule,
        DataListsModule,
        NgamrsSharedModule]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DailyScheduleNotReturned);
      component = fixture.componentInstance;
    });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    clinicDashBoardCacheService = TestBed.get(ClinicDashboardCacheService);
    dailyScheduleResource = TestBed.get(DailyScheduleResourceService);
    let appointmentsComponent = new DailyScheduleNotReturned(clinicDashBoardCacheService,
      dailyScheduleResource);
    expect(appointmentsComponent).toBeTruthy();
  });

  it('should have required properties', (done) => {

    expect(component.notReturnedPatientList.length).toBe(0);
    expect(component.selectedDate).toBeDefined;
    expect(component.ngOnInit).toBeDefined();
    expect(component.ngOnChanges).toBeDefined();
    expect(component.getQueryParams).toBeDefined();
    expect(component.getDailyHasNotReturned).toBeDefined();
    expect(component.errors.length).toBe(0);
    expect(component.selectedDate).toEqual(undefined);
    expect(component.selectedClinic).toEqual(undefined);
    expect(component.dataLoaded).toEqual(false);
    expect(component.loadingDailyNotReturned).toEqual(false);

    done();

  });

  it('should call component methods', (done) => {
    clinicDashBoardCacheService = TestBed.get(ClinicDashboardCacheService);
    component.selectedDate = '12-12-2016';
    spyOn(component, 'getDailyHasNotReturned').and.callThrough();
    component.getDailyHasNotReturned({
      startDate: '2017-02-01',
      startIndex: undefined,
      locationUuids: 'uuid',
      limit: undefined
    });
    expect(component.getDailyHasNotReturned).toHaveBeenCalled();
    spyOn(component, 'ngOnInit').and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();

    done();
  });

});


