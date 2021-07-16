import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { ClinicDashboardCacheService } from "./../../services/clinic-dashboard-cache.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "clinic-dashboard-case-management",
  templateUrl: "./clinic-dashboard-case-management.component.html",
  styleUrls: ["./clinic-dashboard-case-management.component.css"],
})
export class ClinicDashboardCaseManagementComponent implements OnInit {
  public title = "Case Management";
  public locationUuids: any = [];
  public routeSub: Subscription = new Subscription();
  public dashboardType = "clinic-dashboard";

  constructor(
    public route: ActivatedRoute,
    private clinicDashboardCacheService: ClinicDashboardCacheService
  ) {}

  public ngOnInit() {
    this.clinicDashboardCacheService
      .getCurrentClinic()
      .subscribe((currentClinic) => {
        this.locationUuids = currentClinic;
      });
    this.routeSub = this.route.parent.parent.params.subscribe((params) => {
      this.locationUuids = params["location_uuid"];
      this.clinicDashboardCacheService.setCurrentClinic(
        params["location_uuid"]
      );
    });
  }
}
