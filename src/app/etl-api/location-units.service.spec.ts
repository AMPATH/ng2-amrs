import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { LocationUnitsService } from './location-units.service';

describe('LocationUnitsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LocationUnitsService, AppSettingsService, LocalStorageService]
    });
  });

  it('should be created', inject(
    [LocationUnitsService],
    (service: LocationUnitsService) => {
      expect(service).toBeTruthy();
    }
  ));
});
