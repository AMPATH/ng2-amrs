import { TestBed, inject } from '@angular/core/testing';

import { RegistersResourceService } from './registers-resource.service';

describe('RegistersResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RegistersResourceService]
    });
  });

  it('should be created', inject(
    [RegistersResourceService],
    (service: RegistersResourceService) => {
      expect(service).toBeTruthy();
    }
  ));
});
