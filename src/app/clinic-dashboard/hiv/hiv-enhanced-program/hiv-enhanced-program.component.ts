import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as Moment from 'moment';
import { HivEnhancedReportService } from '../../../etl-api/hiv-enhanced-program-report.service';

@Component({
  selector: 'app-hiv-enhanced-program',
  templateUrl: './hiv-enhanced-program.component.html',
  styleUrls: ['./hiv-enhanced-program.component.css']
})
export class HivEnhancedComponent implements OnInit {
  public title = 'HIV Viremia Program Reports';
  public patientData: any;
  public lowerVl: string;
  public upperVl: string;
  public viremiaFilter = 'all';
  public isLoadingPatientList = false;
  public locationUuid = '';
  public indicators;
  public activeTab = {
    not_virally_suppressed_total: true,
    in_enhanced_care: false,
    in_enhanced_care_active: false,
    not_in_enhanced_care: false,
    in_enhanced_care_vl_due: false,
    mdt_form_completed: false
  };
  public viremiaStatus = {
    all: {
      lowerVl: '401',
      upperVl: ''
    },
    lowViremia: {
      lowerVl: '401',
      upperVl: '999'
    },
    highViremia: {
      lowerVl: '1000',
      upperVl: ''
    }
  };

  public sectionTittle: string;

  private _startDate: Date = Moment().subtract(1, 'months').toDate();
  public get startDate(): Date {
    return this._startDate;
  }

  public set startDate(v: Date) {
    this._startDate = v;
    this.onDateChange();
  }

  private _endDate: Date = new Date();
  public get endDate(): Date {
    return this._endDate;
  }

  public set endDate(v: Date) {
    this._endDate = v;
    this.onDateChange();
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private location: Location,
    private hivEnhancedReportService: HivEnhancedReportService
  ) {}

  public ngOnInit() {
    this.route.parent.parent.url.subscribe((url) => {
      this.locationUuid = url[0].path;
    });
    this.loadReportParamsFromUrl();
  }

  public extraColumns() {
    return [
      {
        headerName: 'Phone Number',
        width: 150,
        field: 'phone_number'
      },
      {
        headerName: 'Latest Appointment',
        width: 200,
        field: 'last_appointment_max'
      },
      {
        headerName: 'Latest RTC Date',
        width: 150,
        field: 'latest_rtc_date_max'
      },
      {
        headerName: 'Current Regimen',
        width: 230,
        field: 'cur_arv_meds_max'
      },
      {
        headerName: 'Latest VL',
        width: 85,
        field: 'vl_1_max'
      },
      {
        headerName: 'Latest VL Date',
        width: 150,
        field: 'vl_1_date_max'
      },
      {
        headerName: 'Previous VL',
        width: 85,
        field: 'vl_2_max'
      },
      {
        headerName: 'Previous VL Date',
        width: 150,
        field: 'vl_2_date_max'
      },
      {
        headerName: 'Nearest Center',
        width: 150,
        field: 'nearest_center'
      }
    ];
  }

  public generateReport(indicator, lowerVl = '401', upperVl = '') {
    if (this.lowerVl == null) {
      lowerVl = '401';
      upperVl = '';
    } else {
      lowerVl = this.lowerVl;
      upperVl = this.upperVl;
    }
    this.indicators = indicator;
    this.setActiveTab();
    this.patientData = [];
    this.storeReportParamsInUrl();
    this.isLoadingPatientList = true;
    this.hivEnhancedReportService
      .getPatientList(
        this.toDateString(this.startDate),
        this.toDateString(this.endDate),
        this.locationUuid,
        this.indicators,
        lowerVl,
        upperVl
      )
      .take(1)
      .subscribe(
        (data) => {
          this.patientData = this.sortData(data.results.results);
          this.isLoadingPatientList = false;
        },
        (err) => {
          this.isLoadingPatientList = false;
        }
      );
  }

