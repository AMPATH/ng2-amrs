import { Component, OnDestroy, OnInit, Input } from "@angular/core";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarMonthViewDay,
} from "angular-calendar";
import { MonthlyScheduleBaseComponent } from "../../../clinic-schedule-lib/monthly-schedule/monthly-schedule.component";
import { SelectDepartmentService } from "./../../../shared/services/select-department.service";
import { ClinicDashboardCacheService } from "../../services/clinic-dashboard-cache.service";
import { AppFeatureAnalytics } from "../../../shared/app-analytics/app-feature-analytics.service";
import { PatientProgramResourceService } from "../../../etl-api/patient-program-resource.service";
import { LocalStorageService } from "../../../utils/local-storage.service";
import { MonthlyScheduleResourceService } from "../../../etl-api/monthly-scheduled-resource.service";
@Component({
  selector: "cdm-monthly-schedule",
  templateUrl:
    "../../../clinic-schedule-lib/monthly-schedule/monthly-schedule.component.html",
})
export class CdmMonthlyScheduleComponent
  extends MonthlyScheduleBaseComponent
  implements OnInit, OnDestroy {
  public routeSub: Subscription = new Subscription();
  public myDepartment = "CDM";

  constructor(
    public monthlyScheduleResourceService: MonthlyScheduleResourceService,
    public clinicDashboardCacheService: ClinicDashboardCacheService,
    public router: Router,
    public route: ActivatedRoute,
    public appFeatureAnalytics: AppFeatureAnalytics,
    public localstorageService: LocalStorageService,
    public patientProgramService: PatientProgramResourceService,
    public selectDepartmentService: SelectDepartmentService
  ) {
    super(
      monthlyScheduleResourceService,
      clinicDashboardCacheService,
      router,
      route,
      appFeatureAnalytics,
      localstorageService,
      patientProgramService
    );
  }

  public ngOnInit() {
    this.selectDepartmentService.setDepartment(this.myDepartment);
    this.routeSub = this.route.parent.parent.params.subscribe((params) => {
      this.clinicDashboardCacheService.setCurrentClinic(
        params["location_uuid"]
      );
    });
  }

  public ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
}
