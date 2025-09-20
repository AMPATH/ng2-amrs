import { Component, OnInit, Input, Output } from '@angular/core';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import * as Moment from 'moment';
import { PatientGainLoseResourceService } from 'src/app/etl-api/patient-gain-lose-resource.service';
import { ClinicDashboardCacheService } from './../../clinic-dashboard/services/clinic-dashboard-cache.service';
@Component({
  selector: 'app-patient-gains-and-loses',
  templateUrl: './patient-gains-and-loses.component.html',
  styleUrls: ['./patient-gains-and-loses.component.css']
})
export class PatientGainsAndLosesComponent implements OnInit {
  @Output() public params: any;
  @Input() public locationUuids: '';
  @Input() public dashboardType: string;
  @Input() public analyticlocations = '';
  public indicators: string;
  public selectedIndicators = [];
  public patientGainAndLoseSummaryData: any = [];
  public patientGainAndLosesData: any = [];
  public columnDefs: any = [];
  public reportName = 'Patient Gains and Loses';
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
  public isAggregated = false;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public patientGainLose: PatientGainLoseResourceService,
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
    this.patientGainAndLoseSummaryData = [];
    this.getPatientGainAndLoseReport(this.params);
  }

  public storeParamsInUrl(params) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params
    });
  }

  public getPatientGainAndLoseReport(params: any) {
    if (params.locationUuids.length > 0) {
      this.isLoadingReport = true;
      this.isDraftReport = false;
      this.patientGainLose
        .getPatientGainAndLoseReport(params)
        .subscribe((data: any) => {
          if (data.error) {
            this.encounteredError = true;
            this.showInfoMessage = true;
            this.errorMessage = `There has been an error while loading the report, please retry again`;
            this.isLoadingReport = false;
          } else {
            this.isLoadingReport = false;
            this.encounteredError = false;
            this.showInfoMessage = false;
            this.patientGainAndLosesData = data.result;
            this.totalsRow = data.resultTotals;
            this.patientGainAndLoseSummaryData = data.result[0];
            this.proxyRetention = data.proxyRetention;
            this.isDraftReport = data.isDraftReport;
            this.gainsAndLossesSections = data.gainsAndLossesSections;
            this.calculateNetGainLoss(this.patientGainAndLoseSummaryData);
            this.patientGainAndLoseSummaryData.startingMonth = Moment(
              this.params.startingMonth
            ).format('MMMM');
            this.patientGainAndLoseSummaryData.endingMonth = Moment(
              this.params.endingMonth
            ).format('MMMM');
          }
        });
    }
  }
  public onIndicatorSelected($event: any) {
    const location = this.params.isAggregated
      ? this.params.locationUuids
      : ($event.location.length > 0
      ? $event.location
      : this.params.locationUuids);

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
        locationUuids: location
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
      _date: Moment(this._month).format('DD-MM-YYYY'),
      isAggregated: this.isAggregated
    };
  }
  public calculateNetGainLoss(data: any) {
    this.netGainLoss = data.ending_active - data.starting_active;
  }
  public filteReset($event: boolean): void {
    if ($event) {
      this.patientGainAndLoseSummaryData = [];
      this.proxyRetention = 0;
      this.isDraftReport = false;
    }
  }

  public locationsSet($event: any): void {
    this.locationUuids = $event;
  }

  public isAggregateSet($event: any): void {
    this.isAggregated = $event;
  }
}
