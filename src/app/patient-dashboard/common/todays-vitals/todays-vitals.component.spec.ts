/* tslint:disable:prefer-const */
import { TestBed, inject, async } from '@angular/core/testing';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
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
import {
  RoutesProviderService
} from '../../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';
import {
  ProgramWorkFlowResourceService
} from '../../../openmrs-api/program-workflow-resource.service';
import {
  ProgramWorkFlowStateResourceService
} from '../../../openmrs-api/program-workflow-state-resource.service';
import { HttpClientTestingBackend } from '@angular/common/http/testing/src/backend';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { VitalsDatasource } from './vitals.datasource';

describe('Component: Todays Vitals Unit Tests', () => {

  let vitalsService: TodaysVitalsService, patientService: PatientService,
    fakeAppFeatureAnalytics: AppFeatureAnalytics, component;

  let fixture, el, patientServiceSpy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TodaysVitalsService,
        PatientService,
        PatientProgramService,
        ProgramResourceService,
        ProgramService,
        RoutesProviderService,
        PatientResourceService,
        FakeAppFeatureAnalytics,
        VisitResourceService,
        ProgramEnrollmentResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        EncounterResourceService,
        VitalsDatasource,
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
      ],
      imports: [HttpClientTestingModule]
    });

    patientService = TestBed.get(PatientService);
    vitalsService = TestBed.get(TodaysVitalsService);

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
    expect(component.patient).toBeDefined();
    expect(component.loadingTodaysVitals).toBeDefined();
    expect(component.errors.length).toBe(0);

    done();

  });

  /*it('should fetch patient todays vitals when patient changes', (done) => {
    const spy = spyOn(component, 'getTodaysVitals').and.callThrough();
    patientService.currentlyLoadedPatient.next(new Patient({ person: { uuid: 'new-uuid' } }));
    fixture.detectChanges();
    expect(spy).toHaveBeenCalled();
    done();
  });*/

});
