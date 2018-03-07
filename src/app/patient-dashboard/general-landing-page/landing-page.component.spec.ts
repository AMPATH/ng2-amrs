
import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http, BaseRequestOptions, ResponseOptions, Response } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { RouterModule } from '@angular/router';

import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { PatientService } from '../services/patient.service';
import { ProgramService } from '../programs/program.service';
import { GeneralLandingPageComponent } from './landing-page.component';
import { Patient } from '../../models/patient.model';
import { PanelModule, DialogModule } from 'primeng/primeng';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { OpenmrsApi } from '../../openmrs-api/openmrs-api.module';
import { HivProgramSnapshotComponent
} from '../hiv/program-snapshot/hiv-program-snapshot.component';
import { CohortMemberModule }
 from '../../patient-list-cohort/cohort-member/cohort-member.module';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { PatientProgramService } from '../programs/patient-programs.service';
import { BusyComponent } from '../../shared/busy-loader/busy.component';
import { UnenrollPatientProgramsComponent
   } from '../../patient-dashboard/common/programs/unenroll-patient-programs.component';
import { ZeroVlPipe } from './../../shared/pipes/zero-vl-pipe';

class FakePatientService {
  public currentlyLoadedPatient: BehaviorSubject<Patient> =
  new BehaviorSubject(new Patient({ person: { uuid: '123' } }));
  constructor() {
  }
  public fetchPatientByUuid(uuid) {
    this.currentlyLoadedPatient.next(new Patient({
      person: {
        uuid: uuid
      },
      enrolledPrograms: [],
      encounters: [],
    }));
  }
}

class LocationStub {

  public getLocations(payload): Observable<any> {
    return Observable.of({status: 'okay'});
  }
}
class FakeProgramService {
  constructor() {
  }

  public saveUpdateProgramEnrollment(payload) {
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
        ZeroVlPipe,
        PatientProgramService,
        {
          provide: PatientService,
          useClass: FakePatientService
        },
        {
          provide: LocationResourceService,
          useClass: LocationStub
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
      declarations: [GeneralLandingPageComponent, HivProgramSnapshotComponent, BusyComponent,
      UnenrollPatientProgramsComponent, ZeroVlPipe],
      imports: [PanelModule, CommonModule, FormsModule, CohortMemberModule,
        NgamrsSharedModule, OpenmrsApi, RouterModule, DialogModule]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(GeneralLandingPageComponent);
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
    fakeAsync(inject([PatientService, ProgramService,
        LocationResourceService, MockBackend],
      (ps: PatientService,
       prs: ProgramService, ls: LocationResourceService,
       backend: MockBackend) => {
        const availablePrograms = [
          {
            program: {uuid: '123'},
            enrolledProgram: {programUuid: '123', uuid: '12345'},
            programUuid: '12345',
            isFocused: false,
            dateEnrolled: null,
            dateCompleted: null,
            validationError: '',
            buttons: {
              link: {
                display: 'Go to program',
                url: '/patient-dashboard/patient/uuid/test/landing-page'
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
                body: [[{programUuid: '123', uuid: '12345'}], [{uuid: '123'}]]
              }
            )));
          component.loadProgramBatch();
          tick();
          expect(component.availablePrograms).toEqual(availablePrograms);
        });
      }))
  );

  it('should generate error when `loadProgramBatch` has an error response',
    fakeAsync(inject([PatientService, ProgramService,
        LocationResourceService, MockBackend],
      (ps: PatientService,
       prs: ProgramService, ls: LocationResourceService,
       backend: MockBackend) => {
        backend.connections.subscribe((connection: MockConnection) => {
          connection.mockError(new Error('An error occured'));
          component.loadProgramBatch('uuid');
          tick();
          expect(component.availablePrograms).toEqual([]);
          expect(component.hasError).toEqual(true);
          expect(component.errors.length).toEqual(1);
          expect(component.errors[0].error).toEqual('An error occured');
        });
      }))
  );
});

