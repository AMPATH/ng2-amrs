import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http, BaseRequestOptions, ResponseOptions, Response } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { RouterModule } from '@angular/router';

import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { PatientService } from '../patient.service';
import { RoutesProviderService } from '../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../programs/program.service';
import { LandingPageComponent } from './landing-page.component';
import { Patient } from '../../models/patient.model';
import { ProgramEnrollment } from '../../models/program-enrollment.model';
import { Program } from '../../models/program.model';
import { PanelModule } from 'primeng/primeng';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { OpenmrsApi } from '../../openmrs-api/openmrs-api.module';
import { HivProgramSnapshotComponent } from '../programs/hiv/hiv-program-snapshot.component';
import { CohortMemberModule }
 from '../../patient-list-cohort/cohort-member/cohort-member.module';

class FakePatientService {
  currentlyLoadedPatient: BehaviorSubject<Patient> =
  new BehaviorSubject(new Patient({ person: { uuid: '123' } }));
  constructor() {
  }
  fetchPatientByUuid(uuid) {
    this.currentlyLoadedPatient.next(new Patient({
      person: {
        uuid: uuid
      },
      enrolledPrograms: [],
      encounters: [],
    }));
  }
}

class FakeRoutesProviderService {
  patientDashboardConfig: Object = {
    'programs': [{
      'programName': 'General Info',
      'programUuid': '123',
      'baseRoute': 'test',
      'requiresPatientEnrollment': true
    }]
  };
  constructor() {

  }
}

class FakeProgramService {
  constructor() {
  }

  getPatientEnrolledProgramsByUuid(patientUuid): Observable<ProgramEnrollment[]> {
    let enrolledPrograms: Subject<ProgramEnrollment[]> = new Subject<ProgramEnrollment[]>();
    enrolledPrograms.next([new ProgramEnrollment({ programUuid: '123', uuid: '12345' })]);
    return enrolledPrograms.asObservable();
  }

  getAvailablePrograms() {
    let patientEnrollablePrograms: Subject<Program[]> = new Subject<Program[]>();
    patientEnrollablePrograms.next([new Program({ uuid: '123' })]);
    return patientEnrollablePrograms.asObservable();
  }

  saveUpdateProgramEnrollment(payload) {
    return Observable.of(payload);
  }
}
describe('Component: LandingPageComponent', () => {
  let component, fixture;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        {
          provide: PatientService,
          useClass: FakePatientService
        },
        {
          provide: PatientService,
          useClass: FakeRoutesProviderService
        },
        {
          provide: ProgramService,
          useFactory: () => {
            return new FakeProgramService();
          }
        },
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend,
            defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
      declarations: [LandingPageComponent, HivProgramSnapshotComponent],
      imports: [PanelModule, CommonModule, FormsModule, CohortMemberModule,
        NgamrsSharedModule, OpenmrsApi, RouterModule]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(LandingPageComponent);
      component = fixture.componentInstance;
    });
  }));

  afterEach(() => {
    component._resetVariables();
  });

  it('should create an instance', (done) => {
    expect(component).toBeTruthy();
    done();
  });

  it('should load programs, enrolled and enrollable when `loadProgramBatch` is called',
    fakeAsync(inject([PatientService, RoutesProviderService, ProgramService, MockBackend],
      (ps: PatientService, rs: RoutesProviderService, prs: ProgramService,
        backend: MockBackend) => {
        const availablePrograms = [
          {
            program: { uuid: '123' },
            enrolledProgram: { programUuid: '123', uuid: '12345' },
            programUuid: '12345',
            isFocused: false,
            dateEnrolled: null,
            dateCompleted: null,
            validationError: '',
            buttons: {
              link: {
                display: 'Go to program',
                url: '/patient-dashboard/uuid/test/landing-page'
              },
              enroll: {
                display: 'Enroll patient'
              },
              edit: {
                display: 'Edit Enrollment',
              }
            },
            isEnrolled: false
          }
        ];
        backend.connections.subscribe((connection: MockConnection) => {
          connection.mockRespond(new Response(
            new ResponseOptions({
              body: [[{ programUuid: '123', uuid: '12345' }], [{ uuid: '123' }]]
            }
            )));
          component.loadProgramBatch('uuid');
          expect(component.enrolledProgrames).toEqual([{ programUuid: '123', uuid: '12345' }]);
          expect(component.availablePrograms).toEqual(availablePrograms);
        });
      }))
  );

  it('should generate error when `loadProgramBatch` has an error response',
    fakeAsync(inject([PatientService, RoutesProviderService, ProgramService, MockBackend],
      (ps: PatientService, rs: RoutesProviderService, prs: ProgramService,
        backend: MockBackend) => {
        backend.connections.subscribe((connection: MockConnection) => {
          connection.mockError(new Error('An error occured'));
          component.loadProgramBatch('uuid');
          expect(component.enrolledProgrames).toEqual([]);
          expect(component.availablePrograms).toEqual([]);
          expect(component.hasError).toEqual(true);
          expect(component.errors.length).toEqual(1);
          expect(component.errors[0].error).toEqual('An error occured');
        });
      }))
  );
});
