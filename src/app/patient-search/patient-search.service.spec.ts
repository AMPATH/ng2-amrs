import { TestBed } from "@angular/core/testing";
import { PatientSearchService } from "./patient-search.service";
import { PatientResourceService } from "../openmrs-api/patient-resource.service";
import { FakePatientResourceService } from "../openmrs-api/fake-patient-resource";

describe("Service: PatientSearch", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PatientSearchService,
        {
          provide: PatientResourceService,
          useFactory: () => {
            return new FakePatientResourceService(null, null);
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
    const service: PatientSearchService = TestBed.get(PatientSearchService);
    expect(service).toBeTruthy();
  });

  it("should search for patients by search text", () => {
    const service: PatientSearchService = TestBed.get(PatientSearchService);
    const fakeRes: FakePatientResourceService = TestBed.get(
      PatientResourceService
    ) as FakePatientResourceService;
    fakeRes.returnErrorOnNext = false;
    const result = service.searchPatient("text", false);

    result.subscribe((results) => {
      expect(results).toBeTruthy();
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].uuid).toEqual("uuid");
    });
  });

  it("should return an error when patient search is not successful", (done) => {
    const service: PatientSearchService = TestBed.get(PatientSearchService);
    const fakeRes: FakePatientResourceService = TestBed.get(
      PatientResourceService
    ) as FakePatientResourceService;

    // tell mock to return error on next call
    fakeRes.returnErrorOnNext = true;
    const results = service.searchPatient("text", false);

    results.subscribe(
      (result) => {},
      (error) => {
        // when it gets here, then it returned an error
        done();
      }
    );
  });
});
