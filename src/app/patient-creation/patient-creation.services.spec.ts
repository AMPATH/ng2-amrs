/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';

import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { PatientCreationService } from './patient-creation.service';
import { PatientResourceService } from '../openmrs-api/patient-resource.service';
import { PatientCreationResourceService } from '../openmrs-api/patient-creation-resource.service';
import { Patient } from '../models/patient.model';
import { httpClient } from '../shared/ngamrs- .module';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: PatientCreation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PatientCreationService,
        PatientResourceService,
        AppSettingsService,
        LocalStorageService,
        PatientCreationResourceService
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    const service: PatientCreationService = TestBed.get(PatientCreationService);
    expect(service).toBeTruthy();
  });

  it('should have all functions defined', () => {
    const service: PatientCreationService = TestBed.get(PatientCreationService);
    expect(service.checkRegexValidity).toBeDefined();
    expect(service.commonIdentifierTypes).toBeDefined();
    expect(service.getLuhnCheckDigit).toBeDefined();
  });

  it('should search for patients by search text', () => {
    const service: PatientCreationService = TestBed.get(PatientCreationService);
    const result = service.searchPatient('text', false);

    result.subscribe((results) => {
      expect(results).toBeTruthy();
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].uuid).toEqual('uuid');
    });
  });
});
