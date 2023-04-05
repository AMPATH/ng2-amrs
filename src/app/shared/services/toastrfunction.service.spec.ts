import { TestBed, inject } from '@angular/core/testing';
import { ToastrfunctionService } from './toastrfunction.service';

describe('ToastrfunctionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastrfunctionService]
    });
  });

  it('should be created', inject(
    [ToastrfunctionService],
    (service: ToastrfunctionService) => {
      expect(service).toBeTruthy();
    }
  ));
});
