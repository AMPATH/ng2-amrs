import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { LocalStorageService } from '../utils/local-storage.service';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { HivSummaryResourceService } from './hiv-summary-resource.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';


describe('HivSummaryService Unit Tests', () => {
  let httpMock: HttpTestingController;
  let service: HivSummaryResourceService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [],
      providers: [
        LocalStorageService,
        AppSettingsService,
        HivSummaryResourceService
      ],
    });

    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(HivSummaryResourceService);
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([HivSummaryResourceService], (hivSummaryResourceService: HivSummaryResourceService) =>
      expect(hivSummaryResourceService).toBeTruthy()));

  it('should make API call with the correct url parameters', () => {

    const patientUuid = '5b82f9da-1359-11df-a1f1-0026b9348838';
    const startIndex = 0;
    const limit = 20;
    const appSettingsService = TestBed.get(AppSettingsService);

    service.getHivSummary(patientUuid, startIndex, limit)
      .subscribe((data) => {
        expect(data).toBeTruthy();
        expect(data.length).toBeGreaterThan(0);
      });

  });

  it('should return a list of Hiv summary record', () => {

    const patientUuid = '5b82f9da-1359-11df-a1f1-0026b9348838';
    const startIndex = 0;
    const limit = 20;

    service.getHivSummary(patientUuid, startIndex, limit)
      .subscribe((data) => {
        expect(data).toBeTruthy();
        expect(data.length).toBeGreaterThan(0);
      });
  });

  it('should throw an error when server returns an error response', () => {

    const patientUuid = '5b82f9da-1359-11df-a1f1-0026b9348838';
    const startIndex = 0;
    const limit = 20;

    service.getHivSummary(patientUuid, startIndex, limit)
      .subscribe((response) => {
        expect(response).toBeUndefined();
      },
        (error: Error) => {
          expect(error).toBeTruthy();
        });
  });

});
