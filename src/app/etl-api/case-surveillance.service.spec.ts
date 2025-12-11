import { TestBed, inject } from '@angular/core/testing';

import { CaseSurveillanceService } from './case-surveillance.service';

describe('CaseSurveillanceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CaseSurveillanceService]
    });
  });

  it('should be created', inject(
    [CaseSurveillanceService],
    (service: CaseSurveillanceService) => {
      expect(service).toBeTruthy();
    }
  ));
});
