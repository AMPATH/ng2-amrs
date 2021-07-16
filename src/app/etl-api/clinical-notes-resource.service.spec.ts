import { TestBed, async, inject } from "@angular/core/testing";

import { AppSettingsService } from "../app-settings/app-settings.service";
import { LocalStorageService } from "../utils/local-storage.service";
import { ClinicalNotesResourceService } from "./clinical-notes-resource.service";
import {
  HttpTestingController,
  HttpClientTestingModule,
} from "@angular/common/http/testing";

describe("Clinical notes Resource Service Unit Tests", () => {
  const patientUuid = "de662c03-b9af-4f00-b10e-2bda0440b03b";

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ClinicalNotesResourceService,
        AppSettingsService,
        LocalStorageService,
      ],
    });
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("should be injected with all dependencies", inject(
    [ClinicalNotesResourceService],
    (notesResourceService: ClinicalNotesResourceService) => {
      expect(notesResourceService).toBeTruthy();
    }
  ));

  it("should make API call with the correct url parameters", () => {
    const httpMock: HttpTestingController = TestBed.get(HttpTestingController);
  });

  it("should return the correct parameters from the api", async(
    inject(
      [ClinicalNotesResourceService],
      (notesResourceService: ClinicalNotesResourceService) => {
        // tslint:disable:no-shadowed-variable
        const patientUuid = "patient-uuid";
        notesResourceService
          .getClinicalNotes(patientUuid, 0, 10)
          .subscribe((data: any) => {
            expect(data).toBeTruthy();
            expect(data.status).toBeDefined();
            expect(data.notes).toBeDefined();
            expect(data.notes.length).toEqual(0);
          });
      }
    )
  ));

  it("should return the correct parameters from the api", async(
    inject(
      [ClinicalNotesResourceService],
      (notesResourceService: ClinicalNotesResourceService) => {
        const patientUuid = "patient-uuid";
        notesResourceService.getClinicalNotes(patientUuid, 0, 10).subscribe(
          (data) => {},
          (error: Error) => {
            expect(error).toBeTruthy();
          }
        );
      }
    )
  ));
});
