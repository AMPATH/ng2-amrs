import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GroupSearchInputComponent } from "./group-search-input.component";
import { FormsModule } from "@angular/forms";
import { MatSlideToggleModule } from "@angular/material";
import { CommunityGroupService } from "src/app/openmrs-api/community-group-resource.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { AppSettingsService } from "src/app/app-settings/app-settings.service";
import { LocalStorageService } from "src/app/utils/local-storage.service";
import { SessionStorageService } from "src/app/utils/session-storage.service";

describe("GroupSearchInputComponent", () => {
  let component: GroupSearchInputComponent;
  let fixture: ComponentFixture<GroupSearchInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GroupSearchInputComponent],
      imports: [FormsModule, MatSlideToggleModule, HttpClientTestingModule],
      providers: [
        CommunityGroupService,
        AppSettingsService,
        LocalStorageService,
        SessionStorageService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSearchInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
