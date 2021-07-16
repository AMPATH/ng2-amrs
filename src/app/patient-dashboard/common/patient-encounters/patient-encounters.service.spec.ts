/* tslint:disable:no-unused-variable */

import { TestBed, async } from "@angular/core/testing";
import { Observable, Subject, BehaviorSubject } from "rxjs";

import { PatientEncounterService } from "./patient-encounters.service";
import { EncounterResourceService } from "../../../openmrs-api/encounter-resource.service";
import { Encounter } from "../../../models/encounter.model";
import { FakeEncounterResourceService } from "../../../openmrs-api/patient-encounter-service.mock";

describe("Service: PatientEncounter", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientEncounterService,
        {
          provide: EncounterResourceService,
          useFactory: () => {
            return new FakeEncounterResourceService();
          },
          deps: [],
        },
      ],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("should create an instance", () => {
    const service: PatientEncounterService = TestBed.get(
      PatientEncounterService
    );
    expect(service).toBeTruthy();
  });

  it("should get Encounters by patientUuid", (done) => {
    const service: PatientEncounterService = TestBed.get(
      PatientEncounterService
    );
    const result = service.getEncountersByPatientUuid("uuid", false, null);

    result.subscribe((results) => {
      expect(results).toBeTruthy();
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].uuid).toEqual("uuid");
      done();
    });
  });

  it("should return an error when encounters cannot be loaded", (done) => {
    const service: PatientEncounterService = TestBed.get(
      PatientEncounterService
    );
    const fakeRes: FakeEncounterResourceService = TestBed.get(
      EncounterResourceService
    ) as FakeEncounterResourceService;

    // tell mock to return error on next call
    fakeRes.returnErrorOnNext = true;
    const results = service.getEncountersByPatientUuid("uuid");

    results.subscribe(
      (result) => {},
      (error) => {
        // when it gets here, then it returned an error
        done();
      }
    );
  });
});
