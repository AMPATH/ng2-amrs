/* tslint:disable:no-unused-variable */
/* tslint:disable:prefer-const */
import { TestBed, async } from "@angular/core/testing";

import { Observable, Subject, BehaviorSubject } from "rxjs";
import { LocalStorageService } from "../../../utils/local-storage.service";
import { AppSettingsService } from "../../../app-settings/app-settings.service";
import { PatientVitalsService } from "./patient-vitals.service";
import { VitalsResourceService } from "../../../etl-api/vitals-resource.service";
import { HttpClientTestingBackend } from "@angular/common/http/testing/src/backend";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { ZscoreService } from "src/app/shared/services/zscore.service";
import { PatientService } from "../../services/patient.service";
import { PatientResourceService } from "src/app/openmrs-api/patient-resource.service";
import { PatientProgramService } from "../../programs/patient-programs.service";
import { RoutesProviderService } from "src/app/shared/dynamic-route/route-config-provider.service";
import { ProgramService } from "../../programs/program.service";
import { ProgramEnrollmentResourceService } from "src/app/openmrs-api/program-enrollment-resource.service";
import { ProgramWorkFlowResourceService } from "src/app/openmrs-api/program-workflow-resource.service";
import { ProgramWorkFlowStateResourceService } from "src/app/openmrs-api/program-workflow-state-resource.service";
import { ProgramResourceService } from "src/app/openmrs-api/program-resource.service";
import { EncounterResourceService } from "src/app/openmrs-api/encounter-resource.service";

describe("Service: PatientVitalsService", () => {
  let service: PatientVitalsService, vitals: Observable<any>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientVitalsService,
        VitalsResourceService,
        LocalStorageService,
        AppSettingsService,
        ZscoreService,
        PatientService,
        PatientResourceService,
        PatientProgramService,
        RoutesProviderService,
        ProgramService,
        ProgramEnrollmentResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        ProgramResourceService,
        EncounterResourceService,
      ],
      imports: [HttpClientTestingModule],
    });
    service = TestBed.get(PatientVitalsService);
    // vitals = service.getvitals('de662c03-b9af-4f00-b10e-2bda0440b03b', 0);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("should create an instance", () => {
    expect(service).toBeTruthy();
  });
});
