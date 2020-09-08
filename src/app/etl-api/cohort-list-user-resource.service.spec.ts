import { TestBed, async, inject } from '@angular/core/testing';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { CohortUserResourceService } from './cohort-list-user-resource.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('CohortUserResourceService Unit Tests', () => {
  const cohortUuid = 'de662c03-b9af-4f00-b10e-2bda0440b03b';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HttpClient,
        CohortUserResourceService,
        AppSettingsService,
        LocalStorageService
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should be injected with all dependencies', inject(
    [CohortUserResourceService],
    (cohortUserResourceService: CohortUserResourceService) => {
      expect(cohortUserResourceService).toBeTruthy();
    }
  ));

  it('should make API call with the correct url parameters', () => {});

  it('should return the correct parameters from the api', async(
    inject(
      [CohortUserResourceService],
      (cohortUserResourceService: CohortUserResourceService) => {
        cohortUserResourceService.getCohortUser(cohortUuid).subscribe(
          (data) => {},
          (error: Error) => {
            expect(error).toBeTruthy();
          }
        );
      }
    )
  ));
});
