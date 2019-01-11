import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { of } from 'rxjs';
import { AgGridModule } from 'ag-grid-angular';
import { ProgramEnrollmentPatientListComponent } from './program-enrollent-patient-list.component';
import { PatientProgramEnrollmentService } from './../etl-api/patient-program-enrollment.service';

class MockRouter {
    public navigate = jasmine.createSpy('navigate');
}

const mockParams = {
    endDate: '2019-01-31',
    locationUuids: ['luuid'],
    programType: 'puuid1',
    startDate: '2019-01-01'

};

const mockEnrollments = [
    {
        date_completed: '2019-01-03T09:09:49.000Z',
        death_date: null,
        enrolled_date: '2019-01-03T09:09:49.000Z',
        location_id: 1,
        patient_identifier: '7139799-1, 15204-226',
        patient_name: 'Test Patient1',
        patient_program_id: 37,
        person_id: 1,
        person_uuid: 'puuid1',
        program_id: 1,
        program_name: 'STANDARD HIV TREATMENT',
        program_uuid: 'uuid1'
    },
    {
        date_completed: null,
        death_date: null,
        enrolled_date: '2019-01-01T21:00:00.000Z',
        location_id: 1,
        patient_identifier: '16792M-6',
        patient_name: 'Test Patient2',
        patient_program_id: 39,
        person_id: 2,
        person_uuid: 'puuid2',
        program_id: 1,
        program_name: 'STANDARD HIV TREATMENT',
        program_uuid: 'uuid1'
    }
];

const mockEnrolledPatietList = [
    {
        identifier: '7139799-1, 15204-226',
        name: 'Test Patient1',
        no: 1,
        patient_uuid: 'puuid1',
        program: 'STANDARD HIV TREATMENT( Enrolled - 03-Jan-2019)( Completed - 03-Jan-2019) '
    },
    {
        identifier: '16792M-6',
        name: 'Test Patient2',
        no: 2,
        patient_uuid: 'puuid2',
        program: 'STANDARD HIV TREATMENT( Enrolled - 02-Jan-2019)'
    }
];

const mockActivatedRoute = {
    queryParams: {
      subscribe: jasmine.createSpy('subscribe')
        .and
        .returnValue(of(mockParams))
    }
};

const patientProgramEnrollmentService =
jasmine.createSpyObj('PatientProgramEnrollmentService', ['getActivePatientEnrollmentPatientList']);

const patientProgramEnrollmentServiceSpy =
patientProgramEnrollmentService.getActivePatientEnrollmentPatientList.and.returnValue( of(mockEnrollments) );

const mockLocation =
jasmine.createSpyObj('Location', ['back']);

const mockLocationSpy =
mockLocation.back;


class MockGridOptions {
    public api = {
        exportDataAsCsv() {

        }
    };

}


describe('Component: ProgramEnrollmentPatientListComponent', () => {
  let fixture: ComponentFixture<ProgramEnrollmentPatientListComponent>;
  let patientsProgramEnrollmentService: any;
  let router: Router;
  let route: ActivatedRoute;
  let comp: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:
      [
        FormsModule,
        AgGridModule.withComponents([])
      ],
      declarations: [
        ProgramEnrollmentPatientListComponent
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
            provide : Location,
            useValue : mockLocation,
        },
        {
            provide: PatientProgramEnrollmentService,
            useValue : patientProgramEnrollmentService
        }
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(ProgramEnrollmentPatientListComponent);
        comp = fixture.componentInstance;
        patientsProgramEnrollmentService =
        fixture.debugElement.injector.get<PatientProgramEnrollmentService>(PatientProgramEnrollmentService);
        router = fixture.debugElement.injector.get<Router>(Router);
        route = fixture.debugElement.injector.get<ActivatedRoute>(ActivatedRoute);

      });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
      expect(comp).toBeDefined();
  });
  it('should call enrollment service on getEnrolledPatientList call', () => {
      comp.getEnrolledPatientList(mockParams);
      expect(patientProgramEnrollmentServiceSpy.calls.any()).toBe(true, 'getActivePatientEnrollmentPatientList');
  });

  it('should generate correct enrollment patient list from given params', () => {
    comp.getEnrolledPatientList(mockParams);
    expect(comp.enrolledPatientList).toEqual(mockEnrolledPatietList);
  });

  it('should navigate back to summary on back to summarycall', () => {
    comp.backToSummary();
    expect(mockLocationSpy.calls.any()).toBe(true, 'back');
  });

  it('should navigate to patient dashboard on redirect to  ', () => {
    comp.backToSummary();
    expect(mockLocationSpy.calls.any()).toBe(true, 'back');
  });


});
