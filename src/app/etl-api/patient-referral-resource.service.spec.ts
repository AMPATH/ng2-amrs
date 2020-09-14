import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { of } from 'rxjs';

import { CacheModule, CacheService } from 'ionic-cache';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { DataCacheService } from '../shared/services/data-cache.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { PatientReferralResourceService } from './patient-referral-resource.service';

const basePath = 'api-base-path/';

class MockCacheStorageService {
  constructor(a, b) {}

  ready() {
    return true;
  }
}

class MockAppSettingsService {
  getEtlRestbaseurl() {
    return basePath;
  }
}

const mockReportParams = {
  startIndex: undefined,
  startDate: '2017-03-01',
  locationUuids: '08fec056-1352-11df-a1f1-0026b9348838',
  programUuid: 'program-uuid',
  limit: undefined,
  endDate: '2017-04-27',
  gender: 'M,F',
  stateUuids: 'stateUuids-uuid',
  startAge: 0,
  endAge: 110
};

describe('PatientReferralResourceService', () => {
  let cacheService: DataCacheService;
  let patientReferralResourceService: PatientReferralResourceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacheModule, HttpClientTestingModule],
      providers: [
        CacheService,
        DataCacheService,
        LocalStorageService,
        PatientReferralResourceService,
        {
          provide: AppSettingsService,
          useClass: MockAppSettingsService
        },
        {
          provide: CacheStorageService,
          useFactory: () => {
            return new MockCacheStorageService(null, null);
          }
        }
      ]
    });

    cacheService = TestBed.get(DataCacheService);
    patientReferralResourceService = TestBed.get(
      PatientReferralResourceService
    );
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('fetches and returns referral report data', () => {
    const expectedReferralReport = {
      startIndex: 0,
      size: 1,
      result: [
        {
          location: 'location name',
          location_uuid: 'location-uuid',
          program_uuid: 'program_uuid',
          location_id: 13,
          encounter_datetime: '2017-04-26T05:48:32.000Z',
          received_back: 89
        }
      ],
      indicatorDefinitions: [{}]
    };

    const dataCacheServiceSpy: jasmine.Spy = spyOn(
      cacheService,
      'cacheSingleRequest'
    ).and.callFake(() => of(expectedReferralReport));

    patientReferralResourceService
      .getPatientReferralReport(mockReportParams)
      .subscribe(
        (referralReport) =>
          expect(referralReport).toEqual(
            expectedReferralReport,
            'returns the referral report'
          ),
        fail
      );

    expect(dataCacheServiceSpy).toHaveBeenCalledTimes(1);
  });

  it('fetches and returns referral patient list data', () => {
    const expectedReferralPatientList = {
      startIndex: 0,
      size: 1,
      result: [
        {
          person_id: 1817,
          encounter_id: 6774060,
          location_id: 13,
          location_uuid: '08fec056-1352-11df-a1f1-0026b9348838',
          patient_uuid: '5b737014-1359-11df-a1f1-0026b9348838',
          gender: 'F',
          birthdate: '1982-12-11T21:00:00.000Z',
          age: 34
        }
      ]
    };

    const dataCacheServiceSpy = spyOn(
      cacheService,
      'cacheSingleRequest'
    ).and.callFake(() => of(expectedReferralPatientList));

    patientReferralResourceService
      .getPatientReferralPatientList(mockReportParams)
      .subscribe(
        (referralPatientList) =>
          expect(referralPatientList).toEqual(
            expectedReferralPatientList,
            'returns referral patient list data'
          ),
        fail
      );

    expect(dataCacheServiceSpy).toHaveBeenCalledTimes(1);
  });

  it('fetches and returns referral data given the referral location uuid and/or the enrollment uuid', () => {
    const expectedReferralData = {
      startIndex: 0,
      size: 1,
      result: [
        {
          encounter_uuid: 'test-encounter-uuid',
          notification_status: null,
          patient_program_id: 89,
          patient_program_uuid: 'test-patient-program-uuid',
          patient_referral_id: 6789,
          provider_id: 123,
          referred_from_location: 'location A',
          referred_from_location_id: 1,
          referred_from_location_uuid: 'location-a-uuid',
          referred_to_location: 'location B',
          referred_to_location_id: 2,
          referred_to_location_uuid: 'location-b-uuid',
          voided: 0
        }
      ],
      indicatorDefinitions: [{}]
    };

    const testPayload = {
      locationUuid: 'test-location-uuid',
      enrollmentUuid: 'test-enrollment-uuid'
    };

    patientReferralResourceService
      .getReferralByLocationUuid(
        testPayload.locationUuid,
        testPayload.enrollmentUuid
      )
      .subscribe(
        (referralData) =>
          expect(referralData).toEqual(
            expectedReferralData,
            'returns referral data'
          ),
        fail
      );

    const req = httpMock.expectOne(
      (r) =>
        r.method === 'GET' &&
        r.url ===
          `${basePath}patient-referral-details/test-location-uuid/test-enrollment-uuid`
    );
    expect(req.request.method).toEqual('GET');
    req.flush(expectedReferralData);
  });

  it('updates the status of a pending referral upon successful completion', () => {
    const expectedReferralData = {
      encounter_id: 1234567,
      notification_status: '1',
      patient_program_id: 89,
      patient_referral_id: 6789,
      provider_id: 123,
      referral_reason: 'Test referral',
      referred_from_location_id: 1,
      referred_to_location_id: 2,
      voided: 0
    };

    const testPayload = {
      notificationStatus: 1,
      patient_referral_id: 123
    };

    patientReferralResourceService
      .updateReferralNotificationStatus(testPayload)
      .subscribe(
        (referralData) =>
          expect(referralData).toEqual(
            expectedReferralData,
            'returns updated referral data'
          ),
        fail
      );

    const req = httpMock.expectOne(`${basePath}patient-referral/123`);
    expect(req.request.method).toEqual('POST');
    req.flush(expectedReferralData);
  });
});
