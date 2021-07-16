/* tslint:disable:no-unused-variable */

import { TestBed, async } from "@angular/core/testing";
import { Observable, Subject, BehaviorSubject } from "rxjs";
import { LocalStorageService } from "../../../utils/local-storage.service";

import { HivSummaryService } from "./hiv-summary.service";
import { PatientService } from "../../services/patient.service";
import { HivSummaryResourceService } from "../../../etl-api/hiv-summary-resource.service";
import { AppSettingsService } from "../../../app-settings/app-settings.service";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";

describe("Service: HivSummary", () => {
  let service: HivSummaryService, result: Observable<any>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        HivSummaryService,
        HivSummaryResourceService,
        LocalStorageService,
        AppSettingsService,
      ],
    });
    service = TestBed.get(HivSummaryService);
    httpMock = TestBed.get(HttpTestingController);
    result = service.getHivSummary(
      "de662c03-b9af-4f00-b10e-2bda0440b03b",
      0,
      20
    );
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("should create an instance", () => {
    expect(service).toBeTruthy();
  });

  /*it('should load hiv summary', (done) => {
    result.subscribe((results) => {
      if (results) {
        expect(results).toBeTruthy();
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].uuid).toEqual('uuid');
      }
      done();
    });

  });*/

  it("should return an error when load hiv summary is not successful", (done) => {
    const patientUuid = "de662c03-b9af-4f00-b10e-2bda0440b03b";
    const startIndex = 0;

    const url =
      "https://amrsreporting.ampath.or.ke:8002/etl/patient/" +
      patientUuid +
      "/hiv-summary?startIndex=0&limit=20";
    const req = httpMock.expectNone(url);

    expect(req).toBeUndefined();

    service.getHivSummary(patientUuid, 0, 20).subscribe(
      (response) => {},
      (error: Error) => {
        expect(error).toBeTruthy();
      }
    );
    done();
  });

  /*it('should determine if viral load is pending and return an object to indicate this ', () => {
    const isPendingViralLoadMock = [
      {
        status: true,
        days: 0
      },
      {
        status: false,
        days: 0
      }
    ];

    result.subscribe((results) => {
      if (results) {
        expect(JSON.stringify(results.isPendingViralLoad))
          .toContain(JSON.stringify(isPendingViralLoadMock));
      }
    });
  }
  );*/

  it("should determine if CD4 is pending and return an object to indicate this ", () => {
    const isPendingCD4Mock = [
      {
        status: true,
        days: 0,
      },
      {
        status: false,
        days: 0,
      },
    ];

    result.subscribe((results) => {
      if (results) {
        expect(JSON.stringify(results.isPendingCD4)).toContain(
          JSON.stringify(isPendingCD4Mock)
        );
      }
    });
  });
});