  public loadReportParamsFromUrl() {
    const path = this.router.parseUrl(this.location.path());
    const pathHasHistoricalValues =
      path.queryParams['startDate'] && path.queryParams['endDate'];

    if (path.queryParams['startDate']) {
      this.startDate = new Date(path.queryParams['startDate']);
    }

    if (path.queryParams['endDate']) {
      this.endDate = new Date(path.queryParams['endDate']);
    }

    if (path.queryParams['indicators']) {
      this.indicators = path.queryParams['indicators'];
    }

    if (path.queryParams['viremiaFilter']) {
      this.viremiaFilter = path.queryParams['viremiaFilter'];
    }

    if (path.queryParams['lowerVl']) {
      this.lowerVl = path.queryParams['lowerVl'];
    }

    if (path.queryParams['upperVl']) {
      this.upperVl = path.queryParams['upperVl'];
    }

    if (pathHasHistoricalValues) {
      this.generateReport(this.indicators, this.lowerVl, this.upperVl);
    } else {
      this.generateReport(
        'not_virally_suppressed_total',
        this.lowerVl,
        this.upperVl
      );
    }
  }

  public storeReportParamsInUrl() {
    const path = this.router.parseUrl(this.location.path());
    path.queryParams = {
      startDate: this.startDate.toUTCString(),
      endDate: this.endDate.toUTCString(),
      indicators: this.indicators,
      viremiaFilter: this.viremiaFilter,
      lowerVl: this.lowerVl,
      upperVl: this.upperVl
    };
    this.location.replaceState(path.toString());
  }

  private toDateString(date: Date): string {
    return Moment(date).utcOffset('+03:00').format();
  }

  private sortData(data) {
    const results = [];

    if (data.length > 0) {
      data.forEach((dt) => {
        if (dt[this.indicators] === 1) {
          results.push(dt);
        }
      });
    }

    return results;
  }

  private onDateChange() {
    this.generateReport(this.indicators, this.lowerVl, this.upperVl);
  }

  private setActiveTab() {
    this.resetTabs();
    const indicator = this.indicators;
    switch (indicator) {
      case 'not_virally_suppressed_total':
        this.activeTab.not_virally_suppressed_total = true;
        // tslint:disable-next-line:max-line-length
        this.sectionTittle =
          'Patients eligible for Viremia Program (VL > 400). Patients enrolled in Viremia and patients eligible but not enrolled';
        break;
      case 'not_virally_suppressed_not_in_enhanced_care':
        this.activeTab.not_in_enhanced_care = true;
        this.sectionTittle =
          'Patients eligible for Viremia Program (VL > 400 but not enrolled)';
        break;
      case 'not_virally_suppressed_in_enhanced_care':
        this.activeTab.in_enhanced_care = true;
        this.sectionTittle =
          'All Patients Enrolled in Viremia Program (VL > 400 and enrolled)';
        break;
      case 'not_virally_suppressed_in_enhanced_care_active':
        this.activeTab.in_enhanced_care_active = true;
        this.sectionTittle =
          'All Patients Enrolled in Viremia Program (VL > 400 and enrolled) and active';
        break;
      case 'not_virally_suppressed_in_enhanced_care_vl_due':
        this.activeTab.in_enhanced_care_vl_due = true;
        this.sectionTittle =
          'Patients enrolled in Viremia Program but have not had a repeat VL result within 3 months of their last VL';
        break;
      case 'mdt_form_completed':
        this.activeTab.mdt_form_completed = true;
        this.sectionTittle =
          'Patients enrolled in Viremia Program who have not had a MDT Form completed within the last 1 month';
        break;
      default:
        break;
    }
  }
  public viremiaFilterChange(option) {
    const viremiaOption = this.viremiaStatus[option];
    if (viremiaOption) {
      this.lowerVl = viremiaOption.lowerVl;
      this.upperVl = viremiaOption.upperVl;
      this.generateReport(this.indicators, this.lowerVl, this.upperVl);
      this.viremiaFilter = option;
      this.storeReportParamsInUrl();
    }
  }

  private resetTabs() {
    this.sectionTittle = '';
    this.activeTab = {
      not_virally_suppressed_total: false,
      in_enhanced_care: false,
      in_enhanced_care_active: false,
      not_in_enhanced_care: false,
      in_enhanced_care_vl_due: false,
      mdt_form_completed: false
    };
  }
}
