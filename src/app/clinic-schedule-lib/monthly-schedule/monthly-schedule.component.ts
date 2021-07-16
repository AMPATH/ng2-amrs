import { Component, OnDestroy, OnInit, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { DatePipe } from "@angular/common";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay,
} from "angular-calendar";
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  startOfMonth,
} from "date-fns";
import { IMyOptions, IMyDateModel } from "ngx-mydatepicker";
import * as Moment from "moment";
import { MonthlyScheduleResourceService } from "../../etl-api/monthly-scheduled-resource.service";
import { ClinicDashboardCacheService } from "../../clinic-dashboard/services/clinic-dashboard-cache.service";
import { AppFeatureAnalytics } from "../../shared/app-analytics/app-feature-analytics.service";
import * as _ from "lodash";
import { PatientProgramResourceService } from "../../etl-api/patient-program-resource.service";
import { LocalStorageService } from "../../utils/local-storage.service";
import { take } from "rxjs/operators";
const colors: any = {
  red: {
    primary: "#ad2121",
    secondary: "#FAE3E3",
  },
  blue: {
    primary: "#1e90ff",
    secondary: "#D1E8FF",
  },
  yellow: {
    primary: "#F0AD4E",
    secondary: "#FDF1BA",
  },
  green: {
    primary: "#5CB85C",
    secondary: "#FDF1BA",
  },
};
@Component({
  selector: "app-monthly-schedule",
  templateUrl: "./monthly-schedule.component.html",
  styleUrls: ["./monthly-schedule.component.css"],
})
export class MonthlyScheduleBaseComponent implements OnInit, OnDestroy {
  public viewDate = Moment().format("MMMM YYYY");
  public view = "month";
  public filter: any = {
    programType: [],
    visitType: [],
    encounterType: [],
  };
  public busyIndicator: any = {
    busy: false,
    message: "Please wait...", // default message
  };
  public params: any;
  public events: CalendarEvent[] = [];
  public activeDayIsOpen = false;
  public location = "";
  public busy: Subscription;
  public fetchError = false;
  public programVisitsEncounters: any = [];
  public encounterTypes: any[];
  public monthControl = true;
  public trackEncounterTypes: any = [];
  private subs: Subscription[] = [];
  private _datePipe: DatePipe;

  constructor(
    public monthlyScheduleResourceService: MonthlyScheduleResourceService,
    public clinicDashboardCacheService: ClinicDashboardCacheService,
    public router: Router,
    public _route: ActivatedRoute,
    public appFeatureAnalytics: AppFeatureAnalytics,
    public _localstorageService: LocalStorageService,
    public _patientProgramService: PatientProgramResourceService
  ) {}

  public ngOnInit() {
    this.getCurrentLocation();
    // this.getAppointments();
  }

  public getParams() {}

  public ngOnDestroy(): void {
    this.subs.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  public filterSelected($event: any) {
    this.getCurrentLocation();
    this.params = $event;
    if ($event.resetFilter && $event.resetFilter === true) {
      this.events = [];
    } else {
      this.getAppointments();
    }
  }

  public getCurrentLocation() {
    const sub = this.clinicDashboardCacheService
      .getCurrentClinic()
      .pipe(take(1))
      .subscribe((location) => {
        this.location = location;
        const params = this.params;
        if (params && params.hasOwnProperty("programType")) {
          this.getAppointments();
        }
      });
    this.subs.push(sub);
  }

  public navigateToMonth() {
    const date = this.viewDate;
    this.viewDate = Moment().format("YYYY-MM");
    this.router.navigate(["./"], {
      queryParams: { date: date },
      relativeTo: this._route,
    });
    this.getAppointments();
  }

  public getAppointments() {
    this.fetchError = false;
    this.setBusy();
    this.viewDate = Moment(this.params.startDate, "YYYY-MM-DD").format(
      "MMMM YYYY"
    );
    this.monthlyScheduleResourceService
      .getMonthlySchedule({
        endDate: this.params.endDate,
        startDate: this.params.startDate,
        department: this.params.department,
        programType: this.params.programType,
        visitType: this.params.visitType,
        encounterType: this.params.encounterType,
        locationUuids: this.location,
        limit: 10000,
      })
      .pipe(take(1))
      .subscribe(
        (results) => {
          this.events = this.processEvents(results);
          this.setFree();
        },
        (error) => {
          this.fetchError = true;
          this.setFree();
        }
      );
  }

  public beforeMonthViewRender(days: CalendarMonthViewDay[]): void {
    if (_.isArray(days)) {
      days.forEach((day) => {
        day.badgeTotal = 0;
      });
    }
  }

  public navigateToDaily(event) {
    const scheduleDate = Moment(event.start).format("YYYY-MM-DD");
    const params: any = {};
    const currentQueryParams: any = this._route.snapshot.queryParams;
    // only key to be changed is endDate which is readonly in queryparams
    Object.keys(currentQueryParams).forEach((key) => {
      if (key === "startDate") {
        params["startDate"] = scheduleDate;
      } else if (key === "endDate") {
        params["endDate"] = scheduleDate;
      } else {
        params[key] = currentQueryParams[key];
      }
    });
    let link = "";

    switch (event.type) {
      case "scheduled":
        link = "daily-appointments";
        break;
      case "attended":
        link = "daily-visits";
        break;
      case "has_not_returned":
        link = "daily-not-returned";
        break;
      default:
    }

    this.router.navigate(["../daily-schedule/" + link], {
      queryParams: params,
      relativeTo: this._route,
    });
  }

  public processEvents(results) {
    const processed = [];
    for (const e of results) {
      /* tslint:disable forin*/
      for (const key in e.count) {
        switch (key) {
          case "scheduled":
            processed.push({
              start: new Date(e.date),
              type: "scheduled",
              title: e.count[key],
              color: colors.blue,
              class: "label label-info",
            });
            break;
          case "attended":
            processed.push({
              start: new Date(e.date),
              title: e.count[key],
              color: colors.green,
              type: "attended",
              class: "label label-success",
            });
            break;
          case "has_not_returned":
            if (e.count[key] > 0) {
              processed.push({
                start: new Date(e.date),
                title: e.count[key],
                color: colors.yellow,
                type: "has_not_returned",
                class: "label label-warning",
              });
            }
            break;
          default:
        }
      }
      /* tslint:enable */
    }
    return processed;
  }

  public dayClicked({
    date,
    events,
  }: {
    date: Date;
    events: CalendarEvent[];
  }): void {}

  public dateChanged(event) {
    this.viewDate = event;
    this.navigateToMonth();
  }

  public setBusy() {
    this.busyIndicator = {
      busy: true,
      message: "Please wait...Loading",
    };
  }
  public setFree() {
    this.busyIndicator = {
      busy: false,
      message: "",
    };
  }
}
