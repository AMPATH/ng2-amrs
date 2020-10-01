import { TestBed, async, inject } from '@angular/core/testing';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { LabOrderResourceService } from './lab-order-resource.service';
import {
  HttpTestingController,
  HttpClientTestingModule
} from '@angular/common/http/testing';

describe('Lab Order Resource Service Unit Tests', () => {
  let httpMock, service;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        LabOrderResourceService,
        AppSettingsService,
        LocalStorageService
      ]
    });
    service = TestBed.get(LabOrderResourceService);
    httpMock = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies', inject(
    [LabOrderResourceService],
    (labOrderResourceService: LabOrderResourceService) => {
      expect(labOrderResourceService).toBeTruthy();
    }
  ));

  it('should make a call with the correct parameters', () => {
    const location = 'ampath';
    const payload = {
      test: 'test'
    };
    const expectedResults = { result: { locationUuid: '1234' } };

    service.postOrderToEid(location, payload).subscribe((result) => {
      expect(result).toBeDefined();
      expect(result).toEqual(expectedResults);
    });

    const appSettingsService = TestBed.get(AppSettingsService);
    const req = httpMock.expectOne(
      appSettingsService.getEtlRestbaseurl().trim() + 'eid/order/ampath'
    );
    expect(req.request.url).toContain('eid/order');
    expect(req.request.method).toBe('POST');
    req.flush(expectedResults);
  });
});
