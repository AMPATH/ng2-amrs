import { TestBed, async, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { VitalsResourceService } from './vitals-resource.service';

describe('Service: VitalResourceService', () => {
  let expectedResult;
  let httpMock: HttpTestingController;
  let service: VitalsResourceService;
  const startIndex = 0;
  const limit = 2;
  const patientUuid = '1101b7e4-0141-4316-8356-d89fd6b2c766';
  let url = `https://ngx.ampath.or.ke/etl-latest/etl/patient/1101b7e4-0141-4316-8356-d89fd6b2c766/vitals`;
  // add URL params
  url += `?startIndex=${startIndex}`;
  url += `&limit=${limit}`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        VitalsResourceService,
        AppSettingsService,
        LocalStorageService
      ]
    });

    service = TestBed.get(VitalsResourceService);
    httpMock = TestBed.get(HttpTestingController);

    expectedResult = [
      {
        diastolic_bp: 110,
        oxygen_sat: null,
        pulse: 96,
        systolic_bp: 180,
        temp: null,
        person_id: 873430,
        uuid: '1101b7e4-0141-4316-8356-d89fd6b2c766',
        height: 100,
        weight: 7,
        encounter_datetime: '2018-11-22',
        encounter_id: 8167030,
        location_id: 197
      },
      {
        diastolic_bp: null,
        oxygen_sat: null,
        pulse: null,
        systolic_bp: null,
        temp: null,
        person_id: 873430,
        uuid: '1101b7e4-0141-4316-8356-d89fd6b2c766',
        height: 55,
        weight: 10,
        encounter_datetime: '2019-01-01',
        encounter_id: 900002,
        location_id: 2
      }
    ];

  });

  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies',
    inject([VitalsResourceService], (vitalsResourceService: VitalsResourceService) => {
      expect(vitalsResourceService).toBeTruthy();
    })
  );

  it('should get the API url', () => {
    // tslint:disable-next-line:no-shadowed-variable
    const url = service.getUrl();
    expect(url).toContain('patient');
  });

  it('should make API call with the correct URL parameters', () => {
    service.getVitals(patientUuid, startIndex, limit).subscribe();

    const request = httpMock.expectOne(url);
    expect(request.request.method).toBe('GET');
    expect(request.request.url).toContain(patientUuid);
    expect(request.request.params.get('limit')).toEqual(limit.toString());
    expect(request.request.params.get('startIndex')).toEqual(startIndex.toString());
    request.flush(expectedResult);
  });

  it('should return the correct parameters from the API', () => {
    service.getVitals(patientUuid, 0, 2).subscribe();

    const request = httpMock.expectOne(url);
    expect(request.request.method).toBe('GET');
    expect(request.request.url).toContain(patientUuid);
    expect(request.request.params.get('limit')).toEqual('2');
    expect(request.request.params.get('startIndex')).toEqual('0');
    request.flush(expectedResult);
  });
});
