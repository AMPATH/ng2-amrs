import { Component, OnInit, Output } from '@angular/core';
import * as _ from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import * as Moment from 'moment';
import { PatientGainLoseResourceService } from 'src/app/etl-api/patient-gain-lose-resource.service';
@Component({
  selector: 'app-patient-gains-and-loses',
  templateUrl: './patient-gains-and-loses.component.html',
  styleUrls: ['./patient-gains-and-loses.component.css']
})
export class PatientGainsAndLosesComponent implements OnInit {
  @Output()
  public params: any;
  public indicators: string;
  public selectedIndicators = [];
  public patientGainAndLoseSummaryData: any = [];
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
  public enabledControls = 'monthIntervalControls';
  _month: string;

  public _locationUuids: any = [];
  public get locationUuids(): Array<string> {
    return this._locationUuids;
  }

  public set locationUuids(v: Array<string>) {
    const locationUuids = [];
    _.each(v, (location: any) => {
      if (location.value) {
        locationUuids.push(location);
      }
    });
    this._locationUuids = locationUuids;
  }
  private _startDate: Date = Moment()
    .subtract(1, 'months')
    .endOf('month')
    .toDate();
  public get startDate(): Date {
    return this._startDate;
  }

  public set startDate(v: Date) {
    this._startDate = v;
  }

  private _endDate: Date = Moment()
    .subtract(1, 'months')
    .endOf('month')
    .toDate();
  public get endDate(): Date {
    return this._endDate;
  }

  public set endDate(v: Date) {
    this._endDate = v;
  }
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public patientGainLose: PatientGainLoseResourceService
  ) {}

  ngOnInit() {}

  public generateReport() {
    console.log(this._startDate);
    console.log(this._endDate);
    this.route.parent.parent.params.subscribe((params: any) => {
      this.storeParamsInUrl(params.location_uuid);
    });
    this.patientGainAndLoseSummaryData = [];
    this.getPatientGainAndLoseReport(this.params);
  }

  public storeParamsInUrl(param) {
    this.params = {
      locationUuids: param,
      startingMonth: Moment(this.startDate).endOf('month').format('YYYY-MM-DD'),
      endingMonth: Moment(this.endDate).endOf('month').format('YYYY-MM-DD'),
      reportName: this.reportName,
      _date: Moment(this._month).format('DD-MM-YYYY')
    };
    // store params in url
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.params
    });
  }

  public getPatientGainAndLoseReport(params) {
    this.isLoadingReport = true;
    this.patientGainLose
      .getPatientGainAndLoseReport(params)
      .subscribe((data) => {
        console.log(data);
        if (data.error) {
          this.encounteredError = true;
          this.showInfoMessage = true;
          this.errorMessage = `There has been an error while loading the report, please retry again`;
          this.isLoadingReport = false;
        } else {
          this.isLoadingReport = false;
          this.encounteredError = false;
          this.showInfoMessage = false;
          this.patientGainAndLoseSummaryData = data.result[0];
          this.patientGainAndLoseSummaryData.startingMonth = Moment(
            this.params.startingMonth
          ).format('MMMM');
          this.patientGainAndLoseSummaryData.endingMonth = Moment(
            this.params.endingMonth
          ).format('MMMM');
        }
      });
  }
  public onIndicatorSelected(value, header) {
    this.router.navigate(['patient-list'], {
      relativeTo: this.route,
      queryParams: {
        indicators: value,
        indicatorHeader: header,
        startingMonth: Moment(this.params.startingMonth)
          .endOf('month')
          .format('YYYY-MM-DD'),
        endingMonth: Moment(this.params.endingMonth)
          .endOf('month')
          .format('YYYY-MM-DD'),
        locationUuids: this.params.locationUuids
      }
    });
  }
}
