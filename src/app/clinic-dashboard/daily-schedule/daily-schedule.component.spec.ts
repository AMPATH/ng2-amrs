/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { DailyScheduleComponent } from './daily-schedule.component';
import { ClinicDashboardCacheService } from '../services/clinic-dashboard-cache.service';
import { ClinicFlowCacheService } from '../../hiv-care-lib/clinic-flow/clinic-flow-cache.service';

import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../app-settings';
import { LocalStorageService } from '../../utils/local-storage.service';
import { BusyModule, BusyConfig } from 'angular2-busy';
import {
  Router, ActivatedRoute, Params,
  RouterModule, ChildrenOutletContexts,
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import {
  AccordionModule, DataTableModule, SharedModule, TabViewModule,
  GrowlModule, PanelModule, ConfirmDialogModule, ConfirmationService,
  DialogModule, InputTextModule, MessagesModule, InputTextareaModule,
  DropdownModule, ButtonModule, CalendarModule
} from 'primeng/primeng';
import { CacheService } from 'ionic-cache';
import { DataCacheService } from '../../shared/services/data-cache.service';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { MdTabsModule } from '@angular/material';
import { CommonModule } from '@angular/common';
import { Angulartics2Module } from 'angulartics2';
import { DateTimePickerModule } from 'ng2-openmrs-formentry/dist/components/date-time-picker';

import * as Moment from 'moment';

describe('Component: DailySchedule', () => {
  let fakeAppFeatureAnalytics: AppFeatureAnalytics,
    component: DailyScheduleComponent,
    clinicDashBoardCacheService: ClinicDashboardCacheService,
    clinicFlowCacheService: ClinicFlowCacheService,
    activatedRoute: ActivatedRoute,
    router: Router, fixture, componentInstance;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
        ClinicDashboardCacheService,
        MockBackend,
        BaseRequestOptions,
        AppSettingsService,
        LocalStorageService,
        CacheService,
        DataCacheService,
        ClinicFlowCacheService,
        ChildrenOutletContexts,
        {
          provide: ActivatedRoute, useValue: {
          snapshot: {
            queryParams: {}
          }
        }
        },
        {
          provide: Router,
          useClass: class {
            public navigate = jasmine.createSpy('navigate');
          }
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
      declarations: [DailyScheduleComponent],
      imports: [BusyModule,
        FormsModule,
        DialogModule,
        CalendarModule,
        DataListsModule,
        NgamrsSharedModule,
        NgxMyDatePickerModule,
        NgxMyDatePickerModule,
        MdTabsModule,
        CommonModule, Angulartics2Module,
        RouterModule,
        DateTimePickerModule
      ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DailyScheduleComponent);
      component = fixture.componentInstance;
    });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });


  it('should create an instance', () => {
    clinicDashBoardCacheService = TestBed.get(ClinicDashboardCacheService);
    activatedRoute = TestBed.get(ActivatedRoute);
    clinicFlowCacheService = TestBed.get(ClinicFlowCacheService);
    router = TestBed.get(Router);
    component = new DailyScheduleComponent(
      clinicDashBoardCacheService, router, activatedRoute, clinicFlowCacheService
    );
    expect(component).toBeTruthy();
  });

  it('should have required properties', (done) => {
    expect(component.ngOnInit).toBeDefined();
    expect(component.getSelectedDate).toBeDefined();
    expect(component.onGenerateReport).toBeDefined();
    expect(component.errors.length).toBe(0);
    expect(component.selectedDate).toEqual(undefined);
    expect(component.selectedLocation).toEqual(undefined);
    done();

  });

  it('should set cached selected date when getSelectedDate is invoked with date ',
    (done) => {
      let service = TestBed.get(ClinicFlowCacheService);
      component.getSelectedDate('2017-01-07');
      service.getSelectedDate().subscribe((date) => {
        expect(date).toEqual('2017-01-07');
        done();
      },
        (err) => console.log(err),
        () => console.log('Completed'));

    });

  it('should subscribe to selected date, location and is loading '
    + ' when ngOnInit is invoked',
    (done) => {
      let service = TestBed.get(ClinicFlowCacheService);
      let dashBoardCacheservice = TestBed.get(ClinicDashboardCacheService);
      dashBoardCacheservice.setCurrentClinic('location-uuid');
      service.setSelectedDate('2012-01-01');

      // before ngOnInit
      expect(component.loadingData).toEqual(true);
      expect(component.selectedDate).toEqual(undefined);

      component.ngOnInit();

      // after ngOnInit
      expect(component.selectedLocation).toEqual('location-uuid');
      expect(component.selectedDate).toEqual('2012-01-01');
      done();
    });


  it('should initialize selected date when ngOnInit '
    + ' after initilizing data',
    (done) => {
      let service = TestBed.get(ClinicFlowCacheService);
      service.setSelectedDate('2017-01-07');
      clinicDashBoardCacheService = TestBed.get(ClinicDashboardCacheService);
      clinicDashBoardCacheService.setCurrentClinic('location-uuid');
      activatedRoute = TestBed.get(ActivatedRoute);
      router = TestBed.get(Router);
      component = new DailyScheduleComponent(clinicDashBoardCacheService, router,
        activatedRoute, service);

      component.ngOnInit();
      service.getSelectedDate().subscribe((date) => {
        expect(date).toEqual('2017-01-07');
        done();
      },
        (err) => console.log(err),
        () => console.log('Completed'));

    });


});
