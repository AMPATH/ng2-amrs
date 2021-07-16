import { mergeMap } from "rxjs/operators";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from "lodash";
import { PatientStatusVisualizationResourceService } from "../../../etl-api/patient-status-change-visualization-resource.service";
import { ClinicDashboardCacheService } from "../../services/clinic-dashboard-cache.service";
import { TimerObservable } from "rxjs/observable/TimerObservable";
import { Subscription } from "rxjs";
import * as moment from "moment/moment";

@Component({
  selector: "patient-status-change-list",
  templateUrl: "patient-status-change-list.component.html",
  styleUrls: ["./patient-status-change-visualization.container.component.css"],
})
export class PatientStatusChangeListComponent implements OnInit, OnDestroy {
  public options: any = {
    date_range: true,
  };
  public extraColumns: Array<any> = [
    {
      headerName: "Phone Number",
      width: 150,
      field: "phone_number",
    },
    {
      headerName: "Latest Appointment",
      width: 200,
      field: "last_appointment",
    },
    {
      headerName: "Latest RTC Date",
      width: 150,
      field: "latest_rtc_date",
    },
    {
      headerName: "Current Regimen",
      width: 200,
      field: "cur_meds",
    },
    {
      headerName: "Latest VL",
      width: 75,
      field: "latest_vl",
    },
    {
      headerName: "Latest VL Date",
      width: 150,
      field: "latest_vl_date",
    },
    {
      headerName: "Previous VL",
      width: 75,
      field: "previous_vl",
    },
    {
      headerName: "Previous VL Date",
      width: 150,
      field: "previous_vl_date",
    },
    {
      headerName: "Nearest Center",
      width: 150,
      field: "nearest_center",
    },
  ];

  public columns = [];
  public filterParams: any;
  public startIndex = 0;
  public startDate = new Date();
  public endDate = new Date();
  public data = [];
  public indicator = "";
  public selectedIndicator = "";
  public analysis = "";
  public loading = false;
  public error = false;
  public filterModel: any;
  public dataLoaded = false;
  public overrideColumns: Array<any> = [];
  public progressBarTick = 30;
  private subs: Subscription[] = [];
  private timerSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientStatusResourceService: PatientStatusVisualizationResourceService,
    private clinicDashboardCacheService: ClinicDashboardCacheService
  ) {}

  public ngOnInit() {
    this.startDate = new Date(this.route.snapshot.queryParams["startDate"]);
    this.endDate = new Date(this.route.snapshot.queryParams["endDate"]);
    this.indicator = this.route.snapshot.queryParams["indicator"];
    this.selectedIndicator = this.snakeToTitle(this.indicator);
    this.analysis = this.route.snapshot.queryParams["analysis"];
    this.overrideColumns.push({
      field: "identifiers",
      onCellClicked: (column) => {
        this.redirectTopatientInfo(column.data.patient_uuid);
      },
      cellRenderer: (column) => {
        return (
          '<a href="javascript:void(0);" title="Identifiers">' +
          column.value +
          "</a>"
        );
      },
    });
  }

  public ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  public filtersChanged(event) {
    const params = {};
    this.startDate = new Date(event.startDate.format("YYYY-MM-DD"));
    this.endDate = new Date(event.endDate.format("YYYY-MM-DD"));
    params["startDate"] = event.startDate.format("YYYY-MM-DD");
    params["endDate"] = event.endDate.format("YYYY-MM-DD");
    params["indicator"] = this.indicator;
    params["analysis"] = this.analysis;
    params["startIndex"] = this.startIndex;
    this.filterParams = params;
    this.getPatients();
  }

  public triggerBusyIndicators(
    interval: number,
    show: boolean,
    hasError: boolean = false
  ): void {
    if (show) {
      this.loading = true;
      this.error = false;
      this.progressBarTick = 30;
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
      this.timerSubscription = TimerObservable.create(
        2000 * interval,
        1000 * interval
      ).subscribe((t) => {
        if (this.progressBarTick > 100) {
          this.progressBarTick = 30;
        }
        this.progressBarTick++;
      });
    } else {
      this.error = hasError;
      this.progressBarTick = 100;
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
      }
      this.loading = false;
    }
  }

  private getFilters() {
    const params = {};
    params["startDate"] = moment(this.startDate).format("YYYY-MM-DD");
    params["endDate"] = moment(this.endDate).format("YYYY-MM-DD");
    params["indicator"] = this.indicator;
    params["analysis"] = this.analysis;
    params["startIndex"] = this.startIndex;
    return params;
  }

  private getPatients() {
    this.triggerBusyIndicators(1, true, false);
    const sub = this.clinicDashboardCacheService
      .getCurrentClinic()
      .pipe(
        mergeMap((location) => {
          if (location) {
            this.filterParams = this.getFilters();
            this.filterParams["locationUuids"] = location;
            return this.patientStatusResourceService.getPatientList(
              this.filterParams
            );
          }
          return [];
        })
      )
      .subscribe(
        (results) => {
          const data = this.data
            ? this.data.concat(results.result)
            : results.result;
          this.data = _.uniqBy(data, "patient_uuid");
          this.startIndex += results.result.length;
          this.triggerBusyIndicators(1, false, false);
          if (results.result.length < 300 || results.result.length > 300) {
            this.dataLoaded = true;
          }
        },
        (error) => {
          this.triggerBusyIndicators(1, false, true);
        }
      );

    this.subs.push(sub);
  }

  private snakeToTitle(str) {
    return str
      .split("_")
      .map((item) => {
        return item.charAt(0).toUpperCase() + item.substring(1);
      })
      .join(" ");
  }

  private redirectTopatientInfo(patientUuid) {
    if (patientUuid === undefined || patientUuid === null) {
      return;
    }
    this.router.navigate([
      "/patient-dashboard/patient/" +
        patientUuid +
        "/general/general/landing-page",
    ]);
  }
}
