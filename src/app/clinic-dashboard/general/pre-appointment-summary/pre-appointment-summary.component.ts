import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PreAppointmentOutreachResourceService } from 'src/app/etl-api/pre-appointment-outreach-resource.service';
import { ClinicDashboardCacheService } from '../../services/clinic-dashboard-cache.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

interface ReportParams {
  locationUuids: string;
  year: string;
  month: string;
  startDate: string;
  endDate: string;
}

interface Data {
  high_risk_client: number;
  high_risk_client_contacted: number;
  phone_follow_up: number;
  home_follow_up: number;
  successful_contact_attempts: number;
  successful_contact_attempts_kept_appointment: number;
  successful_contact_attempts_missed_appointment: number;
  unsuccessful_contact_attempts: number;
  no_contact_attempts: number;
  no_contact_attempts_kept_appointment: number;
  rescheduled_appointment: number;
  unsuccessful_kept_appointment: number;
}

interface RowItem {
  Indicators?: string;
  title?: string;
  sub?: string;
  PatientCount?: number;
  Percentage?: number;
  rowSpan?: number;
}

@Component({
  selector: 'app-pre-appointment-summary',
  templateUrl: './pre-appointment-summary.component.html',
  styleUrls: ['./pre-appointment-summary.component.css']
})
export class PreAppointmentSummaryComponent implements OnInit {
  public locationUuids: string;
  public routeSub: Subscription = new Subscription();
  form: FormGroup;
  public loadingpreAppointmentOutreachSummary = false;
  public preAppointmentSummaryList: Data;
  public summaryData: Data;
  public reportName = 'mlMonthlySummary';
  gridApi: any;
  gridColumnApi: any;
  years: number[] = [];
  selectedMonth: string;
  selectedYear: number;
  startDate: any;
  endDate: any;
  firstRow = 0;
  secondRow = 0;
  successfulAttempts = 0;
  unsuccessfulAttempts = 0;
  noContactAttempts = 0;

  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  rowData: RowItem[] = [
    {
      Indicators:
        'Number of patients listed at high risk of missing appointment',
      PatientCount: 0,
      Percentage: 0,
      rowSpan: 1
    },
    {
      Indicators: 'Number of patients whom a contact attempt was made',
      PatientCount: 0,
      Percentage: 0,
      rowSpan: 1
    },
    {
      title:
        'Number and type of contact attempts for patients listed as at high risk of missing appointment'
    },
    {
      sub: 'Number of phone contact attempts',
      PatientCount: 0,
      Percentage: 0,
      rowSpan: 3
    },
    { sub: 'Number of home visit attempts', PatientCount: 0, Percentage: 0 },
    {
      title: 'Contact attempts outcome'
    },
    {
      sub: 'Number of successful contact attempts',
      PatientCount: 0,
      Percentage: 0,
      rowSpan: 4
    },
    {
      sub: 'Number of unsuccessful contact attempts',
      PatientCount: 0,
      Percentage: 0
    },
    {
      sub: 'Number of patients with NO contact attempt',
      PatientCount: 0,
      Percentage: 0
    },
    {
      title: 'Bi-weekly patient appointment outcome'
    },
    {
      sub: 'Number of patients successfully contacted and kept appointment',
      PatientCount: 0,
      Percentage: 0,
      rowSpan: 6
    },
    {
      sub: 'Number of patients successfully contacted but missed appointment',
      PatientCount: 0,
      Percentage: 0
    },
    {
      sub: 'Number of patients successfully contacted and wish to reschedule',
      PatientCount: 0,
      Percentage: 0
    },
    {
      sub: 'Number of patients unsuccessfully contacted but kept appointment',
      PatientCount: 0,
      Percentage: 0
    },
    {
      sub: 'Number of patients with NO contact attempt but kept appointment',
      PatientCount: 0,
      Percentage: 0
    }
  ];

  colDefs = [
    {
      headerName: 'Indicators',
      flex: 2,
      cellRenderer: (params) => {
        if (params.data.title || params.data.Indicators) {
          const text = params.data.title || params.data.Indicators;
          return `<div style="font-weight:600; font-size:13px; ">${text}</div>`;
        }

        if (params.data.sub) {
          return `<div style="padding-left:20px; font-size:13px; color:#444;">${params.data.sub}</div>`;
        }

        return '';
      }
    },
    {
      headerName: 'Patient Count',
      field: 'PatientCount',
      flex: 1,
      cellStyle: { color: 'green', textAlign: 'right' }
    },
    {
      headerName: 'Percentage (%)',
      field: 'Percentage',
      flex: 1,
      valueFormatter: (params) => {
        return params.value != null ? params.value + '%' : '';
      },
      cellStyle: (params) => {
        if (params.value === 100 || params.value === 0) {
          return { color: 'green', fontWeight: 'bold', textAlign: 'right' };
        } else if (params.value != null) {
          return { color: 'red', fontWeight: 'bold', textAlign: 'right' };
        }
        return { textAlign: 'right' };
      }
    }
  ];

