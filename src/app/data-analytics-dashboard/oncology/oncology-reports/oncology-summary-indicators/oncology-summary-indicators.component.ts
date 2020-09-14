import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  Output
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { take } from 'rxjs/operators';
import * as _ from 'lodash';
import * as Moment from 'moment';

import { OncologySummaryIndicatorsResourceService } from '../../../../etl-api/oncology-summary-indicators-resource.service';
import * as OncologyReportConfig from '../oncology-pdf-reports.json';
import { EventEmitter } from 'events';
@Component({
  selector: 'oncology-summary-indicators-summary',
  templateUrl: './oncology-summary-indicators.component.html',
  styleUrls: ['./oncology-summary-indicators.component.css']
})
export class OncologySummaryIndicatorsComponent
  implements OnInit, AfterViewInit {
  public title = '';
  public monthlySummary: any = [];
  public isPdfReportAvailable = false;
  public params: any;
  public reportType = '';
  public startDate: string = Moment().startOf('year').format('YYYY-MM-DD');
  public endDate: string = Moment().endOf('month').format('YYYY-MM-DD');
  public startAge = 0;
  public endAge = 120;
  public indicators = '';
  public period = 'monthly';
  public specificOncologyReport: any;
  public reportUuid = '';
  public reportIndex = 0;
  public report: any;
  public currentReport: any;
  public gender: any = ['M', 'F'];
  public currentView = 'tabular';
  public busyIndicator: any = {
    busy: false,
    message: 'Please wait...' // default message
  };
  @Output() public selectedTab = new EventEmitter();

  public errorObj = {
    message: '',
    isError: false
  };

  constructor(
    private cd: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
    private oncologySummaryService: OncologySummaryIndicatorsResourceService
  ) {}

  public ngOnInit() {
    this.route.queryParams.subscribe(
      (params) => {
        if (params) {
          this.params = params;

          if (params.startDate) {
            this.reportUuid = params.reportUuid;
            this.setQueryParams();
            this.fetchReport();
          }
          this.setReportData(params);
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
    this.checkIsPdfReportAvailable();
  }

  public ngAfterViewInit() {
    this.cd.detectChanges();
  }

  public checkIsPdfReportAvailable() {
    const reportTypes: Array<any> = [];
    const reports: Array<any> = OncologyReportConfig.reports;
    reports.forEach((report) => {
      if (this.params.type === report.report_type) {
        this.isPdfReportAvailable = true;
      }
      reportTypes.push(report.report_type);
    });
  }

  public setReportData(params: any) {
    this.title = params.report;
    this.reportType = params.type;

    if (params.startDate) {
      this.startDate = params.startDate;
    }

    if (params.endDate) {
      this.endDate = params.endDate;
    }

    if (params.startAge) {
      this.startAge = params.startAge;
    }

    if (params.endAge) {
      this.endAge = params.endAge;
    }

    if (params.period) {
      this.period = params.period;
    }

    this.indicators = params.indicators;

    if (typeof params.gender === 'string') {
      const genderArray = [];
      genderArray.push(params.gender);
      this.gender = genderArray;
    } else {
      this.gender = params.gender;
    }
  }

  public navigateToHome() {
    this.router.navigate(['../'], {
      relativeTo: this.route
    });
  }

  public setQueryParams() {
    this.params = {
      startAge: this.params.startAge,
      endAge: this.params.endAge,
      startDate: this.params.startDate,
      endDate: this.params.endDate,
      gender: this.params.gender,
      period: this.params.period,
      type: this.params.type,
      reportUuid: this.params.reportUuid,
      indicators: this.params.indicators,
      reportIndex: this.reportIndex,
      locationUuids: this.params.locationUuids
    };
  }

  public getQueryParams() {
    this.setQueryParams();
    return this.params;
  }

  public generateReport() {
    this.getQueryParams();
  }

  public fetchReport() {
    this.loading();
    this.oncologySummaryService
      .getOncologySummaryMonthlyIndicatorsReport(this.params)
      .pipe(take(1))
      .subscribe(
        (result) => {
          this.monthlySummary = result.result;
          setTimeout(() => this.endLoading(), 800);
        },
        (err) => {
          this.endLoading();
          this.errorObj = {
            isError: true,
            message: err.error.message ? err.error.message : ''
          };
        }
      );
  }

  public loading() {
    this.busyIndicator = {
      busy: true,
      message: 'Fetching report...please wait'
    };
  }

  public endLoading() {
    this.busyIndicator = {
      busy: false,
      message: ''
    };
  }

  onTabChanged(event) {
    switch (event.index) {
      case 0:
        this.currentView = 'tabular';
        break;
      case 1:
        this.currentView = 'pdf';
        break;
      case 2:
        this.currentView = 'agg-pdf';
        break;
      default:
        this.currentView = 'tabular';
    }
    this.selectedTab.emit(this.currentView);
  }
}
