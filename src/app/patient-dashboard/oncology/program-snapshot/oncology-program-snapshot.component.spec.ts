import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { DebugElement } from "@angular/core";
import { HttpClientTestingModule } from "@angular/common/http/testing";

import * as _ from "lodash";
import { of } from "rxjs";

import { OncologyProgramSnapshotComponent } from "./oncology-program-snapshot.component";
import { AppSettingsService } from "../../../app-settings/app-settings.service";
import { CacheService } from "ionic-cache";
import { CacheStorageService } from "ionic-cache/dist/cache-storage";
import { DataCacheService } from "../../../shared/services/data-cache.service";
import { LocalStorageService } from "../../../utils/local-storage.service";
import { LocationResourceService } from "../../../openmrs-api/location-resource.service";
import { OncologySummaryResourceService } from "../../../etl-api/oncology-summary-resource.service";
import { Patient } from "../../../models/patient.model";

const generalOncologyProgramUuid = "725b5193-3452-43fc-aca3-6a80432d9bfa";
const oncologyScreeningAndDiagnosisProgramUuid =
  "37ff4124-91fd-49e6-8261-057ccfb4fcd0";

const patient = new Patient({
  allIdentifiers: "297400783-9",
  commonIdentifiers: {
    ampathMrsUId: "297400783-9",
    amrsMrn: "",
    cCC: "",
    kenyaNationalId: "",
  },
  display: "297400783-9 - Test Anticoagulation Treatment",
  encounters: [
    {
      encounterDatetime: new Date(),
      encounterType: {
        display: "ANTICOAGULATION TRIAGE",
        uuid: "6accd920-6254-4063-bfd1-0e1b70b3f201",
      },
      form: {
        name: "ONCOLOGY POC Anticoagulation Triage Form",
        uuid: "84539fd3-842c-46a7-a595-fc64919badd6",
      },
      location: {
        display: "Location Test",
        uuid: "18c343eb-b353-462a-9139-b16606e6b6c2",
      },
      patient: {
        uuid: "7ce98cb8-9785-4467-91cc-64afa2d59763",
      },
    },
  ],
  person: {
    age: 30,
    dead: false,
    deathDate: null,
    display: "Test Oncology Patient",
    gender: "F",
    healthCenter: "",
    uuid: "7ce98cb8-9785-4467-91cc-64afa2d59763",
  },
  uuid: "7ce98cb8-9785-4467-91cc-64afa2d59763",
});

const screeningPatient = new Patient({
  allIdentifiers: "210120721-5",
  commonIdentifiers: {
    ampathMrsUId: "2210120721-5",
    amrsMrn: "",
    cCC: "",
    kenyaNationalId: "",
  },
  display: "210120721-5 - Test Screening Patient",
  encounter: [
    {
      encounterDatetime: "2020-01-02T15:29:08.000+0300",
      encounterType: {
        display: "ONCOLOGY VIA",
        uuid: "3f01e89d-ad00-426d-b553-a527443616d4",
      },
      form: {
        uuid: "9cf7f7f3-94ac-4829-8de0-53a33b35c29a",
        name: "ONCOLOGY POC VIA Form v1.1",
      },
      location: {
        display: "Location Test",
        uuid: "18c343eb-b353-462a-9139-b16606e6b6c2",
      },
      patient: {
        uuid: "138484eb-5c60-4c54-a08a-5671b2a168a8",
      },
    },
    {
      encounterDatetime: "2020-01-02T15:29:08.000+0300",
      encounterType: {
        uuid: "e856b2ac-fe35-41d6-a9aa-2b2679092763",
        display: "BREASTCANCERSCREENING",
      },
      form: {
        uuid: "077c6358-983c-4b7c-bb51-bae56a304f8a",
        name:
          "ONCOLOGY POC Breast Cancer Screening Form (FOR MASS SCREENING) V1.4",
      },
      location: {
        display: "Location Test",
        uuid: "18c343eb-b353-462a-9139-b16606e6b6c2",
      },
      patient: {
        uuid: "138484eb-5c60-4c54-a08a-5671b2a168a8",
      },
    },
  ],
  person: {
    age: 43,
    dead: false,
    deathDate: null,
    display: "Test Screening Patient",
    gender: "F",
    healthCenter: "",
    uuid: "88624645-7b07-4d30-94a5-b42fa7b40096",
  },
  uuid: "88624645-7b07-4d30-94a5-b42fa7b40096",
});

