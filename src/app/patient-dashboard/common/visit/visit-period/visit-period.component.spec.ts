import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { TestBed, inject, async, fakeAsync, ComponentFixture, tick } from '@angular/core/testing';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';

import { AppFeatureAnalytics
} from '../../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics
} from '../../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../../../app-settings';
import { LocalStorageService } from '../../../../utils/local-storage.service';
import { VisitPeriodComponent } from './visit-period.component';
import { PatientService } from '../../../services/patient.service';
import { VisitResourceService } from '../../../../openmrs-api/visit-resource.service';
import { PatientResourceService } from '../../../../openmrs-api/patient-resource.service';
import { Patient } from '../../../../models/patient.model';
import { FakeVisitResourceService } from '../../../../openmrs-api/fake-visit-resource.service';
import {
  ProgramEnrollmentResourceService
} from '../../../../openmrs-api/program-enrollment-resource.service';
import { ConfirmationService } from 'primeng/primeng';
import { LocationResourceService } from '../../../../openmrs-api/location-resource.service';
import { EncounterResourceService } from '../../../../openmrs-api/encounter-resource.service';
import {
  Router, ActivatedRoute, Params,
  RouterModule, ChildrenOutletContexts,
} from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CacheService } from 'ionic-cache';
import { DataCacheService } from '../../../../shared/services/data-cache.service';
import { BusyModule, BusyConfig } from 'angular2-busy';
import { PatientProgramService } from '../../../programs/patient-programs.service';
import { RoutesProviderService
} from '../../../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../../programs/program.service';
import { ProgramResourceService } from '../../../../openmrs-api/program-resource.service';
import { ProgramWorkFlowResourceService
} from '../../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService
} from '../../../../openmrs-api/program-workflow-state-resource.service';
import { RetrospectiveDataEntryModule
} from '../../../../retrospective-data-entry/retrospective-data-entry.module';
import { UserService } from '../../../../openmrs-api/user.service';
import { User } from '../../../../models/user.model';
class MockActivatedRoute {
  public params: any = {};
  public queryParams = Observable.of(this.params);
}

class LocationServiceMock {
  constructor() {
  }
  public getLocations(): Observable<any> {
    return Observable.of([{
      uuid: '08feae7c-1352-11df-a1f1-0026b9348838',
      display: 'location',
      name: 'location',
      countyDistrict: 'district',
      stateProvince: 'county'
    }, {
      uuid: 'uuid 2',
      display: 'location 2',
      name: 'location 2',
      countyDistrict: 'district 2',
      stateProvince: 'county 2'
    }]);
  }
}

