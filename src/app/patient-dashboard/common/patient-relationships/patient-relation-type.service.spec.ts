/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ReplaySubject, BehaviorSubject, Observable } from 'rxjs';
import { Http, BaseRequestOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { AppSettingsService } from '../../../app-settings';
import { PatientService } from '../../services/patient.service';
import { PatientResourceService } from '../../../openmrs-api/patient-resource.service';
import {
    ProgramEnrollmentResourceService
} from '../../../openmrs-api/program-enrollment-resource.service';
import { LocalStorageService } from '../../../utils/local-storage.service';
import { EncounterResourceService } from '../../../openmrs-api/encounter-resource.service';
import {
    PatientRelationshipTypeResourceService
} from '../../../openmrs-api/patient-relationship-type-resource.service';
import { PatientRelationshipTypeService } from './patient-relation-type.service';
import { PatientProgramService } from '../../programs/patient-programs.service';
import { RoutesProviderService } from '../../../shared/dynamic-route/route-config-provider.service';
import { ProgramService } from '../../programs/program.service';
import { ProgramResourceService } from '../../../openmrs-api/program-resource.service';
import { ProgramWorkFlowResourceService } from '../../../openmrs-api/program-workflow-resource.service';
import { ProgramWorkFlowStateResourceService
} from '../../../openmrs-api/program-workflow-state-resource.service';


describe('Service: PatientRelationshipTypeService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PatientRelationshipTypeResourceService,
                PatientRelationshipTypeService,
                MockBackend,
                BaseRequestOptions,
                AppSettingsService,
                PatientService,
                PatientProgramService,
              ProgramWorkFlowResourceService,
              ProgramWorkFlowStateResourceService,
              RoutesProviderService,
              ProgramService,
              ProgramResourceService,
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
        let service: PatientRelationshipTypeService = TestBed.get(PatientRelationshipTypeService);
        expect(service).toBeTruthy();
    });


    it('should get patient relationship types', (done) => {
        let service: PatientRelationshipTypeService = TestBed.get(PatientRelationshipTypeService);
        let relationships = service.getRelationshipTypes();
        relationships.subscribe((results) => {
            if (results) {
                expect(results).toBeTruthy();
            }
            done();
        });
    });

});

