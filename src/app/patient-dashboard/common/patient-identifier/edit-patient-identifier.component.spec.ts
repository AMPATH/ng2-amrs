// tslint:disable:prefer-const
import { TestBed, inject, async } from '@angular/core/testing';

import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';
import { FakeAppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytcis.mock';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
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
import { UserService } from '../../../openmrs-api/user.service';
import {
  PatientCreationResourceService
} from '../../../openmrs-api/patient-creation-resource.service';
import { DataCacheService } from '../../../shared/services/data-cache.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';

class FakeCacheStorageService {
  constructor(a, b) { }

  public ready() {
    return true;
  }

}
describe('Component: EditPatientIdentifierComponent Unit Tests', () => {

  let personResourceService: PersonResourceService,
    fakeAppFeatureAnalytics: AppFeatureAnalytics, patientService: PatientService,
    fixture, component, locationResourceService: LocationResourceService,
    patientIdentifierService: PatientIdentifierService,
    patientIdentifierTypeResService: PatientIdentifierTypeResService,
    patientResourceService: PatientResourceService,
    patientCreationResourceService: PatientCreationResourceService,
    userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CacheModule,
        HttpClientTestingModule
      ],
      providers: [
        FakeAppFeatureAnalytics,
        LocationResourceService,
        PatientIdentifierTypeResService,
        DataCacheService,
        CacheService,
        {
          provide: CacheStorageService, useFactory: () => {
            return new FakeCacheStorageService(null, null);
          },
          deps: []
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
      patientIdentifierService, patientIdentifierTypeResService, patientResourceService,
      patientCreationResourceService, userService);
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
