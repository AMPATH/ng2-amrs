import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";

import { ClinicDashboardCacheService } from "./../../services/clinic-dashboard-cache.service";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-clinic-dashboard-gains-and-losses",
  templateUrl: "./clinic-dashboard-gains-and-losses.component.html",
  styleUrls: ["./clinic-dashboard-gains-and-losses.component.css"],
})
export class ClinicDashboardGainsAndLossesComponent implements OnInit {
  public title = "Gains and Losses";
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
