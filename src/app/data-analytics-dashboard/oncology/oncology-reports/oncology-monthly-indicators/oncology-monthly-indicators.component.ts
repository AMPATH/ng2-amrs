import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { OncologyReportService } from '../../../../etl-api/oncology-reports.service';
import { Router, ActivatedRoute } from '@angular/router';
import { OncolgyMonthlySummaryIndicatorsResourceService }
from '../../../../etl-api/oncology-summary-indicators-resource.service';
import * as Moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'oncology-monthly-indicators-summary',
  templateUrl: './oncology-monthly-indicators.component.html',
  styleUrls: ['./oncology-monthly-indicators.component.css']
})
export class OncologyMonthlyIndicatorSummaryComponent implements OnInit, AfterViewInit {

  public tittle: string  = '';
  public monthlySummary: any = [];
  public params: any;
  public reportType: string = '';
  public startDate: string = Moment().startOf('year').format('YYYY-MM-DD');
  public endDate: string = Moment().endOf('month').format('YYYY-MM-DD');
  public startAge: number = 0;
  public endAge: number = 120;
  public indicators: string = '';
  public specificOncologyReport: any;
  public reportUuid: string = '';
  public reportIndex: number = 0;
  public report: any;
  public currentReport: any;
  public gender: any = ['M', 'F'];
  public busyIndicator: any = {
    busy: false,
    message: 'Please wait...' // default message
  };

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _oncologySummaryService: OncolgyMonthlySummaryIndicatorsResourceService,
    private _oncologyReportService: OncologyReportService,
    private _cd: ChangeDetectorRef
  ) {
  }

  public ngOnInit() {
     this._route
     .queryParams
     .subscribe((params) => {
       if (params) {
            this.params = params;
            if (params.startDate) {

              this.reportUuid = params.reportUuid;
              this.setQueryParams();
              this.fetchReport();

            }
            this.setReportData(params);
          }
      }, (error) => {
         console.error('Error', error);
      });
  }
 public ngAfterViewInit() {
    this._cd.detectChanges();
  }

  public setReportData(params: any) {
       this.tittle = params.report;
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
       this.indicators = params.indicators;

       if (typeof params.gender === 'string') {
            let genderArray = [];
            genderArray.push(params.gender);
            this.gender = genderArray;
       }else {
        this.gender = params.gender;
       }

  }

  public navigateToHome() {
    this._router.navigate(['../']
    , {
       relativeTo: this._route,
      }
     );

  }

  public setQueryParams() {

    this.params = {
      'startAge': this.params.startAge,
      'endAge': this.params.endAge,
      'startDate': this.params.startDate,
      'endDate': this.params.endDate,
      'gender': this.params.gender,
      'type': this.params.type,
      'reportUuid': this.params.reportUuid,
      'indicators' : this.params.indicators,
      'reportIndex': this.reportIndex,
      'locationUuids': this.params.locationUuids
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
    this._oncologySummaryService.getOncologySummaryMonthlyIndicatorsReport(this.params)
    .subscribe((result) => {
      this.monthlySummary = result.result;
      this.endLoading();
    });

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
}
