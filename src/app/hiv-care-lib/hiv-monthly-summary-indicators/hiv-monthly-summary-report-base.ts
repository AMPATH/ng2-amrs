
import {take} from 'rxjs/operators';
import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';

import * as Moment from 'moment';
import {
  DataAnalyticsDashboardService
} from '../../data-analytics-dashboard/services/data-analytics-dashboard.services';
import {
  HivMonthlySummaryIndicatorsResourceService
} from '../../etl-api/hiv-monthly-summary-indicators-resource.service';
import { AppFeatureAnalytics } from '../../shared/app-analytics/app-feature-analytics.service';

@Component({
  selector: 'hiv-monthly-summary-report-base',
  template: 'hiv-monthly-summary-report-base.component.html'
})
export class HivMonthlySummaryIndicatorBaseComponent implements OnInit {
  public data = [];
  public sectionsDef = [];
  public isAggregated: boolean;
  public startAge = 0;
  public endAge = 120;
  public indicators: string ;
  public selectedIndicators  = [];
  public selectedGender = [];
  public enabledControls = 'indicatorsControl,datesControl,' +
    'ageControl,genderControl,locationControl';
  public isLoadingReport = false;
  public encounteredError = false;
  public errorMessage = '';
  public currentView = 'tabular'; // can be pdf or tabular or patientList
  public reportName = 'hiv-summary-monthly-report';
  public dates: any;
  public age: any;
  @Input() public ageRangeStart: number;
  @Input() public ageRangeEnd: number;

  private _startDate: Date = Moment().subtract(1, 'years').startOf('month').toDate();
  public get startDate(): Date {
    return this._startDate;
  }
  public set startDate(v: Date) {
    this._startDate = v;
  }

  private _endDate: Date = new Date();
  public get endDate(): Date {
    return this._endDate;
  }
  public set endDate(v: Date) {
    this._endDate = v;
  }

  private _locationUuids: Array<string>;
  public get locationUuids(): Array<string> {
    return this._locationUuids;
  }
  public set locationUuids(v: Array<string>) {
    this._locationUuids = v;
  }
  private _gender: string;
  public get gender(): string {
    return this._gender;
  }
  public set gender(v: string) {
    this._gender = v;
  }

  constructor(public hivIndicatorsResourceService: HivMonthlySummaryIndicatorsResourceService,
              public dataAnalyticsDashboardService: DataAnalyticsDashboardService,
              protected appFeatureAnalytics: AppFeatureAnalytics) { }

  public ngOnInit() {
    this.appFeatureAnalytics
      .trackEvent('HIV monthly indicators', 'HIV monthly indicators report',
        'HIV monthly indicators report generated');
  }
  public generateReport() {
    // set busy indications variables
    // clear error
    this.dates = {
      startDate: this.startDate,
      endDate: this.endDate
    };
    this.age = {
      startAge: this.startAge,
      endAge: this.endAge
    };
    this.encounteredError = false;
    this.errorMessage = '';
    this.isLoadingReport = true;
    this.hivIndicatorsResourceService
      .getHivSummaryMonthlyIndicatorsReport({
          endDate: this.toDateString(this.endDate),
          gender: this.gender ? this.gender : undefined,
          startDate: this.toDateString(this.startDate),
          indicators: this.indicators,
          locationUuids: this.getSelectedLocations(this.locationUuids),
          startAge: this.startAge,
          endAge: this.endAge
       }).pipe(take(1)).subscribe(
      (data) => {
        this.isLoadingReport = false;
        this.sectionsDef =   data.indicatorDefinitions;
        this.data =  this.formatDateField(data.result) ;
        this.appFeatureAnalytics
          .trackEvent('HIV monthly indicators', 'HIV monthly indicators report',
            'HIV monthly indicators report generated');

      }, (error) => {
        this.isLoadingReport = false;
        this.errorMessage = error;
        this.encounteredError = true;
      });
  }
  public onAgeChangeFinished($event) {
    this.startAge = $event.ageFrom;
    this.endAge = $event.ageTo;
  }
  public getSelectedGender(selectedGender) {
    let gender;
    if (selectedGender) {
      for (let i = 0; i < selectedGender.length; i++) {
        if (i === 0) {
          gender = '' + selectedGender[i].value;
        } else {
          gender = gender + ',' + selectedGender[i].value;
        }
      }
    }
    return this.gender = gender;
  }
  public getSelectedIndicators(selectedIndicator) {
    let indicators;
    if (selectedIndicator) {
      for (let i = 0; i < selectedIndicator.length; i++) {
        if (i === 0) {
          indicators = '' + selectedIndicator[i].value;
        } else {
          indicators = indicators + ',' + selectedIndicator[i].value;
        }
      }
    }
    return this.indicators = indicators;
  }
  public onTabChanged(event) {
    if (event.index === 0) {
      this.currentView = 'tabular';
    }
  }
  private getSelectedLocations(locationUuids: Array<string>): string {
    if (!locationUuids || locationUuids.length === 0) {
      return '';
    }

    let selectedLocations = '';

    for (let i = 0; i < locationUuids.length; i++) {
      if (i === 0) {
        selectedLocations = selectedLocations + (locationUuids[0] as any).value;
      } else {
        selectedLocations = selectedLocations + ',' + (locationUuids[i] as any).value;
      }
    }
    return selectedLocations;
  }

  private toDateString(date: Date): string {
    return Moment(date).utcOffset('+03:00').format();
  }
  private formatDateField(result) {
    const dates = [];
    for (const item of result) {
      const data = item;
      for (const r in data) {
        if (data.hasOwnProperty(r)) {
          const month = Moment(data.month).format('MMM, YYYY');
          data['reporting_month'] = month;
        }
      }
      dates.push(data);
    }
    return dates;

  }

}
