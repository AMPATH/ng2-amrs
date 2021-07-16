import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import * as _ from "lodash";
import { take } from "rxjs/operators";
import { DataAnalyticsDashboardService } from "src/app/data-analytics-dashboard/services/data-analytics-dashboard.services";

@Component({
  selector: "app-dqa-report-base",
  templateUrl: "./dqa-report-base.component.html",
  styleUrls: ["./dqa-report-base.component.css"],
})
export class DqaReportBaseComponent implements OnInit {
  public enabledControls = "locationControl";
  public _locationUuids: any = [];
  public showPatientList = false;
  public showInfoMessage = false;
  public get locationUuids(): Array<string> {
    return this._locationUuids;
  }

  public set locationUuids(v: Array<string>) {
    const locationUuids = [];
    _.each(v, (location: any) => {
      if (location.value) {
        locationUuids.push(location);
      }
    });
    this._locationUuids = locationUuids;
  }
  constructor(
    private router: Router,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}
  public generateReport() {
    this.dataAnalyticsDashboardService
      .getSelectedLocations()
      .pipe(take(1))
      .subscribe((data) => {
        if (data) {
          console.log(data);
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
              locationUuids: this.getSelectedLocations(data.locations),
            },
          });
          this.showPatientList = true;
        }
      });
  }
  private getSelectedLocations(locationUuids: Array<any>): string {
    return locationUuids.map((location) => location.value).join(",");
  }
}