class UserServiceMock {
  constructor() {
  }
  public getLoggedInUser(): User {
    return new User({});
  }
}

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
describe('Component: Visit Period Component Unit Tests', () => {
  let route: MockActivatedRoute;
  let fakeAppFeatureAnalytics: AppFeatureAnalytics,
    component: VisitPeriodComponent;
  let el, patientServiceSpy;
  let fixture: ComponentFixture<VisitPeriodComponent>;

  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        PatientService,
        PatientProgramService,
        ProgramService,
        RoutesProviderService,
        ProgramResourceService,
        PatientResourceService,
        FakeAppFeatureAnalytics,
        VisitResourceService,
        EncounterResourceService,
        ProgramEnrollmentResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        ConfirmationService,
        LocationResourceService,
        LocalStorageService,
        CacheService,
        UserService,
        DataCacheService,
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        },
        {
          provide: UserService,
          useClass: UserServiceMock
        },
        {
          provide: Router,
          useClass: class {
            public navigate = jasmine.createSpy('navigate');
          }
        },
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        {
          provide: VisitResourceService,
          useClass: FakeVisitResourceService
        },
        {
          provide: LocationResourceService,
          useClass: LocationServiceMock
        },
        AppSettingsService,
        LocalStorageService
      ],
      declarations: [
        VisitPeriodComponent
      ],
      imports: [FormsModule, BusyModule, RetrospectiveDataEntryModule]
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(VisitPeriodComponent);
      component = fixture.componentInstance;
    });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create component instance', (done) => {
    expect(component).toBeDefined();
    done();
  });

  it('should have properties', (done) => {
    expect(component.loadingVisit).toBeDefined();
    expect(component.subscribeToRouteChangeEvent).toBeDefined();
    expect(component.getLocations).toBeDefined();
    expect(component.subscribeToPatientChangeEvent).toBeDefined();
    expect(component.ngOnDestroy).toBeDefined();
    expect(component.ngOnInit).toBeDefined();
    expect(component.loadedInitialLocation).toBeDefined();
    expect(component.loadingVisitPeriod).toBeDefined();
    done();
  });

  it('should populate visit uuid from route when visitUuid param exists',
    inject([ActivatedRoute, VisitResourceService], (activatedRoute: ActivatedRoute,
                                                    visitResourceService: VisitResourceService) => {
      activatedRoute.params['visitUuid'] = 'visit-uuid';
      component.subscribeToRouteChangeEvent();

      expect(component.encounterVisitUuid).toEqual('visit-uuid');
      expect(component.startDatetime).toEqual('2017-01-20T16:29:45.000+0300');
      expect(component.stopDatetime).toEqual('2017-01-20T16:30:45.000+0300');
      expect(component.locationUuid).toEqual({ value: 'uuid', label: 'display'});

      activatedRoute.params['visitUuid'] = null;
      component.subscribeToRouteChangeEvent();
      expect(component.encounterVisitUuid).toEqual('');

    }));

  it('should populate visit uuid from existing visit when encounter param exists',
    inject([PatientService, ActivatedRoute], (patientService: PatientService,
                                              activatedRoute: ActivatedRoute) => {
      let patientDetails = {
        person: {uuid: 'new-uuid'},
        encounters: [
          {
            uuid: 'encounter-uuid',
            encounterDatetime: '2017-01-20T16:30:02.000+0300',
            visit: {
              uuid: 'visit-uuid',
              startDatetime: '2017-01-22T16:29:45.000+0300',
              stopDatetime: '2017-01-22T16:30:45.000+0300',
              location: {uuid: 'uuid'}
            }

          }]
      };
      patientService.currentlyLoadedPatient.next(new Patient(patientDetails));
      component.subscribeToPatientChangeEvent();
      expect(component.encounters[0].visit.startDatetime).toEqual('2017-01-22T16:29:45.000+0300');
      expect(component.encounters[0].visit.stopDatetime).toEqual('2017-01-22T16:30:45.000+0300');
      expect(component.encounters[0].visit.location.uuid).toEqual('uuid');
      activatedRoute.params['encounter'] = 'encounter-uuid';

      component.subscribeToRouteChangeEvent();
      expect(component.encounterVisitUuid).toEqual('visit-uuid');
      expect(component.startDatetime).toEqual('2017-01-22T16:29:45.000+0300');
      expect(component.stopDatetime).toEqual('2017-01-22T16:30:45.000+0300');

      activatedRoute.params['encounter'] = null;
      component.subscribeToRouteChangeEvent();
      expect(component.encounterVisitUuid).toEqual('');

      activatedRoute.params['encounter'] = 'wrong-encounter-uuid';
      component.subscribeToRouteChangeEvent();
      expect(component.encounterVisitUuid).toEqual('');
    }));

  it('should populate visit period information when ngOnInit is called',
    inject([PatientService, ActivatedRoute], (patientService: PatientService,
                                              activatedRoute: ActivatedRoute) => {
      let patientDetails = {
        person: {uuid: 'new-uuid'},
        encounters: [
          {
            uuid: 'encounter-uuid',
            encounterDatetime: '2017-01-20T16:30:02.000+0300',
            visit: {
              uuid: 'visit-uuid',
              startDatetime: '2017-01-22T16:29:45.000+0300',
              stopDatetime: '2017-01-22T16:30:45.000+0300',
              location: {uuid: 'uuid', display: 'display'}
            }

          }]
      };
      patientService.currentlyLoadedPatient.next(new Patient(patientDetails));
      activatedRoute.params['encounter'] = 'encounter-uuid';
      component.ngOnInit();
      expect(component.encounterVisitUuid).toEqual('visit-uuid');
      expect(component.startDatetime).toEqual('2017-01-22T16:29:45.000+0300');
      expect(component.stopDatetime).toEqual('2017-01-22T16:30:45.000+0300');
    }));

  it('should not populate visit period information when patient does not have encounters',
    inject([PatientService, ActivatedRoute], (patientService: PatientService,
                                              activatedRoute: ActivatedRoute) => {
      let patientDetails = {
        person: {uuid: 'new-uuid'},
        encounters: []
      };
      patientService.currentlyLoadedPatient.next(new Patient(patientDetails));
      activatedRoute.params['encounter'] = 'encounter-uuid';
      component.ngOnInit();
      expect(component.encounterVisitUuid).toEqual('');
      expect(component.startDatetime).toEqual('');
      expect(component.stopDatetime).toEqual('');
      expect(component.currentVisit).toEqual('');
      expect(component.locationUuid).toBeFalsy(undefined);
    }));

  it('should load a list of encounter locations',
    inject([LocationResourceService], (locationService: LocationResourceService) => {
      component.getLocations();
      expect(component.locations.length).toEqual(2);
    }));

  it('should return an error when a visit cannot be loaded', (done) => {
    let service: VisitResourceService = TestBed.get(VisitResourceService);
    let fakeRes: FakeVisitResourceService =
      TestBed.get(VisitResourceService) as FakeVisitResourceService;

    // tell mock to return error on next call
    fakeRes.returnErrorOnNext = true;
    let results = service.getVisitByUuid('uuid', {});
    results.subscribe((result) => {
      },
      (error) => {
        // when it gets here, then it returned an error
        done();
      });

  });

});
