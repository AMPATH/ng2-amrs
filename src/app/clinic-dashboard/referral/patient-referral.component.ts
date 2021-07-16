import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Location } from "@angular/common";
import * as _ from "lodash";

import { PatientReferralBaseComponent } from "../../program-manager/program-referral-report-base/patient-referral-report-base.component";
import { PatientReferralResourceService } from "../../etl-api/patient-referral-resource.service";
import { DataAnalyticsDashboardService } from "../../data-analytics-dashboard/services/data-analytics-dashboard.services";
import { LocalStorageService } from "../../utils/local-storage.service";
import { SelectDepartmentService } from "../../shared/services/select-department.service";

@Component({
  selector: "patient-referral-report",
  templateUrl:
    "../../program-manager/program-referral-report-base/patient-referral-report-base.component.html",
})
export class PatientReferralComponent
  extends PatientReferralBaseComponent
  implements OnInit {
  public data = [];
  public sectionsDef = [];
  public programName: any;
  public enabledControls = "datesControl,programsControl";

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    public dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    public localStorageService: LocalStorageService,
    public selectDepartmentService: SelectDepartmentService,
    public patientReferralResourceService: PatientReferralResourceService
  ) {
    super(
      patientReferralResourceService,
      dataAnalyticsDashboardService,
      localStorageService,
      selectDepartmentService
    );
  }

  public ngOnInit() {
    this.route.parent.parent.parent.parent.params.subscribe((params: any) => {
      this.locationUuids = [];
      if (params.location_uuid) {
        const data = {};
        data["value"] = params.location_uuid;
        this.locationUuids.push(data as any);
      }
    });
    this.loadReportParamsFromUrl();
  }
  public test() {}

  public generateReport() {
    this.storeReportParamsInUrl();
    super.generateReport();
  }

  public loadReportParamsFromUrl() {
    const path = this.router.parseUrl(this.location.path());
    const pathHasHistoricalValues =
      path.queryParams["startDate"] && path.queryParams["endDate"];

    if (path.queryParams["startDate"]) {
      this.startDate = new Date(path.queryParams["startDate"]);
    }

    if (path.queryParams["endDate"]) {
      this.endDate = new Date(path.queryParams["endDate"]);
    }

    if (path.queryParams["programUuids"]) {
      this.programs = path.queryParams["programUuids"];
    }

    if (pathHasHistoricalValues) {
      this.generateReport();
    }
  }

  public storeReportParamsInUrl() {
    const path = this.router.parseUrl(this.location.path());
    path.queryParams = {
      endDate: this.endDate.toUTCString(),
      startDate: this.startDate.toUTCString(),
    };

    if (!_.isUndefined(this.programs)) {
      _.extend(path.queryParams, {
        programUuids: this.programs,
      });
    }

    this.location.replaceState(path.toString());
  }

  public translateIndicator(indicator: string) {
    return indicator
      .toLowerCase()
      .split("_")
      .map((word) => {
        return word.charAt(0) + word.slice(1);
      })
      .join(" ");
  }
}
