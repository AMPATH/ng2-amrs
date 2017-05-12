import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { TestBed, inject, async, fakeAsync, ComponentFixture, tick } from '@angular/core/testing';
import { BehaviorSubject, Observable, Subject } from 'rxjs/Rx';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { VisitPeriodComponent } from './visit-period.component';
import { PatientService } from '../../patient.service';
import { VisitResourceService } from '../../../openmrs-api/visit-resource.service';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { Patient } from '../../../models/patient.model';
import { FakeVisitResourceService } from '../../../openmrs-api/fake-visit-resource.service';
import {
  ProgramEnrollmentResourceService
} from '../../../openmrs-api/program-enrollment-resource.service';

import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import {
  Router, ActivatedRoute, Params,
  RouterModule, RouterOutletMap,
} from '@angular/router';

class MockActivatedRoute {
  params: any = {};
  queryParams = Observable.of(this.params);
}

describe('Component: Visit Period Component Unit Tests', () => {
  let route: MockActivatedRoute;
  let fakeAppFeatureAnalytics: AppFeatureAnalytics, component: VisitPeriodComponent;
  let el, patientServiceSpy;
  let fixture: ComponentFixture<VisitPeriodComponent>;


  beforeEach(() => {

    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        PatientService,
        PatientResourceService,
        FakeAppFeatureAnalytics,
        VisitResourceService,
        EncounterResourceService,
        ProgramEnrollmentResourceService,
        {
          provide: ActivatedRoute,
          useClass: MockActivatedRoute
        },
        {
          provide: Router,
          useClass: class { navigate = jasmine.createSpy('navigate'); }
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
        AppSettingsService,
        LocalStorageService
      ],
      declarations: [
        VisitPeriodComponent
      ]
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

  it('should populate visit uuid from route when visitUuid param exists',
    inject([ActivatedRoute, VisitResourceService], (activatedRoute: ActivatedRoute,
      visitResourceService: VisitResourceService) => {
      activatedRoute.params['visitUuid'] = 'visit-uuid';
      component.subscribeToRouteChangeEvent();

      expect(component.encounterVisitUuid).toEqual('visit-uuid');
      expect(component.startDatetime).toEqual('2017-01-20T16:29:45.000+0300');
      expect(component.stopDatetime).toEqual('2017-01-20T16:30:45.000+0300');

      activatedRoute.params['visitUuid'] = null;
      component.subscribeToRouteChangeEvent();
      expect(component.encounterVisitUuid).toEqual('');

    }));

  it('should populate visit uuid from existing visit when encounter param exists',
    inject([PatientService, ActivatedRoute], (patientService: PatientService,
      activatedRoute: ActivatedRoute) => {
      let patientDetails = {
        person: { uuid: 'new-uuid' },
        encounters: [
          {
            uuid: 'encounter-uuid',
            encounterDatetime: '2017-01-20T16:30:02.000+0300',
            visit: {
              uuid: 'visit-uuid',
              startDatetime: '2017-01-22T16:29:45.000+0300',
              stopDatetime: '2017-01-22T16:30:45.000+0300'
            }

          }]
      };
      patientService.currentlyLoadedPatient.next(new Patient(patientDetails));
      component.subscribeToPatientChangeEvent();
      expect(component.encounters[0].visit.startDatetime).toEqual('2017-01-22T16:29:45.000+0300');
      expect(component.encounters[0].visit.stopDatetime).toEqual('2017-01-22T16:30:45.000+0300');
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
        person: { uuid: 'new-uuid' },
        encounters: [
          {
            uuid: 'encounter-uuid',
            encounterDatetime: '2017-01-20T16:30:02.000+0300',
            visit: {
              uuid: 'visit-uuid',
              startDatetime: '2017-01-22T16:29:45.000+0300',
              stopDatetime: '2017-01-22T16:30:45.000+0300'
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
        person: { uuid: 'new-uuid' },
        encounters: []
      };
      patientService.currentlyLoadedPatient.next(new Patient(patientDetails));
      activatedRoute.params['encounter'] = 'encounter-uuid';
      component.ngOnInit();
      expect(component.encounterVisitUuid).toEqual('');
      expect(component.startDatetime).toEqual('');
      expect(component.stopDatetime).toEqual('');
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
