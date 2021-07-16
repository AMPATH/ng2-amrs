import { TestBed, async, inject } from "@angular/core/testing";
import { APP_BASE_HREF } from "@angular/common";
import { AppSettingsService } from "../app-settings/app-settings.service";
import { LocalStorageService } from "../utils/local-storage.service";
import { ProviderResourceService } from "./provider-resource.service";
import { PersonResourceService } from "./person-resource.service";
import {
  HttpTestingController,
  HttpClientTestingModule,
} from "@angular/common/http/testing";

// Load the implementations that should be tested

describe("Service : ProviderResourceService Unit Tests", () => {
  let providerResourceService: ProviderResourceService;
  let httpMock: HttpTestingController;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [],
      providers: [
        AppSettingsService,
        LocalStorageService,
        ProviderResourceService,
        PersonResourceService,
      ],
    });

    providerResourceService = TestBed.get(ProviderResourceService);
    httpMock = TestBed.get(HttpTestingController);
  }));
  afterEach(() => {
    httpMock.verify();
    TestBed.resetTestingModule();
  });

  it("should be injected with all dependencies", () => {
    expect(providerResourceService).toBeTruthy();
  });

  it("should have getUrl defined", () => {
    expect(providerResourceService.getUrl()).toBeDefined();
  });
  it("should return a provider when the correct uuid is provided without v", (done) => {
    const providerUuid = "xxx-xxx-xxx-xxx";

    providerResourceService
      .getProviderByUuid(providerUuid)
      .subscribe((response) => {
        done();
      });

    const req = httpMock.expectOne(
      providerResourceService.getUrl() + "/" + providerUuid + "?v=full"
    );
    expect(req.request.method).toBe("GET");
    expect(req.request.urlWithParams).toContain("provider/" + providerUuid);
    expect(req.request.urlWithParams).toContain("v=");
    req.flush(JSON.stringify({}));
  });
  it("should return a provider when the correct uuid is provided with v", (done) => {
    const providerUuid = "xxx-xxx-xxx-xxx";

    providerResourceService
      .getProviderByUuid(providerUuid, false, "9")
      .subscribe((response) => {
        done();
      });

    const req = httpMock.expectOne(
      providerResourceService.getUrl() + "/" + providerUuid + "?v=9"
    );
    expect(req.request.method).toBe("GET");
    expect(req.request.urlWithParams).toContain("provider/" + providerUuid);
    expect(req.request.urlWithParams).toContain("v=");
    req.flush(JSON.stringify({}));
  });

  it("should return a list of providers a matching search string is provided without v", (done) => {
    const searchText = "test";
    const results = [
      {
        uuid: "uuid",
        identifier: "",
      },
    ];

    providerResourceService.searchProvider(searchText).subscribe((data) => {
      done();
    });

    const req = httpMock.expectOne(
      providerResourceService.getUrl() + "?q=" + searchText + "&v=full"
    );
    expect(req.request.method).toBe("GET");
    expect(req.request.urlWithParams).toContain("?q=" + searchText);
    expect(req.request.urlWithParams).toContain("v=");
    req.flush(JSON.stringify(results));
  });
  it("should return a list of providers a matching search string is provided with v", (done) => {
    const searchText = "test";
    const results = [
      {
        uuid: "uuid",
        identifier: "",
      },
    ];

    providerResourceService
      .searchProvider(searchText, false, "9")
      .subscribe((data) => {
        done();
      });

    const req = httpMock.expectOne(
      providerResourceService.getUrl() + "?q=" + searchText + "&v=9"
    );
    expect(req.request.method).toBe("GET");
    expect(req.request.urlWithParams).toContain("?q=" + searchText);
    expect(req.request.urlWithParams).toContain("v=");
    req.flush(JSON.stringify(results));
  });
  it("should throw an error when server returns an error response", () => {
    const searchText = "test";

    providerResourceService.searchProvider(searchText).subscribe(
      (res) => {
        console.log("No Errors");
      },
      (err) => {
        expect(err).toBe("404 - val");
      }
    );

    const req = httpMock.expectOne(
      providerResourceService.getUrl() + "?q=" + searchText + "&v=full"
    );
    expect(req.request.method).toBe("GET");
    expect(req.request.urlWithParams).toContain("?q=" + searchText);
    expect(req.request.urlWithParams).toContain("v=");
    req.flush({ type: "error", status: 404, statusText: "val" });
  });
});
