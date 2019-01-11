import { of } from 'rxjs';
import { TestBed, async, fakeAsync, ComponentFixture } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { PatientProgramResourceService } from './../etl-api/patient-program-resource.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { DepartmentProgramsConfigService } from './../etl-api/department-programs-config.service';
import { UserDefaultPropertiesService } from './../user-default-properties/user-default-properties.service';
import { AppSettingsService } from './../app-settings/app-settings.service';
import { LocationResourceService } from './../openmrs-api/location-resource.service';
import { DepartmentProgramFilterComponent } from './department-program-filter.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { AppFeatureAnalytics } from './../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from './../shared/app-analytics/app-feature-analytcis.mock';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/dist/ngx-formentry/';
import { UserService } from './../openmrs-api/user.service';
import { ChangeDetectorRef } from '@angular/core';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheService } from 'ionic-cache';
import { IonicStorageModule } from '@ionic/storage';
import { SessionStorageService } from './../utils/session-storage.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';

const programsSelected = [
  {
    'id': '1',
    'itemName': 'TEST PROGRAM'
  }
];

const mocklocationSelected = [{
  'id': '1',
  'itemName': 'Test-location'
}];

const mockDepartmentSelected = [
  {
    'id': '1',
    'itemName': 'TEST Department'
  }

];
const mockDepartments = [
  {
    'id': '1',
    'itemName': 'TEST Department'
  },
  {
    'id': '2',
    'itemName': 'TEST Department 2'
  }

];
const mockPrograms = [
  {
    'id': '1',
    'itemName': 'TEST PROGRAM'
  },
  {
    'id': '2',
    'itemName': 'TEST PROGRAM'
  }

];

class MockCacheStorageService {
  constructor(a, b) { }

  public ready() {
    return true;
  }
}


const mockParams = {
  'startDate': '2018-03-01',
  'endDate': '2018-03-31',
  'locationUuids': ['1'],
  'programType': ['1'],
  'department': ['1']

};

class MockRouter {
  public navigate = jasmine.createSpy('navigate');
}

const mockActivatedRoute = {
  queryParams: {
    subscribe: jasmine.createSpy('subscribe')
      .and
      .returnValue(of(mockParams))
  }
};

const selectedStartDate = '2018-03-01';
const selectedEndDate = '2018-03-31';

describe('Component : DepartmentProgramFilter', () => {
  let comp: DepartmentProgramFilterComponent;
  let fixture: ComponentFixture<DepartmentProgramFilterComponent>;
  let nativeElement: any;
  let patientProgramService: PatientProgramResourceService;
  let localStorageService: LocalStorageService;
  let departmentProgramService: DepartmentProgramsConfigService;
  let userDefaultService: UserDefaultPropertiesService;
  let locationResourceService: LocationResourceService;
  let cd: ChangeDetectorRef;
  let route: Router;
  let router: ActivatedRoute;

  beforeEach(async(() => {

    fixture = TestBed.createComponent(DepartmentProgramFilterComponent);
    comp = fixture.componentInstance;
    nativeElement = fixture.nativeElement;

    TestBed.configureTestingModule({
      imports:
        [
          AngularMultiSelectModule,
          FormsModule,
          DateTimePickerModule,
          HttpClientTestingModule,
          IonicStorageModule.forRoot(),
        ],
      providers: [
        PatientProgramResourceService,
        LocationResourceService,
        AppSettingsService,
        LocalStorageService,
        DepartmentProgramsConfigService,
        UserDefaultPropertiesService,
        LocationResourceService,
        SessionStorageService,
        CacheService,
        DataCacheService,
        UserService,
        Storage,
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        {
          provide: CacheStorageService, useFactory: () => {
            return new MockCacheStorageService(null, null);
          }
        },
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        },
      ]
    }).compileComponents()
      .then(() => {

        patientProgramService = fixture.debugElement.injector.get(PatientProgramResourceService);
        localStorageService = fixture.debugElement.injector.get(LocalStorageService);
        userDefaultService = fixture.debugElement.injector.get(UserDefaultPropertiesService);
        departmentProgramService = fixture.debugElement.injector
          .get(DepartmentProgramsConfigService);
        locationResourceService = fixture.debugElement.injector.get(LocationResourceService);
        cd = fixture.debugElement.injector.get(ChangeDetectorRef);
        route = fixture.debugElement.injector.get(Router);
        router = fixture.debugElement.injector.get(ActivatedRoute);
      });
  }));


  afterEach(() => {
    TestBed.resetTestingModule();
  });

  xit('should create an instance', () => {
    expect(comp).toBeDefined();
  });

  xit('should set params and emit params on set filter', () => {
    const spy = spyOn(comp, 'passParamsToUrl');
    comp.location = mocklocationSelected;
    comp.selectedStartDate = selectedStartDate;
    comp.selectedEndDate = selectedEndDate;
    comp.department = mockDepartmentSelected;
    comp.program = programsSelected;
    comp.location = mocklocationSelected;
    comp.setFilter();
    cd.detectChanges();
    expect(comp.params).toEqual(mockParams);
  });

});