const mockSummaryData = [
  {
    date_created: "2019-12-31T12:17:06.000Z",
    person_id: 888890,
    uuid: "4475cc96-624b-4d78-8eaa-d48881e6b677",
    encounter_id: 8842128,
    encounter_datetime: "03-07-2019",
    encounter_type: 38,
    encounter_type_name: "OncologyInitial",
    visit_id: 2091566,
    visit_type_id: 5,
    visit_start_datetime: "03-07-2019",
    location_id: 195,
    program_id: 6,
    is_clinical: 1,
    enrollment_date: "09-07-2019",
    prev_rtc_date: "23-07-2019",
    rtc_date: "14-08-2019",
    diagnosis: "Breast Cancer - Inflammatory Breast Cancer",
    result_of_diagnosis: 0,
    diagnosis_date: "03-07-2019",
    breast_exam_findings: "",
    via_test_result: "",
    cancer_type: "Breast Cancer",
    cancer_subtype: "Inflammatory Breast Cancer",
    breast_cancer_type: 6545,
    non_cancer_diagnosis: null,
    cancer_stage: "",
    overall_cancer_stage_group: "",
    cur_onc_meds: "",
    cur_onc_meds_dose: null,
    cur_onc_meds_frequency: null,
    cur_onc_meds_start_date: null,
    cur_onc_meds_end_date: null,
    oncology_treatment_plan: "",
    chemotherapy: "NONE",
    current_chemo_cycle: null,
    total_chemo_cycles_planned: null,
    therapeutic_notes: null,
    cancer_diagnosis_status: 9850,
    reasons_for_surgery: null,
    chemotherapy_intent: "",
    chemotherapy_plan: "",
    chemotherapy_regimen: null,
    drug_route: "",
    medication_history: "",
    other_meds_added: "",
    sickle_cell_drugs: null,
    programuuid: "725b5193-3452-43fc-aca3-6a80432d9bfa",
    location_uuid: "18c343eb-b353-462a-9139-b16606e6b6c2",
  },
];

const mockIntegratedSummaryData = [
  {
    encounter_id: 6731943,
    encounter_datetime: "2020-01-02T12:31:51.000Z",
    encounter_type_name: "BREASTCANCERSCREENING",
    visit_name: "Breast Cancer Screening",
    location: "MTRH Oncology",
    breast_exam_findings: 1115,
    prior_via_test_result: null,
    via_test_result: null,
    hiv_status: 664,
  },
  {
    encounter_id: 1354963,
    encounter_datetime: "2020-01-02T12:29:12.000Z",
    encounter_type_name: "ONCOLOGYVIA",
    visit_name: "Cervical Cancer Screening",
    location: "MTRH Oncology",
    breast_exam_findings: null,
    prior_via_test_result: 703,
    prior_via_test_result_date: "2019-05-05T00:00:00.000Z",
    via_test_result: 6497,
    hiv_status: 664,
  },
];

const mockLocationObj = {
  name: "Location Test",
  uuid: "18c343eb-b353-462a-9139-b16606e6b6c2",
};

const oncologySummaryServiceStub = {
  getOncologySummary: () => {
    return of(mockSummaryData);
  },
  getIntegratedProgramSnapshot: () => {
    return of(mockIntegratedSummaryData);
  },
};

const locationResourceServiceStub = {
  getLocationByUuid: () => {
    return of(mockLocationObj);
  },
};

class MockCacheStorageService {
  constructor(a, b) {}

  public ready() {
    return true;
  }
}

