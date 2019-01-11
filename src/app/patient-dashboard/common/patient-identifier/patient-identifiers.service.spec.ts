/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { PatientIdentifierService } from './patient-identifiers.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { LocationResourceService } from '../../../openmrs-api/location-resource.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { DataCacheService } from '../../../shared/services/data-cache.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: PatientIdentifierService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ CacheModule, HttpClientTestingModule ],
      providers: [
        PatientIdentifierService,
        PatientResourceService,
        LocationResourceService,
        LocalStorageService,
        AppSettingsService,
        DataCacheService,
        CacheService,
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    const service: PatientIdentifierService = TestBed.get(PatientIdentifierService);
    expect(service).toBeTruthy();
  });
  it('should return the correct common identifiers', () => {
    const service: PatientIdentifierService = TestBed.get(PatientIdentifierService);
    const commonIdentifiers = service.commonIdentifierTypes();
    expect(commonIdentifiers[0]).toBe('KENYAN NATIONAL ID NUMBER');
    expect(commonIdentifiers[1]).toBe('AMRS Medical Record Number');
    expect(commonIdentifiers[2]).toBe('AMRS Universal ID');
    expect(commonIdentifiers[3]).toBe('CCC Number');
  });
  it('should return the correct getLuhnCheckDigit', () => {
    const service: PatientIdentifierService = TestBed.get(PatientIdentifierService);
    const checkDigit = service.getLuhnCheckDigit('number');
  });
});

