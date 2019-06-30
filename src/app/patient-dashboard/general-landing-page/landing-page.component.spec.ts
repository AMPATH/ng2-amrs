
import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

import { Observable, BehaviorSubject, of } from 'rxjs';
import { PatientService } from '../services/patient.service';
import { ProgramService } from '../programs/program.service';
import { GeneralLandingPageComponent } from './landing-page.component';
import { Patient } from '../../models/patient.model';
import { PanelModule, DialogModule } from 'primeng/primeng';
import { NgamrsSharedModule } from '../../shared/ngamrs-shared.module';
import { OpenmrsApi } from '../../openmrs-api/openmrs-api.module';
import { CohortMemberModule } from '../../patient-list-cohort/cohort-member/cohort-member.module';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { PatientProgramService } from '../programs/patient-programs.service';
import { ZeroVlPipe } from './../../shared/pipes/zero-vl-pipe';
import {
  DepartmentProgramsConfigService
} from '../../etl-api/department-programs-config.service';
import {
  DataCacheService
} from '../../shared/services/data-cache.service';
import { CacheService } from 'ionic-cache';
import {
  PatientReferralService
} from '../../program-manager/patient-referral.service';
import { UserDefaultPropertiesService } from '../../user-default-properties/user-default-properties.service';
import { PatientProgramResourceService } from '../../etl-api/patient-program-resource.service';
import { PatientReferralResourceService } from '../../etl-api/patient-referral-resource.service';
import { delay } from 'rxjs/operators';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PatientDashboardModule } from '../patient-dashboard.module';

const progConfig = {
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

const prog = {
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
    return of({ status: 'okay' });
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

  getPatientProgramVisitConfigs(uuid) {
    return of(prog).pipe(delay(50));
  }
  getPatientProgramVisitTypes(patient: string, program: string,
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
  let router: Router;
  let patientReferral;
  let userDefaultPropertiesSetting;
  let patientService;
  let patientProgramResourceService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        ZeroVlPipe,
        PatientProgramService,
        DepartmentProgramsConfigService,
        DataCacheService,
        CacheService,
        {
          provide: Router,
          useClass: class { public navigate = jasmine.createSpy('navigate'); }
        },
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
        }

      ],
      declarations: [],
      imports: [
        PanelModule,
        CommonModule,
        FormsModule,
        CohortMemberModule,
        PatientDashboardModule,
        OpenmrsApi,
        RouterModule,
        HttpClientTestingModule,
        RouterTestingModule,
        DialogModule]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(GeneralLandingPageComponent);
      component = fixture.componentInstance;
    });
  }));

  afterEach(() => {
    component._resetVariables();
  });

  it('should create an instance', async(() => {
    patientReferral = TestBed.get(PatientReferralService);
    userDefaultPropertiesSetting = TestBed.get(UserDefaultPropertiesService);
    patientProgramResourceService = TestBed.get(PatientProgramResourceService);
    patientService = TestBed.get(PatientService);
    router = TestBed.get(Router);
    router = TestBed.get(Router);

    component = new GeneralLandingPageComponent(patientService,
      patientReferral, userDefaultPropertiesSetting,
      patientProgramResourceService, router);
    expect(component).toBeTruthy();
  }));

  it('should load programs, enrolled and enrollable when `loadProgramBatch` is called',
    (inject([PatientService, ProgramService,
      LocationResourceService, HttpTestingController],
      (ps: PatientService,
        prs: ProgramService, ls: LocationResourceService,
        backend: HttpTestingController) => {
        component.loadProgramBatch();
      }))
  );

  it('should generate error when `loadProgramBatch` has an error response',
    (inject([PatientService, ProgramService,
      LocationResourceService, HttpTestingController],
      (ps: PatientService,
        prs: ProgramService, ls: LocationResourceService,
        httpTestingController: HttpTestingController) => {
        component.loadProgramBatch('uuid');
      }))
  );
});

