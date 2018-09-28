
/* tslint:disable:no-unused-variable */
import { TestBed, async } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Http, BaseRequestOptions } from '@angular/http';
import { Observable } from 'rxjs';
import { MockBackend } from '@angular/http/testing';
import { DataListsModule } from '../../shared/data-lists/data-lists.module';
import { ClinicDashboardCacheService }
from '../../clinic-dashboard/services/clinic-dashboard-cache.service';
import {
  DailyScheduleResourceService
} from
  '../../etl-api/daily-scheduled-resource.service';
import { DailyScheduleNotReturnedComponent } from './daily-schedule-not-returned.component';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../app-settings';
import { LocalStorageService } from '../../utils/local-storage.service';
import { NgBusyModule, BusyConfig } from 'ng-busy';
import {
  AccordionModule, DataTableModule, SharedModule, TabViewModule,
  GrowlModule, PanelModule, ConfirmDialogModule, ConfirmationService,
  DialogModule, InputTextModule, MessagesModule, InputTextareaModule,
  DropdownModule, ButtonModule, CalendarModule
} from 'primeng/primeng';
import { Router, ActivatedRoute } from '@angular/router';
import { CacheService } from 'ionic-cache';
import { DataCacheService } from '../../shared/services/data-cache.service';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import {
    ProgramVisitEncounterSearchComponent
} from './../../program-visit-encounter-search/program-visit-encounter-search.component';
import { AngularMultiSelectModule }
from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { DepartmentProgramsConfigService }
from './../../etl-api/department-programs-config.service';
class MockActivatedRoute {
 public params = Observable.of([{ 'id': 1 }]);
 public snapshot = {
    queryParams: { filter: '' }
  };
}
describe('Component: DailyScheduleNotReturned', () => {
  let fakeAppFeatureAnalytics: AppFeatureAnalytics, component,
    dailyScheduleResource: DailyScheduleResourceService,
    clinicDashBoardCacheService: ClinicDashboardCacheService,
    localStorageService: LocalStorageService,
    departmentProgConfigService: DepartmentProgramsConfigService,
    route: ActivatedRoute,
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
        DepartmentProgramsConfigService,
        {
          provide: Router,
          useClass: class { public navigate = jasmine.createSpy('navigate'); }
        },
         {
                    provide: ActivatedRoute,
                    useClass: MockActivatedRoute
         },
        {
          provide: Http,
          useFactory: (
            backendInstance: MockBackend,
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
      declarations: [DailyScheduleNotReturnedComponent, ProgramVisitEncounterSearchComponent],
      imports: [NgBusyModule,
        FormsModule,
        DialogModule,
        CalendarModule,
        DataListsModule,
        AngularMultiSelectModule,
        NgamrsSharedModule]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
          fixture = TestBed.createComponent(DailyScheduleNotReturnedComponent);
          component = fixture.componentInstance;
          clinicDashBoardCacheService = TestBed.get(ClinicDashboardCacheService);
          dailyScheduleResource = TestBed.get(DailyScheduleResourceService);
          departmentProgConfigService = TestBed.get( DepartmentProgramsConfigService);
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

    expect(component.notReturnedPatientList.length).toBe(0);
    expect(component.ngOnInit).toBeDefined();
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
    done();
  });

  it('should create params when getQueryParams is called', (done) => {
    spyOn(component, 'getQueryParams').and.callThrough();
    component.selectedDate = '12-12-2016';
    component.selectedClinic = 'location-uuid';
    let params = component.getQueryParams();
    expect(component.getQueryParams).toHaveBeenCalled();
    expect(params.locationUuids).toEqual('location-uuid');
    expect(params.startDate).toEqual('12-12-2016');
    expect(params.limit).toBeUndefined();
    expect(params.startIndex).toEqual(0);
    done();
  });

});
