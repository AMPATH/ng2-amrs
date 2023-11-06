import { TestBed, inject } from '@angular/core/testing';

import { PlhivNcdV2ResourceService } from './plhiv-ncd-v2-resource.service';

describe('PlhivNcdV2ResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlhivNcdV2ResourceService]
    });
  });

  it('should be created', inject(
    [PlhivNcdV2ResourceService],
    (service: PlhivNcdV2ResourceService) => {
      expect(service).toBeTruthy();
    }
  ));
});
