import { TestBed } from "@angular/core/testing";
import { CacheService } from "ionic-cache";
import { DataCacheService } from "../../../shared/services/data-cache.service";
import { LocalStorageService } from "../../../utils/local-storage.service";
import { PatientTransferService } from "./patient-transfer.service";
import { SelectDepartmentService } from "../../../shared/services/select-department.service";
import { DepartmentProgramsConfigService } from "../../../etl-api/department-programs-config.service";
import { AppSettingsService } from "../../../app-settings/app-settings.service";
let appSettingsServiceSpy: jasmine.SpyObj<AppSettingsService>;
let deptProgramsConfigServiceSpy: jasmine.SpyObj<DepartmentProgramsConfigService>;
let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
let selectDepartmentServiceSpy: jasmine.SpyObj<SelectDepartmentService>;
describe("PatientTransferService: ", () => {
  let service: PatientTransferService;
  appSettingsServiceSpy = jasmine.createSpyObj("AppSettingsService", [
    "getEtlRestbaseurl",
  ]);
  deptProgramsConfigServiceSpy = jasmine.createSpyObj(
    "DepartmentProgramsConfigService",
    ["getDartmentProgramsConfig"]
  );
  localStorageServiceSpy = jasmine.createSpyObj("LocalStorageService", [
    "getItem",
    "setItem",
  ]);
  selectDepartmentServiceSpy = jasmine.createSpyObj("SelectDepartmentService", [
    "getUserSetDepartment",
  ]);
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        AppSettingsService,
        CacheService,
        DataCacheService,
        LocalStorageService,
        PatientTransferService,
        {
          provide: SelectDepartmentService,
          useValue: selectDepartmentServiceSpy,
        },
      ],
    });
    service = new PatientTransferService(selectDepartmentServiceSpy);
  });
  afterEach(() => {
    TestBed.resetTestingModule();
  });
  it("should be created", () => {
    expect(service).toBeTruthy();
  });
  it("should have all of its methods defined", () => {
    expect(service.getPatientStatusQuestion).toBeDefined();
    expect(service.handleProgramManagerRedirects).toBeDefined();
    expect(service.prefillTransferOptions).toBeDefined();
  });
});
