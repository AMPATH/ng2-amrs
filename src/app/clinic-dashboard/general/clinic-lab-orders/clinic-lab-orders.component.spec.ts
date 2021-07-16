import { TestBed, inject, async } from "@angular/core/testing";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { SpyLocation } from "@angular/common/testing";

import { AppFeatureAnalytics } from "../../../shared/app-analytics/app-feature-analytics.service";
import { FakeAppFeatureAnalytics } from "../../../shared/app-analytics/app-feature-analytcis.mock";
import { AppSettingsService } from "../../../app-settings/app-settings.service";
import { LocalStorageService } from "../../../utils/local-storage.service";
import { ClinicLabOrdersComponent } from "./clinic-lab-orders.component";
import { ClinicLabOrdersResourceService } from "../../../etl-api/clinic-lab-orders-resource.service";
import { ClinicDashboardCacheService } from "../../services/clinic-dashboard-cache.service";
import { Observable } from "rxjs";
import "rxjs/add/observable/of";
import { HttpClientTestingModule } from "@angular/common/http/testing";
const expectedResults = {
  startIndex: 0,
  size: 3,
  result: [
    {
      person_id: 111,
      uuid: "uuid-1",
      given_name: "GIven Name",
      middle_name: "Middle Name",
      family_name: "Family Name",
      identifiers: "identifier-1,identifier-2",
      orderNumber: "ORD-28212",
      location_name: "location Test",
      patient_uuid: "5ed39ae0-1359-11df-a1f1-0026b9348838",
      date_activated: "2017-03-06",
    },
    {
      person_id: 112,
      uuid: "uuid-2",
      given_name: "GIven Name",
      middle_name: "Middle Name",
      family_name: "Family Name",
      identifiers: "identifier-11,identifier-22",
      orderNumber: "ORD-28212",
      location_name: "location Test",
      patient_uuid: "5ed39ae0-1359-11df-a1f1-0026b9348838",
      date_activated: "2017-03-06",
    },
  ],
};

describe("Component: Clinical lab orders Unit Tests", () => {
  let clinicLabOrdersResourceService: ClinicLabOrdersResourceService,
    fakeAppFeatureAnalytics: AppFeatureAnalytics,
    component;
  const mockRouter = {
    navigate: jasmine.createSpy("navigate"),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        FakeAppFeatureAnalytics,
        ClinicLabOrdersComponent,
        {
          provide: AppFeatureAnalytics,
          useClass: FakeAppFeatureAnalytics,
        },
        {
          provide: ClinicLabOrdersResourceService,
        },
        { provide: Location, useClass: SpyLocation },
        { provide: Router, useValue: mockRouter },
        {
          provide: ActivatedRoute,
          useValue: {
            params: Observable.of({ id: 123 }),
          },
        },
        AppSettingsService,
        LocalStorageService,
        ClinicDashboardCacheService,
      ],
      imports: [HttpClientTestingModule],
    });

    clinicLabOrdersResourceService = TestBed.get(
      ClinicLabOrdersResourceService
    );
    fakeAppFeatureAnalytics = TestBed.get(AppFeatureAnalytics);
    component = TestBed.get(ClinicLabOrdersComponent);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("should instantiate the component", (done) => {
    expect(component).toBeTruthy();
    done();
  });

  it("should have required properties", (done) => {
    expect(component.results.length).toEqual(0);
    expect(component.results).toBeDefined();
    expect(component.totalSampleCollected).toBeUndefined();
    expect(component.totalOrderds).toBeUndefined();
    expect(component.selectedVisitType).toBeUndefined();
    expect(component.orders).toBeUndefined();
    expect(component.totalSampleCollected).toBeUndefined();
    expect(component.startDate).toBeUndefined();
    expect(component.filterCollapsed).toBeUndefined();
    expect(component.isLoadingReport).toBe(false);
    expect(component.parentIsBusy).toBe(false);
    expect(component.totalCounts).toBeUndefined();
    expect(component.selectedDate).toBeUndefined();
    expect(component.locationName).toBeDefined();
    expect(component.locationName).toBe("");
    expect(component.location).toEqual("");

    done();
  });

  it("should have all the required functions defined and callable", (done) => {
    spyOn(component, "getCurrentLocation").and.callFake((err, data) => {});
    component.getCurrentLocation(0, 10, (err, data) => {});
    expect(component.getCurrentLocation).toHaveBeenCalled();

    spyOn(component, "createColumnDefs").and.callThrough();
    component.createColumnDefs();
    expect(component.createColumnDefs).toHaveBeenCalled();

    spyOn(component, "ngOnInit").and.callThrough();
    component.ngOnInit();
    expect(component.ngOnInit).toHaveBeenCalled();
    spyOn(component, "formatDateField").and.callThrough();
    component.formatDateField(expectedResults);
    expect(component.formatDateField).toHaveBeenCalled();

    done();
  });
});
