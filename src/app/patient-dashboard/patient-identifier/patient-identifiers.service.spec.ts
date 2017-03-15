/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs/Rx';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import { PatientIdentifierService } from './patient-identifiers.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import { LocationResourceService } from '../../openmrs-api/location-resource.service';
import { LocalStorageService } from '../../utils/local-storage.service';
describe('Service: PatientIdentifierService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientIdentifierService,
        PatientResourceService,
        LocationResourceService,
        LocalStorageService,
        MockBackend,
        BaseRequestOptions,
        AppSettingsService,

        {
          provide: Http,
          useFactory: (backendInstance: MockBackend,
                       defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    let service: PatientIdentifierService = TestBed.get(PatientIdentifierService);
    expect(service).toBeTruthy();
  });
  it('should return the correct common identifiers', () => {
    let service: PatientIdentifierService = TestBed.get(PatientIdentifierService);
    let commonIdentifiers = service.commonIdentifierTypes();
    expect(commonIdentifiers[0]).toBe('KENYAN NATIONAL ID NUMBER');
    expect(commonIdentifiers[1]).toBe('AMRS Medical Record Number');
    expect(commonIdentifiers[2]).toBe('AMRS Universal ID');
    expect(commonIdentifiers[3]).toBe('CCC Number');
  });
  it('should return the correct getLuhnCheckDigit', () => {
    let service: PatientIdentifierService = TestBed.get(PatientIdentifierService);
    let checkDigit = service.getLuhnCheckDigit('number');
  });



});