describe("Component: OncologyProgramSnapshotComponent", () => {
  let component: OncologyProgramSnapshotComponent;
  let fixture: ComponentFixture<OncologyProgramSnapshotComponent>;
  let debugElement: DebugElement;
  let nativeElement: HTMLElement;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [OncologyProgramSnapshotComponent],
      providers: [
        AppSettingsService,
        CacheService,
        DataCacheService,
        LocalStorageService,
        {
          provide: LocationResourceService,
          useValue: locationResourceServiceStub,
        },
        {
          provide: OncologySummaryResourceService,
          useValue: oncologySummaryServiceStub,
        },
        {
          provide: CacheStorageService,
          useFactory: () => {
            return new MockCacheStorageService(null, null);
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OncologyProgramSnapshotComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    nativeElement = debugElement.nativeElement;
    component.programUuid = generalOncologyProgramUuid;
    component.patient = patient;
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("should instantiate the component", () => {
    expect(component).toBeTruthy();
  });

  it("should have all its methods defined", () => {
    expect(component.ngOnInit).toBeDefined();
    expect(component.ngOnDestroy).toBeDefined();
    expect(component.loadOncologyDataSummary).toBeDefined();
  });

  it("should display the patient's snapshot summary after the component initializes", async(() => {
    component.patientUuid = patient.uuid;
    fixture.detectChanges();
    expect(component.summaryData).not.toBeDefined("No summary");

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.hasLoadedData).toBe(true);
      expect(component.loadingSummary).toBe(false);
      expect(component.hasData).toBe(true);
      expect(component.hasError).toBe(false);
      expect(component.summaryData).toBeDefined();
      const title = <HTMLElement>(
        nativeElement.querySelector(".component-title")
      );
      expect(title.innerHTML).toEqual("Last Encounter");
      const snapshot = <HTMLElement>(
        nativeElement.querySelector(".snapshot-body")
      );
      expect(snapshot.textContent).toContain("Type: ");
      expect(snapshot.textContent).toContain(
        mockSummaryData[0].encounter_type_name,
        "Encounter type"
      );
      expect(snapshot.textContent).toContain("Diagnosis: ");
      expect(snapshot.textContent).toContain(
        mockSummaryData[0].diagnosis,
        "Cancer diagnosis"
      );
      expect(snapshot.textContent).toContain("Previous Chemotherapy: ");
      expect(snapshot.textContent).toContain(
        mockSummaryData[0].chemotherapy_plan,
        "Previous chemotherapy"
      );
      expect(snapshot.textContent).toContain("RTC Date: ");
      expect(snapshot.textContent).toContain(
        mockSummaryData[0].rtc_date,
        "RTC Date"
      );
    });
  }));

  it("renders the integrated summary snapshot for screening and diagnosis program patients", async(() => {
    component.programUuid = oncologyScreeningAndDiagnosisProgramUuid;
    component.patientUuid = screeningPatient.uuid;
    fixture.detectChanges();
    expect(component.summaryData).not.toBeDefined("No summary");

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      expect(component.hasLoadedData).toBe(true);
      expect(component.loadingSummary).toBe(false);
      expect(component.isIntegratedProgram).toBe(true);
      expect(component.hasData).toBe(true);
      expect(component.hasError).toBe(false);
      expect(component.summaryData).toBeDefined();
      const snapshot = <HTMLElement>(
        nativeElement.querySelector(".snapshot-body")
      );
      expect(snapshot.textContent).toContain("Visit: Breast Cancer Screening");
      expect(snapshot.textContent).toContain(
        "Encounter: BREASTCANCERSCREENING"
      );
      expect(snapshot.textContent).toContain("Date: January 2, 2020");
      expect(snapshot.textContent).toContain("Location: MTRH Oncology");
      expect(snapshot.textContent).toContain(
        "Breast screening findings: Normal"
      );
      expect(snapshot.textContent).toContain("HIV status: Negative");
      expect(snapshot.textContent).toContain(
        "Visit: Cervical Cancer Screening"
      );
      expect(snapshot.textContent).toContain("Encounter: ONCOLOGYVIA");
      expect(snapshot.textContent).toContain("Date: January 2, 2020");
      expect(snapshot.textContent).toContain("Location: MTRH Oncology");
      expect(snapshot.textContent).toContain("Last VIA test result: Positive");
      expect(snapshot.textContent).toContain(
        "Date of last VIA test: May 5, 2019"
      );
      expect(snapshot.textContent).toContain("HIV status: Negative");
    });
  }));
});
