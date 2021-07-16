/* tslint:disable:no-unused-variable */

import { TestBed, async } from "@angular/core/testing";
import { ChartModule } from "angular2-highcharts";

import { ClinicFlowSummaryComponent } from "./clinic-flow-summary.component";
import { ClinicFlowHourlyStatsVizComponent } from "./clinic-flow-hourly-stats-viz.component";
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

import * as Moment from "moment";
import { HivClinicFlowResourceService } from "../../etl-api/hiv-clinic-flow-resource.service";
import { Observable } from "rxjs";
import { MockHivClinicFlowResourceService } from "../../etl-api/hiv-clinic-flow-resource.service.mock";
import { HttpClientTestingModule } from "@angular/common/http/testing";

describe("Component: ClinicFlowSummaryComponent", () => {
  let component,
    clinicDashBoardCacheService: ClinicDashboardCacheService,
    clinicFlowCacheService: ClinicFlowCacheService,
    clinicFlowResource: ClinicFlowResource,
    router: Router,
    fixture;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
        ClinicDashboardCacheService,
        AppSettingsService,
        LocalStorageService,
        CacheService,
        DataCacheService,
        ClinicFlowCacheService,
        ChildrenOutletContexts,
        HivClinicFlowResourceService,
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
      declarations: [
        ClinicFlowSummaryComponent,
        ClinicFlowHourlyStatsVizComponent,
      ],
      imports: [
        NgBusyModule,
        HttpClientTestingModule,
        ChartModule.forRoot(require("highcharts")),
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
      ],
    });
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ClinicFlowSummaryComponent);
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
    component = new ClinicFlowSummaryComponent(
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
    expect(component.incompleteVisitsCount).toEqual(undefined);
    expect(component.medianWaitingTime).toEqual(undefined);
    expect(component.selectedDate).toEqual(undefined);
    expect(component.selectedLocation).toEqual(undefined);
    expect(component.averageWaitingTime).toEqual(undefined);
    expect(component.clinicFlowData).toBeDefined();
    expect(component.loadingClinicFlow).toBeDefined();
    expect(component.errors.length).toBe(0);
    done();
  });

  it("should subscribe to current clinic and dates when ngOnInit is invoked", (done) => {
    const service: ClinicFlowCacheService = TestBed.get(ClinicFlowCacheService);
    service.setSelectedLocation("location-uuid");
    const m = Moment(new Date());
    const currentDate = m.format("YYYY-MM-DD");
    component.ngOnInit();

    service.getSelectedDate().subscribe(
      (date) => {
        expect(date).toEqual(currentDate);
        done();
      },
      (err) => console.log(err),
      () => console.log("Completed")
    );

    service.getSelectedLocation().subscribe(
      (location) => {
        expect(location).toEqual(["location-uuid"]);
        done();
      },
      (err) => console.log(err),
      () => console.log("Completed")
    );

    expect(component.selectedDate).toEqual(currentDate);
    expect(component.selectedLocation).toEqual(["location-uuid"]);

    spyOn(component, "getClinicFlow").and.callThrough();
    component.getClinicFlow("2017-03-29T12:03:48.190Z", "uuid");
    expect(component.getClinicFlow).toHaveBeenCalled();
    done();
  });

  it(
    "should load clinic flow summary data when getClinicFlow() " +
      " is invoked",
    (done) => {
      component.getClinicFlow("2017-03-29T12:03:48.190Z", "uuid");
      expect(component.averageWaitingTime.averageWaitingTime).toEqual("11.6");
      expect(component.averageWaitingTime.averageVisitCompletionTime).toEqual(
        "32.8"
      );
      expect(component.averageWaitingTime.averageTriageWaitingTime).toEqual(
        "11.7"
      );
      expect(component.averageWaitingTime.averageClinicianWaitingTime).toEqual(
        "11.5"
      );
      expect(component.medianWaitingTime.medianWaitingTime).toEqual("12.0");
      expect(component.medianWaitingTime.medianVisitCompletionTime).toEqual(
        "37.5"
      );
      expect(component.medianWaitingTime.medianTriageWaitingTime).toEqual(
        "9.5"
      );
      expect(component.medianWaitingTime.medianClinicianWaitingTime).toEqual(
        "14.0"
      );
      expect(component.summarydataLoaded).toEqual(true);
      expect(component.incompleteVisitsCount).toEqual(4);
      done();
    }
  );
});
