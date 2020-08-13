/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router, ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import {
  ClinicDashboardCacheService
} from '../../clinic-dashboard/services/clinic-dashboard-cache.service';
import {
  DailyScheduleResourceService
} from '../../etl-api/daily-scheduled-resource.service';
import { DailyScheduleAppointmentsComponent } from './daily-schedule-appointments.component';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { NgBusyModule } from 'ng-busy';
import { DialogModule, CalendarModule } from 'primeng/primeng';
import { CacheModule } from 'ionic-cache/dist/cache.module';
import { DataCacheService } from '../../shared/services/data-cache.service';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/';
import {
  ProgramVisitEncounterSearchComponent
} from './../../program-visit-encounter-search/program-visit-encounter-search.component';
import { AngularMultiSelectModule
} from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { DepartmentProgramsConfigService
} from './../../etl-api/department-programs-config.service';

describe('Component: DailyScheduleAppointmentsComponent', () => {
  let component,
    dailyScheduleResource: DailyScheduleResourceService,
    clinicDashBoardCacheService: ClinicDashboardCacheService,
    localStorageService: LocalStorageService,
    departmentProgConfigService: DepartmentProgramsConfigService,
    route: ActivatedRoute, fixture;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DailyScheduleResourceService,
        ClinicDashboardCacheService,
        AppSettingsService,
        LocalStorageService,
        DataCacheService,
        DepartmentProgramsConfigService,
        {
          provide: Router,
          useClass: class {
            public navigate = jasmine.createSpy('navigate');
          }
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({id: 123})
          }
        },
        {
          provide: AppFeatureAnalytics, useFactory: () => {
            return new FakeAppFeatureAnalytics();
          }, deps: []
        }

      ],
      declarations: [DailyScheduleAppointmentsComponent,
        ProgramVisitEncounterSearchComponent],
      imports: [NgBusyModule,
        FormsModule,
        DialogModule,
        CalendarModule,
        DataListsModule,
        CacheModule.forRoot(),
        HttpClientTestingModule,
        DateTimePickerModule,
        AngularMultiSelectModule,
        NgamrsSharedModule]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(DailyScheduleAppointmentsComponent);
      component = fixture.componentInstance;
      clinicDashBoardCacheService = TestBed.get(ClinicDashboardCacheService);
      dailyScheduleResource = TestBed.get(DailyScheduleResourceService);
      departmentProgConfigService = TestBed.get(DepartmentProgramsConfigService);
      route = TestBed.get(ActivatedRoute);
      localStorageService = TestBed.get(LocalStorageService);
    });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  it('should have required properties', (done) => {

    expect(component.dailyAppointmentsPatientList.length).toBe(0);
    expect(component.ngOnInit).toBeDefined();
    expect(component.getQueryParams).toBeDefined();
    expect(component.getDailyAppointments).toBeDefined();
    expect(component.errors.length).toBe(0);
    expect(component.selectedDate).toEqual(undefined);
    expect(component.selectedClinic).toEqual(undefined);
    expect(component.dataLoaded).toEqual(false);
    expect(component.loadingDailyAppointments).toEqual(false);

    done();

  });

  it('should fetch daily appointments when location changes', (done) => {
    clinicDashBoardCacheService = TestBed.get(ClinicDashboardCacheService);
    spyOn(component, 'getDailyAppointments').and.callThrough();
    component.getDailyAppointments({
      startDate: '2017-02-01',
      startIndex: 0,
      locationUuids: 'uuid',
      limit: undefined
    });
    expect(component.getDailyAppointments).toHaveBeenCalled();

    done();
  });

  it('should create params when getQueryParams is called', (done) => {
    spyOn(component, 'getQueryParams').and.callFake(() => {
      return {
        startDate: '12-12-2016',
        startIndex: 0,
        locationUuids: 'location-uuid',
        limit: undefined
      };
    });
    component.selectedDate = '12-12-2016';
    component.selectedClinic = 'location-uuid';
    const params = component.getQueryParams();
    expect(component.getQueryParams).toHaveBeenCalled();
    expect(params.locationUuids).toEqual('location-uuid');
    expect(params.startDate).toEqual('12-12-2016');
    expect(params.limit).toBeUndefined();
    expect(params.startIndex).toEqual(0);
    done();
  });

});
