import { TestBed, async, inject } from '@angular/core/testing';
import { DatePipe } from '@angular/common';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { PatientProgramResourceService } from './patient-program-resource.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('Patient Program Resource Service Unit Tests', () => {
  let service, httpMock;
  const patientUuid = '79803198-2d23-49cd-a7b3-4f672bd8f659';
  const datePipe = new DatePipe('en-US');
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        PatientProgramResourceService,
        AppSettingsService,
        LocalStorageService
      ]
    });
    service = TestBed.get(PatientProgramResourceService);
    httpMock = TestBed.get(HttpTestingController);

  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([PatientProgramResourceService],
      (patientProgramResourceService: PatientProgramResourceService) => {
        expect(patientProgramResourceService).toBeTruthy();
      }));

  it('should make API call to get program enrollment visit types for a certain patient', (done) => {
    const appsetting = TestBed.get(AppSettingsService);
    service.getPatientProgramVisitTypes(patientUuid,
      'prog-uuid', 'enroll-uuid', 'location-uuid')
      .subscribe((response) => {
        expect(response).toEqual({ uuid: 'uuid' });
        done();
      });
    const req = httpMock.expectOne(appsetting.getEtlRestbaseurl().trim() +
      'patient/79803198-2d23-49cd-a7b3-4f672bd8f659' +
      '/program/prog-uuid/enrollment/enroll-uuid' +
      '?intendedLocationUuid=location-uuid');
    expect(req.request.method).toBe('GET');
    req.flush({ uuid: 'uuid' });

  });

  it('should make API call to get all program visit configs', (done) => {
    const appsetting =
      TestBed.get(AppSettingsService);
    service.getAllProgramVisitConfigs()
      .subscribe((response) => {
        done();
      });

    const req = httpMock.expectOne(appsetting.getEtlRestbaseurl().trim() +
      'program-visit-configs');
    expect(req.request.method).toBe('GET');
    req.flush(JSON.stringify({}));

  });
  it('should make API call to get patient program visit configs', (done) => {
    const appsetting =
      TestBed.get(AppSettingsService);
    service.getPatientProgramVisitConfigs('uuid')
      .subscribe((response) => {
        done();
      });
    const req = httpMock.expectOne(appsetting.getEtlRestbaseurl().trim() +
      'patient-program-config?patientUuid=uuid');
    expect(req.request.method).toBe('GET');
    req.flush(JSON.stringify({}));

  });
  it('should return an error when fetching all program configs fail',
    async(() => {
      service.getAllProgramVisitConfigs()
        .subscribe((data) => {
        },
          (error: Error) => {
            expect(error).toBeTruthy();
          });
      const req = httpMock.expectNone('');

    }));
});
