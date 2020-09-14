import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { LocalStorageService } from '../utils/local-storage.service';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { HivPatientClinicalSummaryResourceService } from './hiv-patient-clinical-summary-resource.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';

describe('HivPatientClinicalSummaryResourceService Unit Tests', () => {
  let httpMock: HttpTestingController;
  let service;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [],
      providers: [
        LocalStorageService,
        AppSettingsService,
        DataCacheService,
        HivPatientClinicalSummaryResourceService
      ]
    });
    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(HivPatientClinicalSummaryResourceService);
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be defined', () => {
    httpMock.expectNone('');
    expect(service).toBeDefined();
  });

  it('should make API call with the correct url parameters', () => {
    const appSettingsService = TestBed.get(AppSettingsService);
    const patientUuid = '5b82f9da-1359-11df-a1f1-0026b9348838';
    service.fetchPatientSummary(patientUuid).subscribe({});

    const req = httpMock.expectOne(
      appSettingsService.getEtlServer() +
        '/patient/' +
        patientUuid +
        '/hiv-patient-clinical-summary?startIndex=0&limit=10'
    );
    expect(req.request.urlWithParams).toContain('startIndex=');
    expect(req.request.urlWithParams).toContain('limit=');
    expect(req.request.method).toBe('GET');
    req.flush('');
  });

  it('should return correct success body response with correct result', (done) => {
    const appSettingsService = TestBed.get(AppSettingsService);
    const res = {
      patientUuid: '5b82f9da-1359-11df-a1f1-0026b9348838',
      notes: [],
      vitals: [],
      hivSummaries: [],
      reminders: [],
      labDataSummary: []
    };

    const patientUuid = '5b82f9da-1359-11df-a1f1-0026b9348838';
    service.fetchPatientSummary(patientUuid).subscribe((data) => {
      expect(data).toBeTruthy();
      expect(data.patientUuid).toBeDefined();
      expect(data.notes).toBeDefined();
      expect(data.vitals).toBeDefined();
      expect(data.hivSummaries).toBeDefined();
      expect(data.reminders).toBeDefined();
      expect(data.labDataSummary).toBeDefined();
      done();
    });

    const req = httpMock.expectOne(
      appSettingsService.getEtlServer() +
        '/patient/' +
        patientUuid +
        '/hiv-patient-clinical-summary?startIndex=0&limit=10'
    );
    expect(req.request.method).toBe('GET');
    req.flush(res);
  });

  it('should throw an error when server returns an error response', (done) => {
    const appSettingsService = TestBed.get(AppSettingsService);

    const patientUuid = '5b82f9da-1359-11df-a1f1-0026b9348838';
    service.fetchPatientSummary(patientUuid).subscribe(
      (response) => {
        done();
      },
      (error: Error) => {
        expect(error).toBeDefined();
        done();
      }
    );

    const req = httpMock.expectOne(
      appSettingsService.getEtlServer() +
        '/patient/' +
        patientUuid +
        '/hiv-patient-clinical-summary?startIndex=0&limit=10'
    );
    expect(req.request.method).toBe('GET');
    req.flush({
      type: Error,
      message: 'An error occured while processing the request'
    });
  });
});
