/* tslint:disable:no-unused-variable */

import { TestBed, async } from "@angular/core/testing";
import { ClinicDashboardCacheService } from "../../clinic-dashboard/services/clinic-dashboard-cache.service";
import { ClinicFlowCacheService } from "./clinic-flow-cache.service";

import { AppFeatureAnalytics } from "../../shared/app-analytics/app-feature-analytics.service";
import { FakeAppFeatureAnalytics } from "../../shared/app-analytics/app-feature-analytcis.mock";
import { AppSettingsService } from "../../app-settings/app-settings.service";
import { LocalStorageService } from "../../utils/local-storage.service";
import { NgBusyModule, BusyConfig } from "ng-busy";
import {
  Router,
  ActivatedRoute,
  Params,
  RouterModule,
  ChildrenOutletContexts,
} from "@angular/router";
import { FormsModule } from "@angular/forms";
import { DataListsModule } from "../../shared/data-lists/data-lists.module";
import {
  AccordionModule,
  DataTableModule,
  SharedModule,
  TabViewModule,
  GrowlModule,
  PanelModule,
  ConfirmDialogModule,
  ConfirmationService,
  DialogModule,
  InputTextModule,
  MessagesModule,
  InputTextareaModule,
  DropdownModule,
  ButtonModule,
  CalendarModule,
} from "primeng/primeng";
import { CacheService } from "ionic-cache";
import { DataCacheService } from "../../shared/services/data-cache.service";
import { NgamrsSharedModule } from "../../shared/ngamrs-shared.module";
import { NgxMyDatePickerModule } from "ngx-mydatepicker";
import { MatTabsModule } from "@angular/material";
import { CommonModule } from "@angular/common";
import { Angulartics2Module } from "angulartics2";
import { ClinicFlowResource } from "../../etl-api/clinic-flow-resource-interface";

import { AgGridModule } from "ag-grid-angular/main";
import { HivClinicFlowResourceService } from "../../etl-api/hiv-clinic-flow-resource.service";
import { Observable } from "rxjs";
import { MockHivClinicFlowResourceService } from "../../etl-api/hiv-clinic-flow-resource.service.mock";
import { ClinicFlowProviderStatsComponent } from "./clinic-flow-provider-stats.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("Component: ClinicFlowProviderStatsComponent", () => {
  let component,
    clinicDashBoardCacheService: ClinicDashboardCacheService,
    clinicFlowCacheService: ClinicFlowCacheService,
    clinicFlowResource: ClinicFlowResource,
    router: Router,
    fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NgBusyModule,
        FormsModule,
        DialogModule,
        CalendarModule,
        DataListsModule,
        NgamrsSharedModule,
        NgxMyDatePickerModule.forRoot(),
        MatTabsModule,
        CommonModule,
        Angulartics2Module,
        RouterModule,
        AgGridModule.withComponents([]),
      ],
      providers: [
        LocalStorageService,
        ClinicDashboardCacheService,
        AppSettingsService,
        LocalStorageService,
        CacheService,
        DataCacheService,
        ClinicFlowCacheService,
        ChildrenOutletContexts,
        MockHivClinicFlowResourceService,
        {
          provide: "ClinicFlowResource",
          useExisting: HivClinicFlowResourceService,
        },
        {
          provide: HivClinicFlowResourceService,
          useClass: MockHivClinicFlowResourceService,
        },

        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy("navigate");
          },
        },
        {
          provide: AppFeatureAnalytics,
          useFactory: () => {
            return new FakeAppFeatureAnalytics();
          },
          deps: [],
        },
      ],
      declarations: [ClinicFlowProviderStatsComponent],
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ClinicFlowProviderStatsComponent);
      component = fixture.componentInstance;
    });
  }));

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it("should create an instance", () => {
    clinicFlowCacheService = TestBed.get(ClinicFlowCacheService);
    clinicFlowResource = TestBed.get(HivClinicFlowResourceService);
    clinicDashBoardCacheService = TestBed.get(ClinicDashboardCacheService);
    router = TestBed.get(Router);
    router = TestBed.get(Router);
    component = new ClinicFlowProviderStatsComponent(
      clinicFlowCacheService,
      router,
      clinicFlowResource
    );
    expect(component).toBeTruthy();
  });

  it("should have required properties", (done) => {
    expect(component.ngOnInit).toBeDefined();
    expect(component.clinicFlowData).toBeDefined();
    expect(component.loadingClinicFlow).toBeDefined();
    expect(component.ngOnDestroy).toBeDefined();
    expect(component.dataLoaded).toBeDefined();
    expect(component.errors).toBeDefined();
    expect(component.errors.length).toEqual(0);
    expect(component.selectedDate).toEqual(undefined);
    expect(component.selectedLocation).toEqual(undefined);
    done();
  });

  it(
    "should not pupulate variables when ngOnInit is invoked" +
      " when clinicFlowData is empty",
    (done) => {
      const service: ClinicFlowCacheService = TestBed.get(
        ClinicFlowCacheService
      );
      service.setClinicFlowData(undefined);
      component.ngOnInit();

      service.getClinicFlowData().subscribe(
        (data) => {
          expect(data).toEqual(undefined);
          done();
        },
        (err) => console.log(err),
        () => console.log("Completed")
      );
    }
  );
  it(
    "should load clinic flow data and setIsLoading data when getClinicFlow() " +
      " is invoked",
    (done) => {
      const service: ClinicFlowCacheService = TestBed.get(
        ClinicFlowCacheService
      );
      component.getClinicFlow("2017-03-29T12:03:48.190Z", "uuid");
      expect(component.clinicFlowData.length).toEqual(3);
      expect(component.loadingClinicFlow).toEqual(false);
      expect(component.dataLoaded).toEqual(false);
      service.getIsLoading().subscribe(
        (loading) => {
          expect(loading).toEqual(false);
          done();
        },
        (err) => console.log(err),
        () => console.log("Completed")
      );
      done();
    }
  );

  it(
    "should load selected patient when loadSelectedPatient " + " is invoked",
    (done) => {
      spyOn(component, "loadSelectedPatient").and.callThrough();
      component.loadSelectedPatient({ node: { data: { uuid: "uuid" } } });
      expect(component.loadSelectedPatient).toHaveBeenCalled();
      component.loadSelectedPatient({ node: { data: { uuid: undefined } } });
      expect(component.loadSelectedPatient).toHaveBeenCalled();
      done();
    }
  );
});
