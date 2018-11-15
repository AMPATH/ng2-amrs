/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { DailyScheduleBaseComponent } from './daily-schedule.component';
import { ClinicDashboardCacheService }
from '../../clinic-dashboard/services/clinic-dashboard-cache.service';
import { ClinicFlowCacheService } from '../../hiv-care-lib/clinic-flow/clinic-flow-cache.service';

import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from './../../utils/local-storage.service';
import { NgBusyModule } from 'ng-busy';
import {
  Router, ActivatedRoute, Params,
  RouterModule, ChildrenOutletContexts,
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { ClinicScheduleLibModule } from '../clinic-schedule-lib.module';
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
import { MatProgressSpinnerModule, MatProgressBarModule, MatTabsModule,
  MatSlideToggleModule, MatDatepickerModule, MatNativeDateModule, MatDatepickerToggle
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { Angulartics2Module } from 'angulartics2';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/dist/ngx-formentry/';
import {
    ProgramVisitEncounterSearchComponent
} from './../../program-visit-encounter-search/program-visit-encounter-search.component';
import * as Moment from 'moment';
import { AngularMultiSelectModule } from
'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { DepartmentProgramsConfigService }
from './../../etl-api/department-programs-config.service';
import { SelectDepartmentService
} from './../../program-visit-encounter-search/program-visit-encounter-search.service';

describe('Component: DailySchedule', () => {
  let fakeAppFeatureAnalytics: AppFeatureAnalytics,
    component: DailyScheduleBaseComponent,
    clinicDashBoardCacheService: ClinicDashboardCacheService,
    clinicFlowCacheService: ClinicFlowCacheService,
    activatedRoute: ActivatedRoute,
    departmentProgConfigService: DepartmentProgramsConfigService,
    localStorageService: LocalStorageService,
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
        SelectDepartmentService,
        DepartmentProgramsConfigService,
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
      declarations: [DailyScheduleBaseComponent, ProgramVisitEncounterSearchComponent],
      imports: [NgBusyModule,
        FormsModule,
        DialogModule,
        CalendarModule,
        DataListsModule,
        NgamrsSharedModule,
        NgxMyDatePickerModule.forRoot(),
        CommonModule, Angulartics2Module,
        RouterModule,
        DateTimePickerModule,
        AngularMultiSelectModule,
        MatTabsModule,
        MatProgressSpinnerModule,
        MatProgressBarModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSlideToggleModule
      ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DailyScheduleBaseComponent);
      component = fixture.componentInstance;
      clinicDashBoardCacheService = TestBed.get(ClinicDashboardCacheService);
      departmentProgConfigService = TestBed.get( DepartmentProgramsConfigService);
      activatedRoute = TestBed.get(ActivatedRoute);
      clinicFlowCacheService = TestBed.get(ClinicFlowCacheService);
      router = TestBed.get(Router);
    });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
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
      component = new DailyScheduleBaseComponent(clinicDashBoardCacheService, router,
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
