/* tslint:disable:no-unused-variable */
/* tslint:disable:prefer-const */
import { TestBed, async } from '@angular/core/testing';
import { PatientEncountersComponent } from './patient-encounters.component';
import { PatientEncounterService } from './patient-encounters.service';
import { PatientService } from '../../services/patient.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppFeatureAnalytics } from 'src/app/shared/app-analytics/app-feature-analytics.service';
describe('Component: PatientEncounters', () => {
  let patientEncounterService: PatientEncounterService,
    patientService: PatientService,
    appFeatureAnalytics: AppFeatureAnalytics,
    router: Router, route: ActivatedRoute;
  let component;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: []

    });
    component = new PatientEncountersComponent(patientEncounterService, patientService, appFeatureAnalytics, router, route);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });
  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });
});
