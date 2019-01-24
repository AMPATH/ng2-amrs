
import { TestBed, async, inject } from '@angular/core/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { MedicationHistoryResourceService } from './medication-history-resource.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('Medication Resource Service Unit Tests', () => {

  // tslint:disable-next-line:prefer-const
  let patientUuid = 'de662c03-b9af-4f00-b10e-2bda0440b03b';
  const report = 'medical-history-report';
  let service, httpMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        MedicationHistoryResourceService,
        AppSettingsService,
        LocalStorageService
      ]
    });
    service = TestBed.get(MedicationHistoryResourceService);
    httpMock = TestBed.get(HttpTestingController);

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([MedicationHistoryResourceService],
      (medicationHistoryResourceService: MedicationHistoryResourceService) => {
        expect(medicationHistoryResourceService).toBeTruthy();
      }));

  it('should make API call with the correct url parameters', () => {
    const params = {
      report: 'medical-history-report',
      patientUuId: 'uuid'
    };
    service.getReport(report, patientUuid).subscribe((data) => { },
      (error: Error) => {
        expect(error).toBeTruthy();

      });
    const appSettingsService = TestBed.get(AppSettingsService);
    const req = httpMock.expectOne(appSettingsService.getEtlServer() + '/patient/'
      + patientUuid + '/medical-history-report');
    expect(req.request.url).toMatch('');
    expect(req.request.method).toBe('GET');
    expect(req.request.url).toContain(params.report);
  });

  it('should return the correct parameters from the api',
    async(() => {
      const appSettingsService = TestBed.get(AppSettingsService);
      service.getReport(report, patientUuid).subscribe((data) => { },
        (error: Error) => {
          expect(error).toBeTruthy();

        });
      const req = httpMock.expectOne(appSettingsService.getEtlServer() + '/patient/'
        + patientUuid + '/medical-history-report');
      req.flush({ type: Error, status: 404, statusText: 'An error occured while processing the request' });
    }));

});
