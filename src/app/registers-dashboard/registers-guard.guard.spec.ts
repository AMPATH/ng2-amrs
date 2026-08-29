import { TestBed, async, inject } from '@angular/core/testing';

import { RegistersDashboardGuard } from './registers-guard.guard';

describe('RegistersDashboardGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegistersDashboardGuard]
    });
  });

  it('should ...', inject(
    [RegistersDashboardGuard],
    (guard: RegistersDashboardGuard) => {
      expect(guard).toBeTruthy();
    }
  ));
});
