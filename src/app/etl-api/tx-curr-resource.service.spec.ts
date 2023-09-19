import { TestBed, inject } from '@angular/core/testing';

import { TxCurrResourceService } from './tx-curr-resource.service';

describe('TxCurrResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TxCurrResourceService]
    });
  });

  it('should be created', inject(
    [TxCurrResourceService],
    (service: TxCurrResourceService) => {
      expect(service).toBeTruthy();
    }
  ));
});
