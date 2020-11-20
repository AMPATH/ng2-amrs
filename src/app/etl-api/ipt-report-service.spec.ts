import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';
import { async, TestBed, inject } from '@angular/core/testing';

import { IptReportService } from './ipt-report.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';

describe('IptReportService Unit Test', () => {
  let httpMock: HttpTestingController;
  let service: IptReportService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [],
      providers: [AppSettingsService, LocalStorageService, IptReportService]
    });

    httpMock = TestBed.get(HttpTestingController);
    service = TestBed.get(IptReportService);
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies', inject(
    [IptReportService],
    (iptReportService: IptReportService) => {
      expect(iptReportService).toBeTruthy();
    }
  ));

  it('should make API Call and return a list of IPT summary data', () => {
    service
      .getIptReportData({
        locationUuids: 'uuid1',
        endDate: new Date('2020-06-30')
      })
      .subscribe((data) => {
        expect(data).toBeTruthy();
        expect(data.result).toBeGreaterThan(0);
      });
    pending();
  });

  it('should throw an error when server returns an error response', () => {
    const params = { locationUuids: '', endDate: new Date() };
    service.getIptReportData(params).subscribe(
      (response) => {
        expect(response).toBeUndefined();
      },
      (error: Error) => {
        expect(error).toBeTruthy();
      }
    );
  });
});
