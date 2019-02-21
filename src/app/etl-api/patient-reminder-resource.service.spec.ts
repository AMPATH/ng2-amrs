import { TestBed, async, inject } from '@angular/core/testing';
import { DatePipe } from '@angular/common';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { PatientReminderResourceService } from './patient-reminder-resource.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('Patient Reminder Resource Service Unit Tests', () => {
  let service, httpMok;
  // tslint:disable-next-line:prefer-const
  let patientUuid = '79803198-2d23-49cd-a7b3-4f672bd8f659';
  const datePipe = new DatePipe('en-US');
  const referenceDate: any = datePipe.transform(new Date(), 'yyyy-MM-dd');
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PatientReminderResourceService,
        AppSettingsService,
        LocalStorageService
      ]
    });
    service = TestBed.get(PatientReminderResourceService);
    httpMok = TestBed.get(HttpTestingController);

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([PatientReminderResourceService],
      (patientReminderResourceService: PatientReminderResourceService) => {
        expect(patientReminderResourceService).toBeTruthy();
      }));

  it('should make API call with the correct url parameters', (done) => {
    service.getPatientLevelReminders(patientUuid)
      .subscribe((response) => {
        done();
      });

    const req = httpMok.expectOne(service.getUrl(patientUuid) + '/' + service.referenceDate);
    expect(req.request.method).toBe('GET');
    expect(req.request.url)
      .toContain(
        'etl/patient/79803198-2d23-49cd-a7b3-4f672bd8f659/hiv-clinical-reminder/' + referenceDate
      );
    req.flush(JSON.stringify({}));

  });
  it('should return an error the api throws an error',
    async(() => {
      service.getPatientLevelReminders(patientUuid)
        .subscribe((data) => {
        },
          (error: Error) => {
            expect(error).toBeTruthy();
          });

      const req = httpMok.expectNone('');
    }));

});
