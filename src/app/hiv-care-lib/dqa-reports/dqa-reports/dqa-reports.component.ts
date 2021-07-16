import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, NavigationEnd } from "@angular/router";
import { ClinicDashboardCacheService } from "src/app/clinic-dashboard/services/clinic-dashboard-cache.service";
import { filter, map, switchMap } from "rxjs/operators";
import { of } from "rxjs";

@Component({
  selector: "app-dqa-reports",
  templateUrl: "./dqa-reports.component.html",
  styleUrls: ["./dqa-reports.component.css"],
})
export class DqaReportsComponent implements OnInit {
  public title = "DQA Report";
  public navigationEnd: any;
  public routePathParam: any;
  public multipleLocation = false;
  public dqaReportTypes: any = require("./dqa-reports.json");
  constructor(
    private router: Router,
    public clinicDashboardCacheService: ClinicDashboardCacheService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((url) => {
      if (url.multipleLocation) {
        this.multipleLocation = url.multipleLocation;
      }
    });
  }

  public navigateToReport(reportName: any) {
    if (this.multipleLocation) {
      this.router.navigate(["dqa-filter"], {
        relativeTo: this.route,
        queryParams: {
          reportId: reportName.id,
        },
      });
    } else {
      this.route.parent.parent.params.subscribe((params) => {
        const locationUuid = params["location_uuid"];
        console.log(locationUuid);
        this.router.navigate(["dqa-report-patientlist"], {
          relativeTo: this.route,
          queryParams: {
            reportId: reportName.id,
            locationUuids: params["location_uuid"],
          },
        });
      });
    }
  }
}
