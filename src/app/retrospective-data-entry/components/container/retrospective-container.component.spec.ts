import {
  TestBed,
  async,
  ComponentFixture,
  inject,
} from "@angular/core/testing";
import { RetrospectiveContainerComponent } from "../container/retrospective-container.component";
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { NO_ERRORS_SCHEMA } from "@angular/compiler/src/core";
import { RetrospectiveDataEntryModule } from "../../retrospective-data-entry.module";
import { Router, ActivatedRoute } from "@angular/router";
import { SessionStorageService } from "../../../utils/session-storage.service";
import { UserService } from "../../../openmrs-api/user.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AppSettingsService } from "../../../app-settings/app-settings.service";
import { LocalStorageService } from "../../../utils/local-storage.service";
import { ProviderResourceService } from "../../../openmrs-api/provider-resource.service";
import { PersonResourceService } from "../../../openmrs-api/person-resource.service";

describe("RetrospectiveContainer Component", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RetrospectiveDataEntryModule, HttpClientTestingModule],
      providers: [
        UserService,
        PersonResourceService,
        AppSettingsService,
        SessionStorageService,
        ProviderResourceService,
        LocalStorageService,
        {
          provide: Router,
          useValue: jasmine.createSpyObj("Router", ["navigate"]),
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj("Router", ["navigate"]),
        },
      ],
    }).compileComponents();
  }));
  afterEach(() => {
    TestBed.resetTestingModule();
  });
  it("should create the RetrospectiveContainer component", async(() => {
    const fixture = TestBed.createComponent(RetrospectiveContainerComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
