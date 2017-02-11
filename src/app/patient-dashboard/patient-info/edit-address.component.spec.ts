
import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { TestBed, inject, async } from '@angular/core/testing';

import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import { PatientService } from '../patient.service';
import { EditAddressComponent } from './edit-address.component';
import { PersonResourceService } from '../../openmrs-api/person-resource.service';
import { ProgramEnrollmentResourceService }
  from '../../openmrs-api/program-enrollment-resource.service';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';

describe('Component: EditAddress Unit Tests', () => {

  let personResourceService: PersonResourceService,
    patientResourceService: PatientResourceService,
    fakeAppFeatureAnalytics: AppFeatureAnalytics, component;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MockBackend,
        BaseRequestOptions,
        FakeAppFeatureAnalytics,
        PatientService,
        ProgramEnrollmentResourceService,
        EncounterResourceService,
        EditAddressComponent,
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
          provide: PersonResourceService,
        },
        {
          provide: PatientResourceService,
        },
        AppSettingsService,
        LocalStorageService
      ]
    });

    personResourceService = TestBed.get(PersonResourceService);
    patientResourceService = TestBed.get(PersonResourceService);
    fakeAppFeatureAnalytics = TestBed.get(AppFeatureAnalytics);
    component = TestBed.get(EditAddressComponent);
  });
  let personAddressPayload = {
    addresses: [{
      address1: '111',
      address2: '3322',
      address3: '1228',
      cityVillage: 'eldoret',
      stateProvince: 'rift',
    }]
  };

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should instantiate the component', (done) => {
    expect(component).toBeTruthy();
    done();

  });
  it('should have  the required functions defined and callable', (done) => {
    spyOn(component, 'getPatient').and.callFake((err, data) => { });
    component.getPatient((err, data) => { });
    expect(component.getPatient).toHaveBeenCalled();
    done();
    spyOn(component, 'updatePersonAddress').and.callFake((err, data) => { });
    component.updatePersonAddress((err, data) => { });
    expect(component.updatePersonAddress).toHaveBeenCalled();
    done();


  });
  it('should have required properties', (done) => {
    expect(component.address1).toBeUndefined();
    expect(component.address1).toBeUndefined();
    expect(component.address2).toBeUndefined();
    expect(component.address3).toBeUndefined();
    expect(component.cityVillage).toBeUndefined();
    expect(component.stateProvince).toBeUndefined();
    expect(component.preferredAddressUuid).toBeUndefined();
    done();
  });

});

