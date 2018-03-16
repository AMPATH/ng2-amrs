/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import {
    Http, Response, Headers, BaseRequestOptions, ResponseOptions,
    RequestMethod
  } from '@angular/http';
import { LocalStorageService } from '../../utils/local-storage.service';
import { AppSettingsService } from '../../app-settings';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { PatientCreationService } from './patient-creation.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import {
  PatientCreationResourceService
} from '../../openmrs-api/patient-creation-resource.service';
import { Patient } from '../../models/patient.model';

describe('Service: PatientCreation', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientCreationService,
        PatientResourceService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend, defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
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
    let service: PatientCreationService = TestBed.get(PatientCreationService);
    expect(service).toBeTruthy();
  });

  it('should have all functions defined', () => {
    let service: PatientCreationService = TestBed.get(PatientCreationService);
    expect(service.checkRegexValidity).toBeDefined();
    expect(service.commonIdentifierTypes).toBeDefined();
    expect(service.getLuhnCheckDigit).toBeDefined();
  });

  it('should search for patients by search text', () => {
    let service: PatientCreationService = TestBed.get(PatientCreationService);
    let result = service.searchPatient('text', false);

    result.subscribe((results) => {
      expect(results).toBeTruthy();
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].uuid).toEqual('uuid');
    });

  });

});
