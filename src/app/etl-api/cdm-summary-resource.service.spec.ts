import { TestBed, async, inject, fakeAsync } from '@angular/core/testing';
import { LocalStorageService } from '../utils/local-storage.service';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { CdmSummaryResourceService } from './cdm-summary-resource.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CdmModule } from '../clinic-dashboard/cdm/cdm-program.module';

describe('CdmSummaryService Unit Tests', () => {


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LocalStorageService,
        CdmModule,
        AppSettingsService,
        CdmSummaryResourceService
      ],
    });
  }));


  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([CdmSummaryResourceService], (cdmSummaryResourceService: CdmSummaryResourceService) =>
      expect(cdmSummaryResourceService).toBeTruthy()));

  it('should return a list of Cdm summary record', () => {
    const cdmSummaryResourceService: CdmSummaryResourceService = TestBed
      .get(CdmSummaryResourceService);

    const patientUuid = '5b82f9da-1359-11df-a1f1-0026b9348838';
    const startIndex = 0;
    const limit = 20;

    cdmSummaryResourceService.getCdmSummary(patientUuid, startIndex, limit)
      .subscribe((data) => {
        expect(data).toBeTruthy();
        expect(data.length).toBeGreaterThan(0);
      });
  });

  it('should throw an error when server returns an error response', () => {

    const cdmSummaryResourceService: CdmSummaryResourceService = TestBed
      .get(CdmSummaryResourceService);

    const patientUuid = '5b82f9da-1359-11df-a1f1-0026b9348838';
    const startIndex = 0;
    const limit = 20;


    cdmSummaryResourceService.getCdmSummary(patientUuid, startIndex, limit)
      .subscribe((response) => {
      },
        (error: Error) => {
          expect(error).toBeTruthy();
        });
  });

});
