/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { PatientRelationshipSearchComponent } from './patient-relationship-search.component';
import { Patient } from 'src/app/models/patient.model';
import { PatientSearchService } from 'src/app/patient-search/patient-search.service';
import { PatientResourceService } from 'src/app/openmrs-api/patient-resource.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppSettingsService } from 'src/app/app-settings/app-settings.service';
import { LocalStorageService } from 'src/app/utils/local-storage.service';
import { RouterTestingModule } from '@angular/router/testing';
import { PatientRelationshipService } from './patient-relationship.service';
import { PatientRelationshipResourceService } from 'src/app/openmrs-api/patient-relationship-resource.service';

describe('Component: PatientRelationshipSearch', () => {
  let componet: PatientRelationshipSearchComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientRelationshipSearchComponent,
        PatientSearchService,
        PatientResourceService,
        AppSettingsService,
        LocalStorageService,
        PatientRelationshipService,
        PatientRelationshipResourceService
      ],
      imports: [HttpClientTestingModule, RouterTestingModule]
    });
    componet = TestBed.get(PatientRelationshipSearchComponent);
  });

  it('should create an instance', () => {
    expect(componet).toBeDefined();
  });
});
