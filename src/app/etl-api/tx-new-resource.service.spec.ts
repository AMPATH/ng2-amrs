import { TestBed, inject } from '@angular/core/testing';

import { TxNewResourceService } from './tx-new-resource.service';

describe('TxNewResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TxNewResourceService]
    });
  });

  it('should be created', inject(
    [TxNewResourceService],
    (service: TxNewResourceService) => {
      expect(service).toBeTruthy();
    }
  ));
});
