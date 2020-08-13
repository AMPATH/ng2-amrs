/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router, ActivatedRoute, ChildrenOutletContexts } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

import { DailyScheduleBaseComponent } from './daily-schedule.component';
import {
  ClinicDashboardCacheService
} from '../../clinic-dashboard/services/clinic-dashboard-cache.service';
import { ClinicFlowCacheService } from '../../hiv-care-lib/clinic-flow/clinic-flow-cache.service';

import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from './../../utils/local-storage.service';
import { NgBusyModule } from 'ng-busy';

import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { DialogModule, CalendarModule } from 'primeng/primeng';
import { CacheModule } from 'ionic-cache/dist/cache.module';
import { DataCacheService } from '../../shared/services/data-cache.service';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { CommonModule } from '@angular/common';
import { Angulartics2Module } from 'angulartics2';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/';
import {
  ProgramVisitEncounterSearchComponent
} from './../../program-visit-encounter-search/program-visit-encounter-search.component';
import {
  AngularMultiSelectModule
} from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import {
  DepartmentProgramsConfigService
} from './../../etl-api/department-programs-config.service';
import { SelectDepartmentService } from './../../shared/services/select-department.service';
import * as moment from 'moment';
import { MatTabsModule } from '@angular/material/tabs';

describe('Component: DailySchedule', () => {
  let component: DailyScheduleBaseComponent,
    clinicDashBoardCacheService: ClinicDashboardCacheService,
    clinicFlowCacheService: ClinicFlowCacheService,
    activatedRoute: ActivatedRoute,
    departmentProgConfigService: DepartmentProgramsConfigService,
    router: Router, fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
        ClinicDashboardCacheService,
        AppSettingsService,
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
          provide: AppFeatureAnalytics, useFactory: () => {
            return new FakeAppFeatureAnalytics();
          }, deps: []
        }

      ],
      declarations: [DailyScheduleBaseComponent, ProgramVisitEncounterSearchComponent],
      imports: [
        NgBusyModule,
        FormsModule,
        DialogModule,
        CalendarModule,
        DataListsModule,
        NgamrsSharedModule,
        CacheModule.forRoot(),
        CommonModule, Angulartics2Module,
        RouterTestingModule,
        HttpClientTestingModule,
        DateTimePickerModule,
        AngularMultiSelectModule,
        MatTabsModule
      ]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DailyScheduleBaseComponent);
      component = fixture.componentInstance;
      clinicDashBoardCacheService = TestBed.get(ClinicDashboardCacheService);
      departmentProgConfigService = TestBed.get(DepartmentProgramsConfigService);
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
    expect(component.selectedDate).toEqual(moment().format('MMM  D , YYYY '));
    expect(component.selectedLocation).toEqual(undefined);
    done();

  });

  it('should set cached selected date when getSelectedDate is invoked with date ',
    (done) => {
      const service = TestBed.get(ClinicFlowCacheService);
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
      clinicDashBoardCacheService.setCurrentClinic('location-uuid');
      clinicFlowCacheService.setSelectedDate('2012-01-01');
      // before ngOnInit
      expect(component.loadingData).toEqual(true);
      expect(component.selectedDate).toEqual(moment().format('MMM  D , YYYY '));

      component.ngOnInit();

      // after ngOnInit
      expect(component.selectedLocation).toEqual('location-uuid');
      expect(component.selectedDate).toEqual('Jan  1 , 2012 ');
      done();
    });

  it('should initialize selected date when ngOnInit '
    + ' after initilizing data',
    (done) => {
      clinicFlowCacheService.setSelectedDate('2017-01-07');
      clinicDashBoardCacheService.setCurrentClinic('location-uuid');
      activatedRoute = TestBed.get(ActivatedRoute);
      router = TestBed.get(Router);

      component.ngOnInit();
      clinicFlowCacheService.getSelectedDate().subscribe((date) => {
          expect(date).toEqual('2017-01-07');
          done();
        },
        (err) => console.log(err),
        () => console.log('Completed'));

    });

});
