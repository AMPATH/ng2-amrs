import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed, async, fakeAsync, ComponentFixture } from '@angular/core/testing';
import * as _ from 'lodash';
import * as Moment from 'moment';
import { PatientProgramEnrollmentService } from
    './../etl-api/patient-program-enrollment.service';
import { DepartmentProgramsConfigService } from
'./../etl-api/department-programs-config.service';
import { PatientProgramResourceService } from
'./../etl-api/patient-program-resource.service';
import { PatientsProgramEnrollmentComponent } from './patients-program-enrollment.component';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Http, Response, Headers, BaseRequestOptions, ResponseOptions } from '@angular/http';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, Params } from '@angular/router';
import { AppSettingsService } from './../app-settings/app-settings.service';
import { LocalStorageService } from './../utils/local-storage.service';
import { AppFeatureAnalytics } from './../shared/app-analytics/app-feature-analytics.service';
import { DepartmentProgramFilterComponent } from './../department-program-filter/department-program-filter.component';
import { UserDefaultPropertiesService } from './../user-default-properties/user-default-properties.service';
import { UserService } from './../openmrs-api/user.service';
import { of } from 'rxjs';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { AgGridModule } from 'ag-grid-angular';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/dist/ngx-formentry/';
import { DataCacheService } from '../shared/services/data-cache.service';
import { CacheService } from 'ionic-cache';
import { IonicStorageModule } from '@ionic/storage';
import { SessionStorageService } from './../utils/session-storage.service';
import { LocationResourceService } from './../openmrs-api/location-resource.service';
import { ProgramEnrollmentSummaryComponent } from './program-enrollment-summary.component';
class MockRouter {
    public navigate = jasmine.createSpy('navigate');
   }
const mockParams: any = {
    'startDate': '2018-04-01',
    'endDate': '2018-04-30',
    'locationUuids': 'luuid1',
    'programType': 'uuid1'
};

const mockActivatedRoute = {
  queryParams: {
    subscribe: jasmine.createSpy('subscribe')
      .and
      .returnValue(of(mockParams))
  }
};

const mockActiveEnrollmentsResult: any = [
  {
  'date_completed' : null,
  'death_date' : null,
  'enrolled_date' : '2018-02-28T21:00:00.000Z',
  'location_id' : 1,
  'patient_identifier' : '1321',
  'patient_name' : 'Test Patient 1',
  'patient_program_id' : '1',
  'person_id' : '1',
  'person_uuid' : 'f4788c37',
  'program_id' : '1',
  'program_name' : 'STANDARD HIV TREATMENT',
  'program_uuid' : 'uuid1'
  },
  {
    'date_completed' : null,
    'death_date' : null,
    'enrolled_date' : '2018-03-01T05:46:30.000Z',
    'location_id' : 1,
    'patient_identifier' : '1320',
    'patient_name' : 'Test Patient 2',
    'patient_program_id' : '2',
    'person_id' : '528495',
    'person_uuid' : 'f4788c38',
    'program_id' : '2',
    'program_name' : 'HIV DIFFERENTIATED CARE PROGRAM',
    'program_uuid' : 'uuid2'
    }

];

const mockEnrollmentSummaryResult: any = [
{
  'enrollment_count' : 1051 ,
  'patient_program_id': 1 ,
  'program_name' : 'STANDARD HIV TREATMENT',
  'program_uuid' : 'uuid1'
},
{
  'enrollment_count' : 1000 ,
  'patient_program_id': 2 ,
  'program_name' : 'HIV DIFFERENTIATED CARE PROGRAM',
  'program_uuid' : 'uuid2'

}];

const mockDepartmentConfig = {
  'deptUuId1': {
    'name': 'HIV',
    'programs': [
      {
        'uuid': 'uuid1',
        'name': 'STANDARD HIV TREATMENT'
      },
      {
        'uuid': 'uuid2',
        'name': 'HIV DIFFERENTIATED CARE PROGRAM'
      }
    ]
  },
  'deptUuId2': {
    'name': 'OVC',
    'programs': [
      {
        'uuid': '781d8768',
        'name': 'OVC PROGRAM'
      }

    ]
  }

};

const mockSummaryList = [
  { dept: 'HIV', program: 'STANDARD HIV TREATMENT', enrolled: 1051, programUuid: 'uuid1' },
  { dept: 'HIV', program: 'HIV DIFFERENTIATED CARE PROGRAM', enrolled: 1000, programUuid: 'uuid2' },
  { dept: 'Total', program: '#Total', enrolled: 2051, programUuid : ''}

];

describe('Component: Patient Program Enrollment', () => {
  let fixture: ComponentFixture<PatientsProgramEnrollmentComponent>;
  let patientProgramEnrollmentService: PatientProgramEnrollmentService;
  let localStorageService: LocalStorageService;
  let departmentProgramService: DepartmentProgramsConfigService;
  let patientProgramResourceService: PatientProgramResourceService;
  let route: ActivatedRoute;
  let router: Router;
  let cd: ChangeDetectorRef;
  let storage: Storage;
  let comp: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:
      [
        FormsModule,
        AngularMultiSelectModule,
        IonicStorageModule.forRoot(),
        DateTimePickerModule,
        AgGridModule.withComponents([])
      ],
      declarations: [
        PatientsProgramEnrollmentComponent,
        DepartmentProgramFilterComponent,
        ProgramEnrollmentSummaryComponent
      ],
      providers: [
        Storage,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        { provide: Router, useClass: MockRouter },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        },
        PatientProgramEnrollmentService,
        DepartmentProgramsConfigService,
        PatientProgramResourceService,
        UserDefaultPropertiesService,
        SessionStorageService,
        UserService,
        LocationResourceService,
        AppFeatureAnalytics,
        AppSettingsService,
        LocalStorageService,
        DataCacheService,
        CacheService,
        MockBackend,
        BaseRequestOptions
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PatientsProgramEnrollmentComponent);
        comp = fixture.componentInstance;
        patientProgramEnrollmentService =
        fixture.debugElement.injector.get(PatientProgramEnrollmentService);
        departmentProgramService = fixture.debugElement.injector
        .get(DepartmentProgramsConfigService);
        cd = fixture.debugElement.injector.get(ChangeDetectorRef);
        router = fixture.debugElement.injector.get(Router);

      });
  }));

  afterAll(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
      expect(comp).toBeDefined();
  });

  it('should generate program summary list from summary list response', () => {
    comp.departmentProgConfig = mockDepartmentConfig;
    comp.processEnrollmentSummary(mockEnrollmentSummaryResult);
    cd.detectChanges();
    expect(comp.enrolledSummary).toEqual(mockSummaryList);
  });

  it('should set correct query params', () => {
    comp.setQueryParams(mockParams);
    cd.detectChanges();
    expect(comp.params).toEqual(mockParams);
  });

});