  constructor(
    private preAppointmentResourceService: PreAppointmentOutreachResourceService,
    private clinicDashboardCacheService: ClinicDashboardCacheService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.populateYears();
    this.setDefaults();
    this.subscribeToRouteParamsChange();
    this.subScribeToClinicLocationChange();
    this.getSumary();
  }

  populateYears() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 2; i <= currentYear + 5; i++) {
      this.years.push(i);
    }
  }

  setDefaults() {
    const now = new Date();
    const previousMonthIndex = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
    this.selectedMonth = this.months[previousMonthIndex];
    this.selectedYear = now.getFullYear();

    if (now.getMonth() === 0) {
      this.selectedYear = now.getFullYear() - 1;
    }
  }

  getMonthStartAndEnd(year: number, monthIndex: number) {
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0);
    return {
      startDate: startDate.toLocaleDateString('en-CA'),
      endDate: endDate.toLocaleDateString('en-CA')
    };
  }

  public getReportParams(): ReportParams {
    const monthIndex: any = this.months.indexOf(this.selectedMonth) + 1;
    const formattedMonth = monthIndex < 10 ? `0${monthIndex}` : `${monthIndex}`;
    const { startDate, endDate } = this.getMonthStartAndEnd(
      Number(this.selectedYear),
      Number(this.months.indexOf(this.selectedMonth))
    );
    return {
      locationUuids: this.locationUuids,
      year: this.selectedYear.toString(),
      month: formattedMonth,
      startDate,
      endDate
    };
  }

  getSumary() {
    if (this.locationUuids && this.selectedMonth && this.selectedYear) {
      this.loadingpreAppointmentOutreachSummary = true;
      this.preAppointmentResourceService
        .getPreAppointmentSummary(this.getReportParams())
        .subscribe(
          (result: any) => {
            this.loadingpreAppointmentOutreachSummary = false;
            if (result) {
              const flatData = Object.assign({}, ...result);
              this.preAppointmentSummaryList = flatData;
              this.updateRowDataFromApi();
              if (this.gridColumnApi) {
                this.autoSizeFirstTwoColumns(200);
              }
            }
          },
          (error: any) => {
            this.loadingpreAppointmentOutreachSummary = false;
          }
        );
    }
  }

  updateRowDataFromApi(): void {
    if (!this.preAppointmentSummaryList) {
      this.rowData = this.rowData;
      return;
    }

    const indicatorMap: { [key: string]: keyof Data } = {
      'Number of patients listed at high risk of missing appointment':
        'high_risk_client',
      'Number of patients whom a contact attempt was made':
        'high_risk_client_contacted',
      'Number of phone contact attempts': 'phone_follow_up',
      'Number of home visit attempts': 'home_follow_up',
      'Number of successful contact attempts': 'successful_contact_attempts',
      'Number of patients successfully contacted and kept appointment':
        'successful_contact_attempts_kept_appointment',
      'Number of patients successfully contacted but missed appointment':
        'successful_contact_attempts_missed_appointment',
      'Number of unsuccessful contact attempts':
        'unsuccessful_contact_attempts',
      'Number of patients with NO contact attempt': 'no_contact_attempts',
      'Number of patients with NO contact attempt but kept appointment':
        'no_contact_attempts_kept_appointment',
      'Number of patients successfully contacted and wish to reschedule':
        'rescheduled_appointment',
      'Number of patients unsuccessfully contacted but kept appointment':
        'unsuccessful_kept_appointment'
    };

    this.rowData = this.rowData.map((row) => {
      const label = row.sub || row.Indicators;
      const dataKey = indicatorMap[label];

      if (dataKey) {
        const newCount = this.preAppointmentSummaryList[dataKey];
        return {
          ...row,
          PatientCount:
            newCount === undefined || newCount === null ? 0 : newCount
        };
      }

      return row;
    });

    this.firstRow =
      this.rowData && this.rowData[0] && this.rowData[0].PatientCount
        ? this.rowData[0].PatientCount
        : 0;

    // Contact attempts
    this.secondRow =
      this.rowData && this.rowData[1] && this.rowData[1].PatientCount
        ? this.rowData[1].PatientCount
        : 0;

    // Successful attempts
    const successfulRow =
      this.rowData &&
      this.rowData.find(function (r) {
        return (
          (r.sub || r.Indicators) === 'Number of successful contact attempts'
        );
      });

    this.successfulAttempts =
      successfulRow && successfulRow.PatientCount
        ? successfulRow.PatientCount
        : 0;

    // Unsuccessful attempts
    const unsuccessfulRow =
      this.rowData &&
      this.rowData.find(function (r) {
        return (
          (r.sub || r.Indicators) === 'Number of unsuccessful contact attempts'
        );
      });

    this.unsuccessfulAttempts =
      unsuccessfulRow && unsuccessfulRow.PatientCount
        ? unsuccessfulRow.PatientCount
        : 0;

    // No contact attempts
    const noContactRow =
      this.rowData &&
      this.rowData.find(function (r) {
        return (
          (r.sub || r.Indicators) ===
          'Number of patients with NO contact attempt'
        );
      });

    this.noContactAttempts =
      noContactRow && noContactRow.PatientCount ? noContactRow.PatientCount : 0;

    // 3. Calculate percentages
    this.rowData = this.rowData.map((row) => {
      const label = row.sub || row.Indicators;
      let percentage: number | null = null;

      if (
        label ===
        'Number of patients listed at high risk of missing appointment'
      ) {
        percentage = 100;
      } else if (
        label === 'Number of patients whom a contact attempt was made'
      ) {
        percentage =
          this.firstRow > 0 ? (row.PatientCount / this.firstRow) * 100 : null;
      } else if (
        label === 'Number of phone contact attempts' ||
        label === 'Number of home visit attempts' ||
        label === 'Number of successful contact attempts' ||
        label === 'Number of unsuccessful contact attempts'
      ) {
        percentage =
          this.secondRow > 0 ? (row.PatientCount / this.secondRow) * 100 : null;
      } else if (label === 'Number of patients with NO contact attempt') {
        percentage =
          this.firstRow > 0 ? (row.PatientCount / this.firstRow) * 100 : null;
      } else if (
        label ===
          'Number of patients successfully contacted and kept appointment' ||
        label ===
          'Number of patients successfully contacted but missed appointment' ||
        label ===
          'Number of patients successfully contacted and wish to reschedule'
      ) {
        percentage =
          this.successfulAttempts > 0
            ? (row.PatientCount / this.successfulAttempts) * 100
            : null;
      } else if (
        label ===
        'Number of patients unsuccessfully contacted but kept appointment'
      ) {
        percentage =
          this.unsuccessfulAttempts > 0
            ? (row.PatientCount / this.unsuccessfulAttempts) * 100
            : null;
      } else if (
        label ===
        'Number of patients with NO contact attempt but kept appointment'
      ) {
        percentage =
          this.noContactAttempts > 0
            ? (row.PatientCount / this.noContactAttempts) * 100
            : null;
      }

      return {
        ...row,
        Percentage: percentage != null ? Number(percentage.toFixed(1)) : null
      };
    });
  }

  getIndicator(indicatorType: any) {
    let indicator = '';
    switch (indicatorType) {
      case 'Number of patients listed at high risk of missing appointment':
        indicator = 'high_risk_client';
        break;
      case 'Number of patients whom a contact attempt was made':
        indicator = 'high_risk_client_contacted';
        break;
      case 'Number of phone contact attempts':
        indicator = 'phone_follow_up';
        break;
      case 'Number of home visit attempts':
        indicator = 'home_follow_up';
        break;
      case 'Number of successful contact attempts':
        indicator = 'successful_contact_attempts';
        break;
      case 'Number of patients successfully contacted and kept appointment':
        indicator = 'successful_contact_attempts_kept_appointment';
        break;
      case 'Number of patients successfully contacted but missed appointment':
        indicator = 'successful_contact_attempts_missed_appointment';
        break;
      case 'Number of unsuccessful contact attempts':
        indicator = 'unsuccessful_contact_attempts';
        break;
      case 'Number of patients with NO contact attempt':
        indicator = 'no_contact_attempts';
        break;
      case 'Number of patients with NO contact attempt but kept appointment':
        indicator = 'no_contact_attempts_kept_appointment';
        break;
      case 'Number of patients successfully contacted and wish to reschedule':
        indicator = 'rescheduled_appointment';
        break;
      case 'Number of patients unsuccessfully contacted but kept appointment':
        indicator = 'unsuccessful_kept_appointment';
        break;
      default:
        indicator = '';
    }

    return indicator;
  }

  onCellClicked(event: any) {
    const indicator = this.getIndicator(
      event.data.sub ? event.data.sub : event.data.Indicators
    );
    const params = this.getReportParams();
    this.router.navigate(['patient-list'], {
      relativeTo: this.route,
      queryParams: {
        indicators: indicator,
        indicatorHeader: event.data.sub
          ? event.data.sub
          : event.data.Indicators,
        month: params.month,
        startDate: params.startDate,
        endDate: params.endDate,
        reportName: this.reportName,
        locationUuids: params.locationUuids
      }
    });
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }

  private autoSizeFirstTwoColumns(delay = 150): void {
    if (!this.gridColumnApi) {
      return;
    }

    setTimeout(() => {
      try {
        const allCols = this.gridColumnApi.getAllColumns();
        if (!allCols || allCols.length === 0) {
          return;
        }

        const firstTwoIds = allCols
          .slice(0, 2)
          .map((col: any) =>
            col.getColId
              ? col.getColId()
              : col.getId
              ? col.getId()
              : col['colId']
          );

        this.gridColumnApi.autoSizeColumns(firstTwoIds, false);
      } catch (e) {}
    }, delay);
  }

  public subScribeToClinicLocationChange(): void {
    this.clinicDashboardCacheService
      .getCurrentClinic()
      .subscribe((currentClinic) => {
        this.locationUuids = currentClinic;
        this.getSumary();
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
}
