
import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Http, BaseRequestOptions, ResponseOptions, Response } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { RouterModule } from '@angular/router';

import { Observable, BehaviorSubject, of } from 'rxjs';
import { PatientService } from '../services/patient.service';
import { ProgramService } from '../programs/program.service';
import { GeneralLandingPageComponent } from './landing-page.component';
import { Patient } from '../../models/patient.model';
import { PanelModule, DialogModule } from 'primeng/primeng';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { OpenmrsApi } from '../../openmrs-api/openmrs-api.module';
import { CohortMemberModule }
 from '../../patient-list-cohort/cohort-member/cohort-member.module';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { PatientProgramService } from '../programs/patient-programs.service';
import { ZeroVlPipe } from './../../shared/pipes/zero-vl-pipe';
import { DepartmentProgramsConfigService
} from '../../etl-api/department-programs-config.service';
import { DataCacheService
} from '../../shared/services/data-cache.service';
import { CacheService } from 'ionic-cache';
import { PatientReferralService
} from '../../referral-module/services/patient-referral-service';
import { UserDefaultPropertiesService } from '../../user-default-properties/user-default-properties.service';
import { PatientProgramResourceService } from '../../etl-api/patient-program-resource.service';
import { PatientReferralResourceService } from '../../etl-api/patient-referral-resource.service';
import { delay } from 'rxjs/operators';

let progConfig = {
  uuid: 'some-uuid',
  visitTypes: [
    {
      uuid: 'visit-one',
      encounterTypes: []
    },
    {
      uuid: 'some-visit-type-uuid',
      encounterTypes: []
    },
    {
      uuid: 'visit-two',
      encounterTypes: []
    }
  ]
};

let prog = {
  'some-uuid': progConfig
};

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
    return of({status: 'okay'});
  }
}
class FakePatientReferralService {
  formsComplete: BehaviorSubject<boolean> = new BehaviorSubject(false);
  constructor() {
  }

  public saveProcessPayload(payload) {
  }

  public getProcessPayload() {
    return of({});
  }
}
class FakeProgramService {
  constructor() {
  }

  public saveUpdateProgramEnrollment(payload) {
    return of(payload);
  }
}
class FakePatientReferralResourceService {
  constructor() {
  }

  public getPatientReferralReport(params) {
    return of({});

  }

  public getPatientReferralPatientList(params) {
    return of({});
  }

  public getReferralLocationByEnrollmentUuid(uuid: string) {
    return of({});
  }
}
class FakePatientProgramResourceService {
  constructor() {
  }

  getAllProgramVisitConfigs() {
    return of(prog).pipe(delay(50));
  }

  getPatientProgramVisitConfigs (uuid) {
    return of(prog).pipe(delay(50));
  }
  getPatientProgramVisitTypes (patient: string, program: string,
                               enrollment: string, location: string) {
    return of(progConfig);
  }
}
class FakeUserDefaultPropertiesService {
  public locationSubject = new BehaviorSubject<any>('');

  constructor() { }

  public getLocations(): Observable<any> {
    return of([{}]);

  }

  public getCurrentUserDefaultLocation() {
  return 'location';
  }

  public getCurrentUserDefaultLocationObject() {
    return null;
  }
  public getAuthenticatedUser() {
    return {};
  }

  public setUserProperty(propertyKey: string, property: string) {

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
        DepartmentProgramsConfigService,
        DataCacheService,
        CacheService,
        {
          provide: PatientService,
          useClass: FakePatientService
        },
        {
          provide: PatientReferralService,
          useClass: FakePatientReferralService
        },
        {
          provide: PatientReferralResourceService,
          useClass: FakePatientReferralResourceService
        },
        {
          provide: PatientProgramResourceService,
          useClass: FakePatientProgramResourceService
        },
        {
          provide: UserDefaultPropertiesService,
          useClass: FakeUserDefaultPropertiesService
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
      declarations: [],
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

