/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs/Rx';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { AppSettingsService } from '../../app-settings/app-settings.service';
import {
  PatientRelationshipResourceService
} from '../../openmrs-api/patient-relationship-resource.service';
import { PatientRelationshipService } from './patient-relationship.service';
import { PatientService } from '../patient.service';
import { PatientResourceService } from '../../openmrs-api/patient-resource.service';
import {
  ProgramEnrollmentResourceService
} from '../../openmrs-api/program-enrollment-resource.service';
import { LocalStorageService } from '../../utils/local-storage.service';
import { EncounterResourceService } from '../../openmrs-api/encounter-resource.service';

describe('Service: PatientRelationshipService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientRelationshipResourceService,
        PatientRelationshipService,
        MockBackend,
        BaseRequestOptions,
        AppSettingsService,
        PatientService,
        PatientResourceService,
        LocalStorageService,
        ProgramEnrollmentResourceService,
        EncounterResourceService,
        {
          provide: Http,
          useFactory: (backendInstance: MockBackend,
            defaultOptions: BaseRequestOptions) => {
            return new Http(backendInstance, defaultOptions);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create an instance', () => {
    let service: PatientRelationshipService = TestBed.get(PatientRelationshipService);
    expect(service).toBeTruthy();
  });


  it('should get patient relationships by patient uuid', (done) => {
    let service: PatientRelationshipService = TestBed.get(PatientRelationshipService);
    let relationships = service.getRelationships('8ac34c4b-8c57-4c83-886d-930e0d6c2d80');
    relationships.subscribe((results) => {
      if (results) {
        expect(results).toBeTruthy();
      }
      done();
    });
  });

});
