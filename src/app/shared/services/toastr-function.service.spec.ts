import { TestBed, inject } from '@angular/core/testing';

import { ToastrFunctionService } from './toastr-function.service';

describe('ToastrFunctionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastrFunctionService]
    });
  });

  it('should be created', inject(
    [ToastrFunctionService],
    (service: ToastrFunctionService) => {
      expect(service).toBeTruthy();
    }
  ));
});
