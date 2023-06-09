import { TestBed, inject } from '@angular/core/testing';

import { TxMmdResourceService } from './tx-mmd-resource.service';

describe('TxMmdResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TxMmdResourceService]
    });
  });

  it('should be created', inject(
    [TxMmdResourceService],
    (service: TxMmdResourceService) => {
      expect(service).toBeTruthy();
    }
  ));
});
