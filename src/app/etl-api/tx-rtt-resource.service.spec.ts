import { TestBed, inject } from '@angular/core/testing';

import { TxRttResourceService } from './tx-rtt-resource.service';

describe('TxRttResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TxRttResourceService]
    });
  });

  it('should be created', inject(
    [TxRttResourceService],
    (service: TxRttResourceService) => {
      expect(service).toBeTruthy();
    }
  ));
});
