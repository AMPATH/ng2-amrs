import { TestBed, async } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController,
} from "@angular/common/http/testing";
import { RetrospectiveBannerComponent } from "./retrospective-banner.component";
import { RetrospectiveDataEntryService } from "../../services/retrospective-data-entry.service";
import { RetrospectiveSettingsComponent } from "../settings/settings.component";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { UserDefaultPropertiesService } from "../../../user-default-properties/user-default-properties.service";
import { UserService } from "../../../openmrs-api/user.service";
import { SessionStorageService } from "../../../utils/session-storage.service";
import { AppSettingsService } from "../../../app-settings/app-settings.service";
import { LocalStorageService } from "../../../utils/local-storage.service";

describe("RetrospectiveBanner Component", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [
        RetrospectiveBannerComponent,
        RetrospectiveSettingsComponent,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        RetrospectiveDataEntryService,
        UserDefaultPropertiesService,
        UserService,
        SessionStorageService,
        AppSettingsService,
        LocalStorageService,
      ],
    }).compileComponents();
  }));
  it("should create the RetrospectiveBanner component", async(() => {
    const fixture = TestBed.createComponent(RetrospectiveBannerComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
