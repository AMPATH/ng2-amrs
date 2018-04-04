import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';

import * as Moment from 'moment';
import {
  HivSummaryIndicatorsResourceService
} from '../../etl-api/hiv-summary-indicators-resource.service';
import {
  DataAnalyticsDashboardService
} from '../../data-analytics-dashboard/services/data-analytics-dashboard.services';
/*import {
  DataAnalyticsDashboardService
} from '../../data-analytics-dashboard/services/data-analytics.service';*/

@Component({
  selector: 'hiv-summary-report-base',
  template: 'hiv-summary-report-base.component.html'
})
export class HivSummaryIndicatorBaseComponent implements OnInit {
  public data = [];
  public sectionsDef = [];
  public isAggregated: boolean;
  public startAge: number;
  public endAge: number;
  public indicators: string ;
  public selectedIndicators  = [];
  public selectedGender = [];
  public enabledControls = 'indicatorsControl,datesControl,' +
    'ageControl,genderControl,locationControl';
  public isLoadingReport: boolean = false;
  public encounteredError: boolean = false;
  public errorMessage: string = '';
  public currentView: string = 'tabular'; // can be pdf or tabular or patientList
  public reportName: string = 'hiv-summary-report';
  public dates: any;
  public age: any;
  @Input() public ageRangeStart: number;
  @Input() public ageRangeEnd: number;

  private _startDate: Date = Moment().subtract(1, 'months').toDate();
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
  private _gender: Array<string>;
  public get gender(): Array<string> {
    return this._gender;
  }
  public set gender(v: Array<string>) {
    this._gender = v;
  }

  constructor(public hivSummaryIndicatorsResourceService: HivSummaryIndicatorsResourceService,
              public dataAnalyticsDashboardService: DataAnalyticsDashboardService) { }

  public ngOnInit() {}
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
    this.hivSummaryIndicatorsResourceService
      .getHivSummaryIndicatorsReport({
          endDate: this.toDateString(this.endDate),
          gender: this.gender ? this.gender : 'F,M',
          startDate: this.toDateString(this.startDate),
          indicators: this.indicators,
          locationUuids: this.getSelectedLocations(this.locationUuids),
          startAge: this.startAge,
          endAge: this.endAge
       }).subscribe(
      (data) => {
        this.isLoadingReport = false;
        this.sectionsDef =   data.indicatorDefinitions;

        this.data = data.result;
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
          gender = '' + selectedGender[i];
        } else {
          gender = gender + ',' + selectedGender[i];
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
          indicators = '' + selectedIndicator[i];
        } else {
          indicators = indicators + ',' + selectedIndicator[i];
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
        selectedLocations = selectedLocations + locationUuids[0];
      } else {
        selectedLocations = selectedLocations + ',' + locationUuids[i];
      }
    }
    return selectedLocations;
  }

  private toDateString(date: Date): string {
    return Moment(date).utcOffset('+03:00').format();
  }

}
