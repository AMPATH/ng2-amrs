import { TestBed, inject } from '@angular/core/testing';

import { PmtctCalhivRriReportService } from './pmtct-calhiv-rri-report.service';

describe('PmtctCalhivRriReportService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PmtctCalhivRriReportService]
    });
  });

  it('should be created', inject(
    [PmtctCalhivRriReportService],
    (service: PmtctCalhivRriReportService) => {
      expect(service).toBeTruthy();
    }
  ));
});
