import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { TestBed, inject, async } from '@angular/core/testing';
// import { BehaviorSubject, Observable } from 'rxjs/Rx';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../../app-settings';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { TodaysVitalsComponent } from './todays-vitals.component';
import { PatientService } from '../../services/patient.service';
import { VisitResourceService } from '../../../openmrs-api/visit-resource.service';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { Patient } from '../../../models/patient.model';

import { Vital } from '../../../models/vital.model';
import { TodaysVitalsService } from './todays-vitals.service';
import { FakeVisitResourceService } from '../../../openmrs-api/fake-visit-resource.service';
import {
  ProgramEnrollmentResourceService
} from '../../../openmrs-api/program-enrollment-resource.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { RoutesProviderService
} from '../../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';

describe('Component: Todays Vitals Unit Tests', () => {

  let vitalsService: TodaysVitalsService, patientService: PatientService,
    fakeAppFeatureAnalytics: AppFeatureAnalytics, component;

  let fixture, el, patientServiceSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        TodaysVitalsService,
        BaseRequestOptions,
        PatientService,
        PatientProgramService,
        ProgramResourceService,
        ProgramService,
        RoutesProviderService,
        PatientResourceService,
        FakeAppFeatureAnalytics,
        VisitResourceService,
        ProgramEnrollmentResourceService,
        EncounterResourceService,
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
        TodaysVitalsComponent
      ]
    });

    patientService = TestBed.get(PatientService);
    vitalsService = TestBed.get(TodaysVitalsService);

    // spyOn(patientService, 'currentlyLoadedPatient').and.callFake(function (params) {
    //   return patientSubject.asObservable();
    // });


  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(TodaysVitalsComponent);
      component = fixture.componentInstance;
    });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {
    expect(component).toBeTruthy();
    done();
  });

  it('should have required properties', (done) => {
    expect(component.todaysVitals.length).toBe(0);
    expect(component.patient).toBeUndefined();
    expect(component.loadingTodaysVitals).toBeDefined();
    expect(component.errors.length).toBe(0);

    done();

  });

  it('should fetch patient todays vitals when patient changes', (done) => {
    let spy = spyOn(component, 'getTodaysVitals').and.callThrough();
    // console.log('spy', spy);
    // console.log('component', component);
    patientService.currentlyLoadedPatient.next(new Patient({ person: { uuid: 'new-uuid' } }));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalledWith('new-uuid');
    done();
  });

});
