import { TestBed, inject } from '@angular/core/testing';

import { DefaulterTracingRegisterResourceService } from './defaulter-tracing-register-resource.service';

describe('DefaulterTracingRegisterResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DefaulterTracingRegisterResourceService]
    });
  });

  it('should be created', inject(
    [DefaulterTracingRegisterResourceService],
    (service: DefaulterTracingRegisterResourceService) => {
      expect(service).toBeTruthy();
    }
  ));
});
