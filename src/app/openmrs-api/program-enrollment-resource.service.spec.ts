import { async, TestBed } from '@angular/core/testing';

import { LocalStorageService } from '../utils/local-storage.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { ProgramEnrollmentResourceService } from './program-enrollment-resource.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

xdescribe('Service: ProgramEnrollmentResourceService', () => {

  let service: ProgramEnrollmentResourceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProgramEnrollmentResourceService,
        AppSettingsService,
        LocalStorageService
      ],
      imports: [
        HttpClientTestingModule,
      ]
    });

    service = TestBed.get(ProgramEnrollmentResourceService);
    httpMock = TestBed.get(HttpTestingController);

  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  const programEnrollmentResponse = {
    results: [
      {
        'uuid': '927d9d1f-44ce-471e-a77b-d1f1342f43f6',
        'display': 'HIV Program',
        'name': 'HIV Program',
        'dateEnrolled': '2011-02-09T00:00:00.000+0300',
        'dateCompconsted': '2011-02-09T00:00:00.000+0300',
        'program': {
          'uuid': '922fc86d-ad42-4c50-98a6-b1f310863c07'
        }
      }]
  };

  const programEnrollmentStateResponse = {
    'uuid': 'bfede778-de9e-4551-b4f0-633c8a27ef28',
    'display': 'HIV Treatment',
    'states': [{
      'state': {
        'uuid': 'sddsdsfsdsff',
        'concept': { 'uuid': 'concept-uuid', 'display': 'concept-name' }
      }
    }]
  };

  const stateUpdateResponse = {
    'state': {
      'uuid': 'sddsdsfsdsff',
      'description': null,
      'retired': false,
      'concept': {
        'uuid': '9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
        'display': 'BLOOD SUGAR',
        'name': {
          'display': 'BLOOD SUGAR',
          'uuid': '9BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB',
          'name': 'BLOOD SUGAR',
          'locale': 'en',
          'localePreferred': true,
          'conceptNameType': 'FULLY_SPECIFIED'
        }
      }
    }
  };

  it('should be defined', async(() => {
    expect(service).toBeDefined();
  }));

  it('should return null when PatientUuid not specified', async(() => {

    httpMock.expectNone({});
    const result = service.getProgramEnrollmentByPatientUuid(null);

    expect(result).toBeNull();
  }));
  it('should call the right endpoint when fetching program enrollment', async(() => {
    const patientUuid = 'uuid';

    service.getProgramEnrollmentByPatientUuid(patientUuid).subscribe();

    const req = httpMock.expectOne('http://example.url.com/ws/rest/v1/programenrollment' +
      '?v=custom:(uuid,display,voided' +
      ',dateEnrolled,dateCompconsted,location,program:(uuid),states:(uuid,startDate,endDate,' +
      'state:(uuid,initial,terminal,concept:(uuid,display))))&patient=uuid');
    expect(req.request.urlWithParams).toContain('&patient=uuid');
    expect(req.request.method).toBe('GET');
    req.flush(JSON.stringify(programEnrollmentResponse));
  }));

  it('should return null when PatientUuid not specified', async(() => {

    httpMock.expectNone({});
    const result = service.getProgramEnrollmentStates(null);

    expect(result).toBeNull();
  }));

  it('should call the right endpoint when fetching program enrollment states', async(() => {
    const programEnrollmentUuid = 'program-enrollment-uuid';
    const serverUrl = 'http://example.url.com/';

    service.getProgramEnrollmentStates(programEnrollmentUuid).subscribe();

    const req = httpMock.expectOne(service.getUrl() + '/' + programEnrollmentUuid +
      '?v=custom:(uuid,display,states:(uuid,startDate,endDate,state:(uuid,concept:(uuid,display' +
      '))))');
    expect(req.request.method).toBe('GET');
    req.flush(JSON.stringify(programEnrollmentStateResponse));
  }));

  it('should return null when payload not specified', async(() => {

    httpMock.expectNone({});
    const result = service.saveUpdateProgramEnrollment(null);

    expect(result).toBeNull();
  }));

  it('should call the right endpoint when saving the patient enrollment state', async(() => {
    const programEnrollmentUuid = 'programenrollment-uuid';
    const payload = {
      'uuid': 'uuid-1', 'state': 'state-uuid',
      'startDate': '2011-02-06', 'endDate': '2011-02-08'
    };

    service.saveUpdateProgramEnrollment(payload).subscribe();

    const req = httpMock.expectOne(service.getUrl() + '/uuid-1');
    expect(req.request.method).toBe('POST');
    expect(req.request.url)
      .toBe('http://example.url.com/ws/rest/v1/programenrollment/uuid-1');
    req.flush(JSON.stringify(programEnrollmentResponse));
  }));

  it('should return null when payload and patientUuuid not specified', async(() => {

    httpMock.expectNone({});
    const result = service.updateProgramEnrollmentState(null, null);

    expect(result).toBeNull();
  }));
  it('should return null when payload uuid  not specified', async(() => {

    httpMock.expectNone({});
    let result;
    const payload = {
      'uuid': '', 'state': 'state-uuid',
      'startDate': '2011-02-06', 'endDate': '2011-02-08'
    };
    if (payload.uuid = '') {
      result = service.updateProgramEnrollmentState(null, payload);
    }
    expect(result).toBeUndefined();
  }));

  it('should call the right endpoint when updating the patient enrollment state', async(() => {
    const programEnrollmentUuid = 'programenrollment-uuid';
    const payload = {
      'uuid': 'uuid-1', 'state': 'state-uuid',
      'startDate': '2011-02-06', 'endDate': '2011-02-08'
    };

    service.updateProgramEnrollmentState(programEnrollmentUuid, payload).subscribe();

    const req = httpMock.expectOne(service.getUrl() + '/' + programEnrollmentUuid + '/' + 'state' + '/uuid-1');
    expect(req.request.method).toBe('POST');
    expect(req.request.url)
      .toBe('http://example.url.com/ws/rest/v1/programenrollment/programenrollment-uuid/state/uuid-1');
    req.flush(JSON.stringify(programEnrollmentResponse));
  }));



  it('should return null when params are not specified', async(() => {

    httpMock.expectNone({});
    const result = service.getProgramEnrollmentByPatientUuid(null);

    expect(result).toBeNull();
  }));
});





