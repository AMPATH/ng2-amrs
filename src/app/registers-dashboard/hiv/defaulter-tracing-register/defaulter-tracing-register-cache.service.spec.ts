import { TestBed, inject } from '@angular/core/testing';

import { DefaulterTracingRegisterCacheService } from './defaulter-tracing-register-cache-service.service';

describe('DefaulterTracingRegisterCacheServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DefaulterTracingRegisterCacheService]
    });
  });

  it('should be created', inject(
    [DefaulterTracingRegisterCacheService],
    (service: DefaulterTracingRegisterCacheService) => {
      expect(service).toBeTruthy();
    }
  ));
});
