/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { PatientRelationshipResourceService } from '../../../openmrs-api/patient-relationship-resource.service';
import { PatientRelationshipService } from './patient-relationship.service';
import { PatientService } from '../../services/patient.service';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import { ProgramEnrollmentResourceService } from '../../../openmrs-api/program-enrollment-resource.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import { RoutesProviderService } from '../../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { ProgramWorkFlowResourceService } from '../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService } from '../../../openmrs-api/program-workflow-state-resource.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Service: PatientRelationshipService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PatientRelationshipResourceService,
        PatientRelationshipService,
        AppSettingsService,
        PatientService,
        PatientProgramService,
        PatientResourceService,
        LocalStorageService,
        RoutesProviderService,
        ProgramService,
        ProgramResourceService,
        ProgramEnrollmentResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        EncounterResourceService
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    const service: PatientRelationshipService = TestBed.get(
      PatientRelationshipService
    );
    expect(service).toBeTruthy();
  });

  it('should get patient relationships by patient uuid', () => {
    const service: PatientRelationshipService = TestBed.get(
      PatientRelationshipService
    );
    const relationships = service.getRelationships(
      '8ac34c4b-8c57-4c83-886d-930e0d6c2d80'
    );
    relationships.subscribe((results) => {
      if (results) {
        expect(results).toBeTruthy();
      }
    });
  });
});
