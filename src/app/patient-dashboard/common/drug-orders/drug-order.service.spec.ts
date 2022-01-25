import { TestBed, inject } from '@angular/core/testing';

import { DrugOrderService } from './drug-order.service';

describe('DrugOrderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DrugOrderService]
    });
  });

  it('should be created', inject(
    [DrugOrderService],
    (service: DrugOrderService) => {
      expect(service).toBeTruthy();
    }
  ));
});
