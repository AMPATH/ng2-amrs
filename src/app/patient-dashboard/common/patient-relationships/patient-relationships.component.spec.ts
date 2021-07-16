import { TestBed, async } from "@angular/core/testing";
import { PatientService } from "../../services/patient.service";
import { Observable } from "rxjs";
import { ProgramEnrollmentResourceService } from "../../../openmrs-api/program-enrollment-resource.service";
import { AppSettingsService } from "../../../app-settings/app-settings.service";
import { Router, ActivatedRoute } from "@angular/router";
import {
  ToastrConfig,
  ToastrService,
  Overlay,
  OverlayContainer,
} from "ngx-toastr";
import { PatientResourceService } from "../../../openmrs-api/patient-resource.service";
import { LocalStorageService } from "../../../utils/local-storage.service";
import { EncounterResourceService } from "../../../openmrs-api/encounter-resource.service";
import { PatientRelationshipService } from "./patient-relationship.service";
import { PatientRelationshipResourceService } from "../../../openmrs-api/patient-relationship-resource.service";
import { PatientRelationshipsComponent } from "./patient-relationships.component";
import { ConfirmationService } from "primeng/primeng";
import { PatientProgramService } from "../../programs/patient-programs.service";
import { RoutesProviderService } from "../../../shared/dynamic-route/route-config-provider.service";
import { ProgramService } from "../../programs/program.service";
import { ProgramResourceService } from "../../../openmrs-api/program-resource.service";
import { ProgramWorkFlowResourceService } from "../../../openmrs-api/program-workflow-resource.service";
import { ProgramWorkFlowStateResourceService } from "../../../openmrs-api/program-workflow-state-resource.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("Component: PatientRelationships", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PatientRelationshipService,
        PatientService,
        PatientProgramService,
        ProgramWorkFlowResourceService,
        ProgramWorkFlowStateResourceService,
        RoutesProviderService,
        ProgramService,
        ProgramResourceService,
        PatientResourceService,
        LocalStorageService,
        PatientRelationshipResourceService,
        ProgramEnrollmentResourceService,
        EncounterResourceService,
        PatientRelationshipsComponent,
        AppSettingsService,
        ConfirmationService,
      ],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("should instantiate the component", (done) => {
    const component: PatientRelationshipsComponent = TestBed.get(
      PatientRelationshipsComponent
    );
    expect(component).toBeTruthy();
    done();
  });

  it("should have all the required functions defined and callable", (done) => {
    const component: PatientRelationshipsComponent = TestBed.get(
      PatientRelationshipsComponent
    );
    const reminders = [];
    spyOn(component, "ngOnInit").and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
    spyOn(component, "getPatientRelationships").and.callThrough();
    component.getPatientRelationships();
    expect(component.getPatientRelationships).toHaveBeenCalled();
    spyOn(component, "voidRelationship").and.callThrough();
    component.voidRelationship();
    expect(component.voidRelationship).toHaveBeenCalled();
    spyOn(component, "openConfirmDialog").and.callThrough();
    component.openConfirmDialog("8ac34c4b-8c57-4c83-886d-930e0d6c2d80");
    expect(component.openConfirmDialog).toHaveBeenCalled();

    done();
  });
});
