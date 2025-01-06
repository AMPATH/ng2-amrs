import { Component, OnInit } from '@angular/core';
import { ClinicDashboardCacheService } from '../../services/clinic-dashboard-cache.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { PreAppointmentOutreachResourceService } from 'src/app/etl-api/pre-appointment-outreach-resource.service';
import { getISOWeek } from 'date-fns';

interface ReportParams {
  locationUuids: string;
  yearWeek: string;
  processOutcome: number;
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

  // constants
  private ALL = 'All';
  private FOLLOW_UP_SUCCESSFUL = 'Follow-up Successful';
  private FAILED_FOLLOW_UP_ATTEMPT = 'Failed Follow-up Attempt';
  private NO_FOLLOW_UP_ATTEMPT = 'Follow-up Not Attempted';

  public filterTypeOptions: any[] = [
    this.ALL,
    this.FOLLOW_UP_SUCCESSFUL,
    this.FAILED_FOLLOW_UP_ATTEMPT,
    this.NO_FOLLOW_UP_ATTEMPT
  ];
  public selectedFilterType = 'All'; // defaults to All
  // TODO refactor this later
  public mappedSelectedFilterType = -1;
  public explainedFilterType =
    'All patients predicted to be at either a high or medium risk.';

  constructor(
    private clinicDashboardCacheService: ClinicDashboardCacheService,
    private preAppointmentResourceService: PreAppointmentOutreachResourceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    const today = new Date();
    const currentWeek = getISOWeek(today);
    const currentYear = today.getFullYear();
    const startYear = 2023;
    const numberOfWeeks = 52; // Set the maximum number of weeks to 52

    for (let year = startYear; year <= currentYear; year++) {
      const lastWeek = year === currentYear ? currentWeek : numberOfWeeks;
      for (let weekNumber = 1; weekNumber <= lastWeek; weekNumber++) {
        const weekString = `${year}-W${weekNumber.toString().padStart(2, '0')}`;
        this.weeks.push({
          label: `${year}-W${weekNumber} - From ${this.getStartDate(
            weekString
          )} to ${this.getEndDate(weekString)}`,
          value: weekString
        });
      }
    }
    this.weeks.reverse();

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

  public setSelectedFilterType() {
    switch (this.selectedFilterType) {
      case this.ALL:
        // TODO refactor this later
        this.mappedSelectedFilterType = -1;
        this.explainedFilterType =
          'All patients predicted to be at either a high or medium risk.';
        break;
      case this.FOLLOW_UP_SUCCESSFUL:
        this.mappedSelectedFilterType = 1;
        this.explainedFilterType =
          'Patients who have successfully been contacted/reached';
        break;
      case this.FAILED_FOLLOW_UP_ATTEMPT:
        this.mappedSelectedFilterType = 0;
        this.explainedFilterType =
          'Patient for whom follow-up attempts have been unsuccessful.';
        break;
      case this.NO_FOLLOW_UP_ATTEMPT:
        this.mappedSelectedFilterType = 2;
        this.explainedFilterType =
          'Patients for whom there has been no follow-up attempt.';
        break;
      default:
        this.explainedFilterType = '';
    }
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
        headerName: 'Predicted Score (%)',
        width: 120,
        field: 'predicted_prob_disengage',
        cellRenderer: (column: any) => {
          return (column.value * 100).toFixed(2);
        }
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
        headerName: 'Follow-up Type',
        width: 150,
        field: 'follow_up_type'
      },
      {
        headerName: 'Follow-up Reason',
        width: 150,
        field: 'follow_up_reason'
      },
      {
        headerName: 'Follow-up Success',
        width: 100,
        field: 'was_follow_up_successful',
        cellRenderer: (column: any) => {
          if (column.value === 1) {
            return 'YES';
          } else {
            return 'NO';
          }
        }
      },
      {
        headerName: 'Rescheduled Date',
        width: 100,
        field: 'rescheduled_date'
      },
      {
        headerName: 'No. of Failed Phone Attempts',
        width: 100,
        field: 'number_of_failed_phone_attempts'
      },
      {
        headerName: 'Comments ',
        width: 100,
        field: 'comments'
      },
      {
        headerName: 'SMS outcome ',
        width: 100,
        field: 'sms_delivery_status'
      },
      {
        headerName: 'Contact Reached',
        width: 100,
        field: 'contact_reached'
      },
      {
        headerName: 'Attempted Home Visit',
        width: 100,
        field: 'attempted_home_visit'
      },
      {
        headerName: 'Reason Not Attempted Home Visit',
        width: 100,
        field: 'reason_not_attempted_home_visit'
      },
      {
        headerName: 'Client Found',
        width: 100,
        field: 'was_client_found'
      },
      {
        headerName: 'Reason Client Not Found',
        width: 100,
        field: 'reason_client_not_found'
      },
      {
        headerName: 'Home Visit Personnel',
        width: 100,
        field: 'home_visit_personnel'
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
      yearWeek: this.selectedWeek,
      processOutcome: this.mappedSelectedFilterType
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
                  yearWeek: this.selectedWeek,
                  processOutcome: this.mappedSelectedFilterType
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
}
