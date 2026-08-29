import { TestBed, inject } from '@angular/core/testing';

import { RegistersDashboardCacheService } from './registers-dashboard-cache.service';
import { RegistersDashboardService } from './registers-dashboard.service';

describe('RegistersDashboardCacheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegistersDashboardCacheService]
    });
  });

  it('should be created', inject(
    [RegistersDashboardCacheService],
    (service: RegistersDashboardService) => {
      expect(service).toBeTruthy();
    }
  ));
});
