import { TestBed, inject } from '@angular/core/testing';

import { TxMlResourceService } from './tx-ml-resource.service';

describe('TxMlResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TxMlResourceService]
    });
  });

  it('should be created', inject(
    [TxMlResourceService],
    (service: TxMlResourceService) => {
      expect(service).toBeTruthy();
    }
  ));
});
