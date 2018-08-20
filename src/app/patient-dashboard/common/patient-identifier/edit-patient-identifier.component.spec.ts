import { MockBackend } from '@angular/http/testing';
import { Http, BaseRequestOptions, Response, ResponseOptions } from '@angular/http';
import { TestBed, inject, async } from '@angular/core/testing';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../../app-settings';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { PersonResourceService } from '../../../openmrs-api/person-resource.service';
import { PatientService } from '../../services/patient.service';
import { EditPatientIdentifierComponent } from './edit-patient-identifier.component';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import { PatientIdentifierService } from './patient-identifiers.service';
import {
  PatientIdentifierTypeResService
} from '../../../openmrs-api/patient-identifierTypes-resource.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { DataCacheService } from '../../../shared/services/data-cache.service';

describe('Component: EditPatientIdentifierComponent Unit Tests', () => {

  let personResourceService: PersonResourceService,
    fakeAppFeatureAnalytics: AppFeatureAnalytics, patientService: PatientService,
    fixture, component, locationResourceService: LocationResourceService,
    patientIdentifierService: PatientIdentifierService,
    patientIdentifierTypeResService: PatientIdentifierTypeResService,
    patientResourceService: PatientResourceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CacheModule
      ],
      providers: [
        MockBackend,
        BaseRequestOptions,
        FakeAppFeatureAnalytics,
        LocationResourceService,
        PatientIdentifierTypeResService,
        DataCacheService,
        CacheService,
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
          provide: PatientService
        },
        AppSettingsService,
        LocalStorageService
      ]
    });
    patientService = TestBed.get(PatientService);
    locationResourceService = TestBed.get(LocationResourceService);
    personResourceService = TestBed.get(PersonResourceService);
    fakeAppFeatureAnalytics = TestBed.get(AppFeatureAnalytics);
    component = new EditPatientIdentifierComponent(patientService, locationResourceService,
      patientIdentifierService, patientIdentifierTypeResService, patientResourceService);
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
    expect(component.patientIdentifier).toBe('');
    expect(component.identifierLocation).toBe('');
    expect(component.preferredIdentifier).toBe('');
    expect(component.patientIdentifierUuid).toBe('');

    done();

  });
  it('should have all the required functions defined and callable', (done) => {
    spyOn(component, 'getPatient').and.callFake((err, data) => {
    });
    component.getPatient((err, data) => {
    });
    spyOn(component, 'checkIdentifierFormat').and.callFake((err, data) => {

    });
    component.checkIdentifierFormat((err, data) => {
    });
    expect(component.checkIdentifierFormat).toHaveBeenCalled();


    done();

  });
  it('should fetch location correctly', (done) => {
    spyOn(locationResourceService, 'getLocations')
      .and.callFake((param) => {
        return {
          uuid: 'location-uuid',
          display: 'location'
        };
      });
    done();

  });

});

