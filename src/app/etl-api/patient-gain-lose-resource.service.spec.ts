import { TestBed, inject } from '@angular/core/testing';

import { PatientGainLoseResourceService } from './patient-gain-lose-resource.service';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { ClinicDashboardComponent } from '../clinic-dashboard/clinic-dashboard.component';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '../clinic-dashboard/clinic-dashboard.routes';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('PatientGainLoseResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientGainLoseResourceService,
        AppSettingsService,
        LocalStorageService
      ],
      declarations: [ClinicDashboardComponent],
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
  });

  it('should be created', inject(
    [PatientGainLoseResourceService],
    (service: PatientGainLoseResourceService) => {
      expect(service).toBeTruthy();
    }
  ));
});
