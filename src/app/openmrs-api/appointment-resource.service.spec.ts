import { TestBed, inject } from '@angular/core/testing';

import { AppointmentResourceService } from './appointment-resource.service';

describe('AppointmentResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppointmentResourceService]
    });
  });

  it('should be created', inject([AppointmentResourceService], (service: AppointmentResourceService) => {
    expect(service).toBeTruthy();
  }));
});
