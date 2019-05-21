import { TestBed, inject } from '@angular/core/testing';

import { OncologyReportPdfService } from './oncology-report-pdf.service';

describe('OncologyReportPdfService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OncologyReportPdfService]
    });
  });

  it('should be created', inject([OncologyReportPdfService], (service: OncologyReportPdfService) => {
    expect(service).toBeTruthy();
  }));
});
