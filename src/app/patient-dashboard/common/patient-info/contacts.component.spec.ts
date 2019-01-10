
import { TestBed, inject, async } from '@angular/core/testing';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { ContactsComponent } from './contacts.component';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { PatientService } from '../../services/patient.service';
import {
  ProgramEnrollmentResourceService
} from '../../../openmrs-api/program-enrollment-resource.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { RoutesProviderService } from '../../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';


describe('Component: Contacts Unit Tests', () => {

  let patientResourceService: PatientResourceService,
    patientService: PatientService,
    fakeAppFeatureAnalytics: AppFeatureAnalytics, component;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientService,
        PatientProgramService,
        ProgramService,
        RoutesProviderService,
        ProgramResourceService,
        ProgramEnrollmentResourceService,
        FakeAppFeatureAnalytics,
        ContactsComponent,
        EncounterResourceService,
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics
        },
        {
          provide: PatientResourceService,
        },
        {
          provide: PatientService,
        },
        AppSettingsService,
        LocalStorageService
      ]
    });

    patientResourceService = TestBed.get(PatientResourceService);
    fakeAppFeatureAnalytics = TestBed.get(AppFeatureAnalytics);
    component = TestBed.get(ContactsComponent);

    patientService = TestBed.get(PatientService);
    component = new ContactsComponent(patientService);


  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {

    expect(component).toBeTruthy();
    done();

  });
  it('should have all the required functions defined and callable', (done) => {
    spyOn(component, 'getPatient').and.callFake((err, data) => { });
    component.getPatient((err, data) => { });
    expect(component.getPatient).toHaveBeenCalled();


    done();

  });

});
