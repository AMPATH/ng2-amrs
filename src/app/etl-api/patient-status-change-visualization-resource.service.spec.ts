import { TestBed, async, inject } from '@angular/core/testing';
import { AppSettingsService } from '../app-settings/app-settings.service';
import {
  PatientStatusVisualizationResourceService
} from './patient-status-change-visualization-resource.service';
import { CacheModule, CacheService } from 'ionic-cache';
import { DataCacheService } from '../shared/services/data-cache.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { CacheStorageService } from 'ionic-cache/dist/cache-storage';
class MockAppSettingsService {
  constructor() {
  }

  getEtlServer(): string {
    return 'https://etl.ampath.or.ke/etl';
  }

}

class MockCacheStorageService {
  constructor(a, b) { }

  public ready() {
    return true;
  }
}

describe('PatientStatusVisualizationResourceService', () => {
  let service, httpMock;
  const results = {
    startIndex: 0,
    size: 13,
    result: [
      {
        'reporting_date': '2016-01-29T21:00:00.000Z',
        'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
        'location_id': 13,
        'reporting_month': '01/2016',
        'total_patients': 107,
        'active_patients': 94,
        'new_patients': 5,
        'transfer_in': 2,
        'ltfu_to_active': 0,
        'transfer_out': -1,
        'death': -2,
        'active_to_ltfu': -10,
        'gained': 7,
        'lost': 13,
        'change': -6
      },
      {
        'reporting_date': '2016-02-30T21:00:00.000Z',
        'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
        'location_id': 13,
        'reporting_month': '02/2016',
        'total_patients': 110,
        'active_patients': 89,
        'new_patients': 2,
        'transfer_in': 1,
        'ltfu_to_active': 3,
        'transfer_out': -1,
        'death': -1,
        'active_to_ltfu': -9,
        'gained': 6,
        'lost': 11,
        'change': -5
      },
      {
        'reporting_date': '2016-06-29T21:00:00.000Z',
        'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
        'location_id': 13,
        'reporting_month': '03/2016',
        'total_patients': 113,
        'active_patients': 89,
        'new_patients': 0,
        'transfer_in': 3,
        'ltfu_to_active': 9,
        'transfer_out': -3,
        'death': -3,
        'active_to_ltfu': -6,
        'gained': 12,
        'lost': 12,
        'change': 0
      },
      {
        'reporting_date': '2016-07-30T21:00:00.000Z',
        'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
        'location_id': 13,
        'reporting_month': '04/2016',
        'total_patients': 119,
        'active_patients': 83,
        'new_patients': 2,
        'transfer_in': 4,
        'ltfu_to_active': 8,
        'transfer_out': -10,
        'death': -2,
        'active_to_ltfu': -8,
        'gained': 14,
        'lost': 20,
        'change': -6
      },
      {
        'reporting_date': '2016-05-30T21:00:00.000Z',
        'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
        'location_id': 13,
        'reporting_month': '05/2016',
        'total_patients': 130,
        'active_patients': 86,
        'new_patients': 2,
        'transfer_in': 9,
        'ltfu_to_active': 5,
        'transfer_out': -7,
        'death': -1,
        'active_to_ltfu': -5,
        'gained': 16,
        'lost': 13,
        'change': 3
      },
      {
        'reporting_date': '2016-06-29T21:00:00.000Z',
        'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
        'location_id': 13,
        'reporting_month': '06/2016',
        'total_patients': 139,
        'active_patients': 89,
        'new_patients': 1,
        'transfer_in': 8,
        'ltfu_to_active': 4,
        'transfer_out': -6,
        'death': 0,
        'active_to_ltfu': -4,
        'gained': 13,
        'lost': 10,
        'change': 3
      },
      {
        'reporting_date': '2016-07-30T21:00:00.000Z',
        'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
        'location_id': 13,
        'reporting_month': '07/2016',
        'total_patients': 159,
        'active_patients': 144,
        'new_patients': 10,
        'transfer_in': 10,
        'ltfu_to_active': 8,
        'transfer_out': -2,
        'death': 0,
        'active_to_ltfu': -1,
        'gained': 28,
        'lost': 3,
        'change': 25
      },
      {
        'reporting_date': '2016-08-29T21:00:00.000Z',
        'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
        'location_id': 13,
        'total_patients': 175,
        'reporting_month': '08/2016',
        'active_patients': 127,
        'new_patients': 8,
        'transfer_in': 8,
        'ltfu_to_active': 2,
        'transfer_out': -5,
        'death': 0,
        'active_to_ltfu': 0,
        'gained': 18,
        'lost': 5,
        'change': 13
      },
      {
        'reporting_date': '2016-09-30T21:00:00.000Z',
        'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
        'location_id': 13,
        'reporting_month': '09/2016',
        'total_patients': 185,
        'active_patients': 132,
        'new_patients': 8,
        'transfer_in': 2,
        'ltfu_to_active': 6,
        'transfer_out': -6,
        'death': -2,
        'active_to_ltfu': -3,
        'gained': 16,
        'lost': 11,
        'change': 5
      },
      {
        'reporting_date': '2016-10-30T21:00:00.000Z',
        'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
        'location_id': 13,
        'reporting_month': '10/2016',
        'total_patients': 196,
        'active_patients': 128,
        'new_patients': 7,
        'transfer_in': 4,
        'ltfu_to_active': 0,
        'transfer_out': -7,
        'death': -2,
        'active_to_ltfu': -6,
        'gained': 11,
        'lost': 15,
        'change': -4
      },
      {
        'reporting_date': '2016-11-27T21:00:00.000Z',
        'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
        'location_id': 13,
        'reporting_month': '11/2016',
        'total_patients': 206,
        'active_patients': 125,
        'new_patients': 7,
        'transfer_in': 3,
        'ltfu_to_active': 2,
        'transfer_out': -3,
        'death': -3,
        'active_to_ltfu': -9,
        'gained': 12,
        'lost': 15,
        'change': -3
      },
      {
        'reporting_date': '2016-12-30T21:00:00.000Z',
        'location_uuid': '08fec056-1352-11df-a1f1-0026b9348838',
        'location_id': 13,
        'reporting_month': '12/2016',
        'total_patients': 210,
        'active_patients': 117,
        'new_patients': 3,
        'transfer_in': 1,
        'ltfu_to_active': 7,
        'transfer_out': -10,
        'death': -2,
        'active_to_ltfu': -7,
        'gained': 11,
        'lost': 19,
        'change': -8
      }

    ]
  };

  const patientList = {
    startIndex: 0,
    size: 3,
    result: [
      {
        person_id: 2050,
        patient_uuid: 'patient-uuid',
        vl_1_date: '2015-06-25T21:00:00.000Z',
        vl_1: 638,
        person_name: 'David Dvi Kurga',
        identifiers: 'identifier-1, identifier-1',
        gender: 'M',
        age: 49
      }
    ]
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CacheModule, HttpClientTestingModule],
      providers: [
        PatientStatusVisualizationResourceService,
        CacheService,
        DataCacheService,
        {
          provide: AppSettingsService,
          useClass: MockAppSettingsService
        },
        {
          provide: CacheStorageService, useFactory: () => {
            return new MockCacheStorageService(null, null);
          }
        },
      ]
    });
    service = TestBed.get(PatientStatusVisualizationResourceService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should return patient monthly status aggregate values when getAggregates() is called', () => {
    service.getAggregates({
      startDate: '2016-01-01',
      endDate: '2016-12-31',
      locationUuids: 'uuid',
      analysis: 'cumulativeAnalysis'
    }).subscribe((response) => {
      expect(response.result).toBeTruthy();
      expect(response.result[0].total_patients).toBe(107);
    });
  });

  it('should return patient list for monthly ' +
    'status change values when getPatientList() is called', () => {
      service.getPatientList({
        startDate: '2016-01-01',
        endDate: '2016-12-31', locationUuids: 'uuid',
        indicator: 'test',
        analysis: 'cumulativeAnalysis'
      }).subscribe((response) => {
        expect(response.result).toBeTruthy();
      });
    });
});
