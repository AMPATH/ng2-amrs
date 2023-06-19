import { Component, OnInit } from '@angular/core';
import { ClinicDashboardCacheService } from '../../services/clinic-dashboard-cache.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { PreAppointmentOutreachResourceService } from 'src/app/etl-api/pre-appointment-outreach-resource.service';

interface ReportParams {
  locationUuids: string;
  yearWeek: string;
}

@Component({
  selector: 'app-pre-appointment-outreach',
  templateUrl: './pre-appointment-outreach.component.html',
  styleUrls: ['./pre-appointment-outreach.component.css']
})
export class PreAppointmentOutreachComponent implements OnInit {
  public errors: any[] = [];
  public preAppointmentOutreachList: any[] = [];
  public locationUuids: string;
  public params: any;
  public routeSub: Subscription = new Subscription();
  public loadingpreAppointmentOutreachList = false;

  public weeks: any[] = [];
  public selectedWeek: string;
  public selectedFormattedWeek: string;

  constructor(
    private clinicDashboardCacheService: ClinicDashboardCacheService,
    private preAppointmentResourceService: PreAppointmentOutreachResourceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const today = new Date();
    const currentYear = today.getFullYear();
    const numberOfWeeks = 52; // Set the maximum number of weeks to 52

    for (let weekNumber = 1; weekNumber <= numberOfWeeks; weekNumber++) {
      const weekString = `${currentYear}-W${weekNumber
        .toString()
        .padStart(2, '0')}`;
      this.weeks.push({
        label: `${currentYear}-W${weekNumber} - From ${this.getStartDate(
          weekString
        )} to ${this.getEndDate(weekString)}`,
        value: weekString
      });
    }

    const currentWeek = this.getISOWeek(today);
    this.selectedWeek = `${currentYear}-W${currentWeek
      .toString()
      .padStart(2, '0')}`;
    this.setSelectedWeek();
  }

  public ngOnInit() {
    this.subScribeToClinicLocationChange();
    this.subscribeToRouteParamsChange();
  }

  public setSelectedWeek() {
    this.selectedFormattedWeek = this.weeks.find(
      (week) => week.value === this.selectedWeek
    ).label;
  }

  public extraColumns() {
    return [
      {
        headerName: 'Program',
        field: 'program',
        width: 100,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Phone Number',
        field: 'phone_number',
        width: 120,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Predicted Risk',
        width: 120,
        field: 'predicted_risk'
      },
      {
        headerName: 'Prediction Generated Date',
        width: 200,
        field: 'prediction_generated_date'
      },
      {
        headerName: 'Latest Appointment',
        width: 150,
        field: 'last_appointment'
      },
      {
        headerName: 'Rtc Date',
        field: 'rtc_date',
        width: 100,
        cellStyle: {
          'white-space': 'normal'
        }
      },
      {
        headerName: 'Latest RTC Date',
        width: 150,
        field: 'latest_rtc_date'
      },
      {
        headerName: 'Current Regimen',
        width: 200,
        field: 'cur_meds'
      },
      {
        headerName: 'Latest VL',
        width: 100,
        field: 'latest_vl'
      },
      {
        headerName: 'Latest VL Date',
        width: 150,
        field: 'latest_vl_date'
      },
      {
        headerName: 'VL Category',
        width: 150,
        field: 'vl_category'
      },
      {
        headerName: 'COVID-19 Vaccination Status',
        width: 150,
        field: 'covid_19_vaccination_status'
      },
      {
        headerName: 'Nearest Center',
        width: 150,
        field: 'nearest_center'
      }
    ];
  }

  public getReportParams(): ReportParams {
    return {
      locationUuids: this.locationUuids,
      yearWeek: this.selectedWeek
    };
  }

  public generateReport(): void {
    if (this.locationUuids && this.selectedWeek) {
      this.loadingpreAppointmentOutreachList = true;
      this.preAppointmentResourceService
        .getWeeklyPredictionsPatientList(this.getReportParams())
        .subscribe(
          (result: any) => {
            this.loadingpreAppointmentOutreachList = false;
            if (result) {
              this.preAppointmentOutreachList = result;
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: {
                  locationUuids: this.locationUuids,
                  yearWeek: this.selectedWeek
                }
              });
            }
          },
          (error: any) => {
            this.loadingpreAppointmentOutreachList = false;
          }
        );
    }
  }

  public subScribeToClinicLocationChange(): void {
    this.clinicDashboardCacheService
      .getCurrentClinic()
      .subscribe((currentClinic) => {
        this.locationUuids = currentClinic;
        this.generateReport();
      });
  }

  public subscribeToRouteParamsChange(): void {
    this.routeSub = this.route.parent.parent.params.subscribe((params) => {
      this.locationUuids = params['location_uuid'];
      this.clinicDashboardCacheService.setCurrentClinic(
        params['location_uuid']
      );
    });
  }

  public resetFilter($event: Boolean): void {
    if ($event) {
      this.preAppointmentOutreachList = [];
    }
  }

  private getStartDate(week: string): string {
    const year = Number(week.substring(0, 4));
    const weekNumber = Number(week.substring(6));
    const startDate = this.getDateOfISOWeek(year, weekNumber, 1);

    return startDate.toDateString();
  }

  private getEndDate(week: string): string {
    const year = Number(week.substring(0, 4));
    const weekNumber = Number(week.substring(6));
    const endDate = this.getDateOfISOWeek(year, weekNumber, 7);

    return endDate.toDateString();
  }

  private getDateOfISOWeek(year: number, week: number, day: number): Date {
    const januaryFourth = new Date(year, 0, 4);
    const daysToFirstMonday = 1 - januaryFourth.getDay();
    const firstMonday = new Date(year, 0, 4 + daysToFirstMonday);
    return new Date(
      firstMonday.getTime() +
        (week - 1) * 7 * 24 * 60 * 60 * 1000 +
        (day - 1) * 24 * 60 * 60 * 1000
    );
  }

  private getISOWeek(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const daysOffset = firstDayOfYear.getDay() - 1;
    const firstMondayOfYear = new Date(
      firstDayOfYear.getFullYear(),
      0,
      1 + (daysOffset > 0 ? 7 - daysOffset : 0)
    );

    const daysPassed = Math.floor(
      (date.getTime() - firstMondayOfYear.getTime()) / 86400000
    );
    const weeksPassed = Math.floor(daysPassed / 7) + 1;

    return weeksPassed;
  }
}
