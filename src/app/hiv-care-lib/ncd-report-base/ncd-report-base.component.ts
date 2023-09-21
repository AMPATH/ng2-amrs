import { Component, Input, OnInit, Output } from '@angular/core';
import * as Moment from 'moment';
import { NcdReportService } from 'src/app/etl-api/ncd-report.service';
import { ClinicDashboardCacheService } from './../../clinic-dashboard/services/clinic-dashboard-cache.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-ncd-report-base',
  templateUrl: './ncd-report-base.component.html',
  styleUrls: ['./ncd-report-base.component.css']
})
export class NcdReportBaseComponent implements OnInit {
  @Output() public params: any;
  @Input() public locationUuids: '';
  @Input() public dashboardType: string;
  @Input() public analyticlocations = '';
  public indicators: string;
  public selectedIndicators = [];
  public plhivNcdSummaryData: any = [];
  public plhivNcdData: any = [];
  public columnDefs: any = [];
  public reportName = 'PLHIV NCD Report';
  public currentView = 'monthly';
  public currentViewBelow = 'pdf';
  public month: string;
  public encounteredError = false;
  public statusError = false;
  public errorMessage = '';
  public showInfoMessage = false;
  public isLoadingReport = false;
  public reportHead: any;
  public pinnedBottomRowData: any = [];
  public enabledControls = 'monthControl';
  public totalsRow = [];
  _month: string;
  public proxyRetention = 0;

  public netGainLoss = 0;

  public _locationUuids: any = [];

  public startMonth: Date = Moment()
    .subtract(2, 'months')
    .endOf('month')
    .toDate();
  public endMonth: Date = Moment()
    .subtract(1, 'months')
    .endOf('month')
    .toDate();
  public isDraftReport = false;
  public gainsAndLossesSections: any;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public ncdReportService: NcdReportService,
    private clinicDashboardCacheService: ClinicDashboardCacheService
  ) {}

  ngOnInit() {
    this.clinicDashboardCacheService
      .getCurrentClinic()
      .subscribe((currentClinic) => {
        this.locationUuids = currentClinic;
      });
    this.route.queryParams.subscribe(
      (params: any) => {
        if (params) {
          if (params.startingMonth) {
            this.params = params;
            this.startMonth = Moment(params.startingMonth).toDate();
            this.endMonth = Moment(params.endingMonth).toDate();
            this.generateReport();
          }
        }
      },
      (error) => {
        console.error('Error', error);
      }
    );
  }

  public generateReport() {
    this.plhivNcdSummaryData = [];
    this.getNCDReport(this.params);
  }

  public storeParamsInUrl(params) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params
    });
  }

  public getNCDReport(params: any) {
    if (params.locationUuids.length > 0) {
      this.isLoadingReport = true;
      this.isDraftReport = false;
      this.ncdReportService.getNCDReport(params).subscribe((data: any) => {
        console.log('data-plhiv:]]>> ', data);
        // if (data.error) {
        //   this.encounteredError = true;
        //   this.showInfoMessage = true;
        //   this.errorMessage = `There has been an error while loading the report, please retry again`;
        //   this.isLoadingReport = false;
        // } else {
        //   this.isLoadingReport = false;
        //   this.encounteredError = false;
        //   this.showInfoMessage = false;
        //   this.columnDefs = data.sectionDefinitions;
        //   console.log("[>>columnDefs<<]=> ", this.columnDefs)
        //   this.plhivNcdData = data.result;
        //   this.totalsRow = data.resultTotals;
        //   this.plhivNcdSummaryData = data.result[0];
        //   this.proxyRetention = data.proxyRetention;
        //   this.isDraftReport = data.isDraftReport;
        //   this.gainsAndLossesSections = data.gainsAndLossesSections;
        //   this.calculateNetGainLoss(this.plhivNcdSummaryData);
        //   this.plhivNcdSummaryData.startingMonth = Moment(
        //     this.params.startingMonth
        //   ).format('MMMM');
        //   this.plhivNcdSummaryData.endingMonth = Moment(
        //     this.params.endingMonth
        //   ).format('MMMM');
        // }
        if (data) {
          this.isLoadingReport = false;
          this.plhivNcdSummaryData = data;
        }
      });
    }
  }
  public onIndicatorSelected($event: any) {
    this.router.navigate(['patient-list'], {
      relativeTo: this.route,
      queryParams: {
        indicators: $event.value,
        indicatorHeader: $event.header,
        startingMonth: Moment(this.params.startingMonth)
          .endOf('month')
          .format('YYYY-MM-DD'),
        endingMonth: Moment(this.params.endingMonth)
          .endOf('month')
          .format('YYYY-MM-DD'),
        locationUuids:
          $event.location.length > 0
            ? $event.location
            : this.params.locationUuids
      }
    });
  }
  public filterSet($event: any) {
    this.endMonth = $event.endingMonth;
    this.startMonth = $event.startingMonth;
    this.setParams();
    this.storeParamsInUrl(this.params);
  }

  public setParams() {
    this.params = {
      locationUuids: this.locationUuids,
      startingMonth: this.startMonth,
      endingMonth: this.endMonth,
      reportName: this.reportName,
      _date: Moment(this._month).format('DD-MM-YYYY')
    };
  }
  public calculateNetGainLoss(data: any) {
    this.netGainLoss = data.ending_active - data.starting_active;
  }
  public filteReset($event: boolean): void {
    if ($event) {
      this.plhivNcdSummaryData = [];
      this.proxyRetention = 0;
      this.isDraftReport = false;
    }
  }

  public locationsSet($event: any): void {
    this.locationUuids = $event;
  }
}
