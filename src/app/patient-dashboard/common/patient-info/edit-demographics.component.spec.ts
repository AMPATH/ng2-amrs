import { TestBed, inject, async } from '@angular/core/testing';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { EditDemographicsComponent } from './edit-demographics.component';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { ConceptResourceService } from '../../../openmrs-api/concept-resource.service';
import { PatientService } from '../../services/patient.service';
import { PatientCreationService } from 'src/app/patient-creation/patient-creation.service';

describe('Component: Edit Demographics Unit Tests', () => {
  let personResourceService: PersonResourceService,
    conceptResourceService: ConceptResourceService,
    fakeAppFeatureAnalytics: AppFeatureAnalytics,
    patientService: PatientService,
    component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FakeAppFeatureAnalytics,
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        {
          provide: PersonResourceService
        },
        {
          provide: ConceptResourceService
        },
        {
          provide: PatientService
        },
        {
          provide: PatientCreationService
        },
        AppSettingsService,
        LocalStorageService
      ]
    });

    patientService = TestBed.get(PatientService);
    conceptResourceService = TestBed.get(ConceptResourceService);
    personResourceService = TestBed.get(PersonResourceService);
    fakeAppFeatureAnalytics = TestBed.get(AppFeatureAnalytics);
    component = new EditDemographicsComponent(
      patientService,
      personResourceService,
      conceptResourceService
    );
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {
    expect(component).toBeTruthy();
    done();
  });
  it('should have required properties', (done) => {
    expect(component.display).toBe(false);
    expect(component.givenName).toBeUndefined();
    expect(component.familyName).toBeUndefined();
    expect(component.middleName).toBeUndefined();
    expect(component.isPreferred).toBeUndefined();
    expect(component.isDead).toBeUndefined();
    expect(component.deathDate).toBeUndefined();
    expect(component.causeOfDeath).toBeUndefined();

    done();
  });

  it('should have all the required functions defined and callable', (done) => {
    spyOn(component, 'getPatient').and.callFake((err, data) => {});
    component.getPatient((err, data) => {});
    expect(component.getPatient).toHaveBeenCalled();
    spyOn(component, 'getCauseOfDeath').and.callFake((err, data) => {});
    component.getCauseOfDeath((err, data) => {});
    expect(component.getCauseOfDeath).toHaveBeenCalled();
    done();
  });
});
