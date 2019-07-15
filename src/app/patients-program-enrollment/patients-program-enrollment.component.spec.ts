import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { PatientProgramEnrollmentService } from './../etl-api/patient-program-enrollment.service';
import { DepartmentProgramsConfigService } from './../etl-api/department-programs-config.service';
import { PatientsProgramEnrollmentComponent } from './patients-program-enrollment.component';
import { PatientProgramResourceService } from './../etl-api/patient-program-resource.service';
import { LocationResourceService } from './../openmrs-api/location-resource.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DepartmentProgramFilterComponent } from './../department-program-filter/department-program-filter.component';
import { of } from 'rxjs';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown/angular2-multiselect-dropdown';
import { AgGridModule } from 'ag-grid-angular';
import { DateTimePickerModule } from 'ngx-openmrs-formentry/';
import { ProgramEnrollmentSummaryComponent } from './program-enrollment-summary.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ClinicDashboardCacheService } from 'src/app/clinic-dashboard/services/clinic-dashboard-cache.service';
import { LocalStorageService } from './../utils/local-storage.service';

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

const mockEnrollmentPayload = {
  startDate: '01-01-2019',
  endDate: '31-01-2019'
};

const mockDepartmentProgramConfig = {
  'uud4': {
    'name': 'BSG',
    'programs': [
        {
            'uuid': '781d8a88-1359-11df-a1f1-0026b9348838',
            'name': 'BSG PROGRAM'
        }
    ]
},
'uud5': {
    'name': 'DERMATOLOGY',
    'programs': [
        {
            'uuid': 'b3575274-1850-429b-bb8f-2ff83faedbaf',
            'name': 'DERMATOLOGY'
        }
    ]
}

};

const mockEnrollmentSummary = [
  {
  enrollment_count: 19,
  patient_program_id: 371764,
  program_name: 'STANDARD HIV TREATMENT',
  program_uuid: '781d85b0-1359-11df-a1f1-0026b9348838'
  },
  {
    enrollment_count: 1,
    patient_program_id: 399775,
    program_name: 'HIV DIFFERENTIATED CARE PROGRAM',
    program_uuid: '334c9e98-173f-4454-a8ce-f80b20b7fdf0'
  },
  {
    enrollment_count: 4,
    patient_program_id: 399548,
    program_name: 'PEP PROGRAM',
    program_uuid: '96047aaf-7ab3-45e9-be6a-b61810fe617d'
  },
  {
    enrollment_count: 3,
    patient_program_id: 399841,
    program_name: 'HIV RETENTION PROGRAM',
    program_uuid: 'c6bf3625-de80-4a88-a913-38273e300a55'
  }
];

const departmentProgramConfigService =
jasmine.createSpyObj('DepartmentProgramsConfigService', ['getDartmentProgramsConfig']);

const getDepartmentProgramsSpy =
departmentProgramConfigService.getDartmentProgramsConfig.and.returnValue( of(mockDepartmentProgramConfig) );

const clinicDashboardCacheService =
jasmine.createSpyObj('ClinicDashboardCacheService', ['getDartmentProgramsConfig']);


const patientProgramEnrollmentService =
jasmine.createSpyObj('PatientProgramEnrollmentService', ['getActivePatientEnrollmentSummary']);

const patientProgramEnrollmentServiceSpy =
patientProgramEnrollmentService.getActivePatientEnrollmentSummary.and.returnValue( of(mockEnrollmentSummary) );

const patientProgramResourceService =
jasmine.createSpyObj('PatientProgramResourceService', ['getAllProgramVisitConfigs']);

const patientProgramResourceServiceSpy =
patientProgramResourceService.getAllProgramVisitConfigs.and.returnValue( of(mockEnrollmentSummary) );

const  locationResourceService =
jasmine.createSpyObj('LocationResourceService', ['getLocations']);

const locationResourceServiceSpy =
locationResourceService.getLocations.and.returnValue( of(mockDepartmentProgramConfig) );

const  localStorageService =
jasmine.createSpyObj('LocalStorageService', ['getItem']);




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
  let router: Router;
  let cd: ChangeDetectorRef;
  let comp: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:
      [
        FormsModule,
        HttpClientTestingModule,
        AngularMultiSelectModule,
        DateTimePickerModule,
        AgGridModule.withComponents([])
      ],
      declarations: [
        PatientsProgramEnrollmentComponent,
        DepartmentProgramFilterComponent,
        ProgramEnrollmentSummaryComponent
      ],
      providers: [
        {
          provide: Router,
          useClass: MockRouter
        },
        {
          provide: ActivatedRoute,
          useValue: mockActivatedRoute
        },
        {
          provide : DepartmentProgramsConfigService,
          useValue : departmentProgramConfigService
        },
        {
          provide :  PatientProgramEnrollmentService,
          useValue : patientProgramEnrollmentService
        },
        {
          provide : PatientProgramResourceService,
          useValue : patientProgramResourceService
        },
        {
          provide: ClinicDashboardCacheService,
          useValue :  clinicDashboardCacheService
        },
        {
          provide: LocationResourceService,
          useValue :  locationResourceService
        },
        {
          provide: LocalStorageService,
          useValue :  localStorageService
        }
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(PatientsProgramEnrollmentComponent);
        comp = fixture.componentInstance;
       const patientsProgramService =
        fixture.debugElement.injector.get<PatientProgramEnrollmentService>(PatientProgramEnrollmentService);
        const departmentService = fixture.debugElement.injector
        .get<DepartmentProgramsConfigService>(DepartmentProgramsConfigService);
        cd = fixture.debugElement.injector.get<ChangeDetectorRef>(ChangeDetectorRef as any);
        router = fixture.debugElement.injector.get<Router>(Router);

      });
  }));

  afterEach(() => {
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

  it('should reset data on reset filter', () => {
    comp.filterReset(true);
    expect(comp.enrolledSummary).toEqual([]);
    expect(comp.enrolledPatientList).toEqual([]);
    expect(comp.showSummary).toEqual(false);
  });

  it('should call department service on get department config method call', () => {
      comp.getDepartmentConfig();
      expect(getDepartmentProgramsSpy.calls.any()).toBe(true, 'getDepartmentConfig');
  });

  it('should call enrollment service on get getEnrollmentSummary method call', () => {
    comp.getEnrollmentSummary(mockParams);
    expect(patientProgramEnrollmentServiceSpy.calls.any()).toBe(true, 'getActivePatientEnrollmentSummary');
  });

});
