/* tslint:disable:no-unused-variable */

import { TestBed, async } from "@angular/core/testing";
import { PatientBannerComponent } from "./patient-banner.component";
import { PatientService } from "../../services/patient.service";
import { PatientResourceService } from "src/app/openmrs-api/patient-resource.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AppSettingsService } from "src/app/app-settings/app-settings.service";
import { LocalStorageService } from "src/app/utils/local-storage.service";
import { PatientProgramService } from "../../programs/patient-programs.service";
import { RoutesProviderService } from "src/app/shared/dynamic-route/route-config-provider.service";
import { ProgramService } from "../../programs/program.service";
import { ProgramEnrollmentResourceService } from "src/app/openmrs-api/program-enrollment-resource.service";
import { ProgramWorkFlowResourceService } from "src/app/openmrs-api/program-workflow-resource.service";
import { ProgramWorkFlowStateResourceService } from "src/app/openmrs-api/program-workflow-state-resource.service";
import { ProgramResourceService } from "src/app/openmrs-api/program-resource.service";
import { EncounterResourceService } from "src/app/openmrs-api/encounter-resource.service";
import { PatientRelationshipService } from "../patient-relationships/patient-relationship.service";
import { of } from "rxjs";
import { ModalModule } from "ngx-bootstrap";
import { RouterTestingModule } from "@angular/router/testing";
import { UserDefaultPropertiesService } from "src/app/user-default-properties";
import { UserService } from "src/app/openmrs-api/user.service";
import { SessionStorageService } from "src/app/utils/session-storage.service";

class MockPatientRelationshipService {
  getRelationships(patientUuid) {
    return of([]);
  }
}
describe("Component: PatientBanner", () => {
  let component;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientBannerComponent,
        PatientService,
        {
          provide: PatientRelationshipService,
          useclass: MockPatientRelationshipService,
        },
        PatientResourceService,
        AppSettingsService,
        LocalStorageService,
        PatientProgramService,
        RoutesProviderService,
        ProgramService,
        ProgramEnrollmentResourceService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        ProgramResourceService,
        EncounterResourceService,
        UserService,
        UserDefaultPropertiesService,
        SessionStorageService,
      ],
      imports: [
        HttpClientTestingModule,
        ModalModule.forRoot(),
        RouterTestingModule,
      ],
    });
    component = TestBed.get(PatientBannerComponent);
  });

  it("should create an instance", () => {
    expect(component).toBeTruthy();
  });
});
