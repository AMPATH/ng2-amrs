import { TestBed, inject } from "@angular/core/testing";

import { PrepResourceService } from "./prep-resource.service";
import { RouterTestingModule } from "@angular/router/testing";
import { routes } from "../clinic-dashboard/clinic-dashboard.routes";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ClinicDashboardComponent } from "../clinic-dashboard/clinic-dashboard.component";
import { CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { AppSettingsService } from "../app-settings/app-settings.service";
import { LocalStorageService } from "../utils/local-storage.service";

describe("PrepResourceService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PrepResourceService, AppSettingsService, LocalStorageService],
      declarations: [ClinicDashboardComponent],
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
  });

  it("should be created", inject(
    [PrepResourceService],
    (service: PrepResourceService) => {
      expect(service).toBeTruthy();
    }
  ));
});
