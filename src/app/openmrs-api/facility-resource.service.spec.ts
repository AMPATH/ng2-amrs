import { TestBed, inject } from '@angular/core/testing';

import { FacilityResourceService } from './facility-resource.service';

describe('FacilityResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FacilityResourceService]
    });
  });

  it('should be created', inject(
    [FacilityResourceService],
    (service: FacilityResourceService) => {
      expect(service).toBeTruthy();
    }
  ));
});
