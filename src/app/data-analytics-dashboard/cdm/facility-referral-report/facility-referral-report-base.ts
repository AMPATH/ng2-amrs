
import {take} from 'rxjs/operators';
import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import * as Moment from 'moment';
import * as _ from 'lodash';
import {
  DataAnalyticsDashboardService
} from '../../../data-analytics-dashboard/services/data-analytics-dashboard.services';
import {
  CdmIndicatorsResourceService
} from '../../../etl-api/cdm-indicators-resource.service';
import { AppFeatureAnalytics } from '../../../shared/app-analytics/app-feature-analytics.service';

@Component({
  selector: 'facility-referral-report-base',
  templateUrl: './facility-referral-report-base.component.html'
})
export class FacilityReferralBaseComponent implements OnInit {
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
  public reportName = 'facility-referral-report';
  public dates: any;
  public gender: any = [];
  public locationIds: any ;
  // public locationUuids: Array<string>;
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


  constructor(public cdmIndicatorsResourceService: CdmIndicatorsResourceService,
              public dataAnalyticsDashboardService: DataAnalyticsDashboardService, private location: Location,
              protected appFeatureAnalytics: AppFeatureAnalytics, private route: ActivatedRoute, private router: Router ) { }

  public ngOnInit() {
    this.route.parent.parent.parent.params.subscribe((params: any) => {
      this.locationUuids = [];
      if (params.location_uuid) {
        this.locationUuids.push(params.location_uuid);
      }
    });
        this.loadReportParamsFromUrl();
   }

  public getLocationsSelected() {
    this.dataAnalyticsDashboardService.getSelectedMonthlyIndicatorLocations().subscribe(
      (data)  => {
        if (data) {
          this.locationUuids = data.locations;
        }

      });
  }
  public generateReport() {
    this.getLocationsSelected();
    this.storeReportParamsInUrl();
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
    this.cdmIndicatorsResourceService
      .getCdmIndicatorsReport({
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
        this.locationIds = this.locationUuids;
      }, (error) => {
        this.isLoadingReport = false;
        this.errorMessage = error;
        this.encounteredError = true;
      });

  }
  public storeReportParamsInUrl() {
    const path = this.router.parseUrl(this.location.path());
    path.queryParams = {
      'endDate': this.endDate.toUTCString(),
      'startDate': this.startDate.toUTCString(),
      'indicators': this.indicators,
      'gender': this.gender === undefined ? '' : this.gender,
      'startAge': (this.startAge as any),
      'endAge': (this.endAge as any),
      'locationUuids': this.getSelectedLocations(this.locationUuids),
      'view': this.currentView
    };

    this.location.replaceState(path.toString());
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
  public loadReportParamsFromUrl() {
    const path = this.router.parseUrl(this.location.path());
    const pathHasHistoricalValues = path.queryParams['startDate'] &&
      path.queryParams['endDate'];

    if (path.queryParams['startDate']) {
      this.startDate = new Date(path.queryParams['startDate']);
    }

    if (path.queryParams['endDate']) {
      this.endDate = new Date(path.queryParams['endDate']);
    }
    if (path.queryParams['indicators']) {
      this.indicators = path.queryParams['indicators'];
      this.formatIndicatorsToSelectArray(this.indicators);
    }
    if (path.queryParams['gender']) {
      this.gender = (path.queryParams['gender'] as any);
      this.formatGenderToSelectArray(this.gender);
    }
    if (path.queryParams['startAge']) {
      this.startAge = (path.queryParams['startAge'] as any);
    }
    if (path.queryParams['endAge']) {
      this.endAge = (path.queryParams['endAge'] as any);
    }
    if (path.queryParams['view']) {
      this.currentView = path.queryParams['view'];
    }
    if (path.queryParams['locationUuids']) {
      this.locationUuids = path.queryParams['locationUuids'];
    }
    if (pathHasHistoricalValues) {
      this.generateReport();
    }
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
  public formatIndicatorsToSelectArray(indicatorParam: string) {
    const arr = indicatorParam.split(',');
    _.each(arr, (indicator) => {
      const text = this.translateIndicator(indicator);
      const id = indicator;

      const data = {
        value: id,
        label: text
      };
      this.selectedIndicators.push(data);
    });
  }
  public translateIndicator(indicator: string) {
    return indicator.toLowerCase().split('_').map((word) => {
      return (word.charAt(0) + word.slice(1));
    }).join(' ');
  }
  public formatGenderToSelectArray(genderParam: string) {
    const arr = genderParam.split(',');
    _.each(arr, (indicator) => {
      const text = indicator;
      const id = indicator;

      const data = {
        value: id, // indicator
        label: text
      };
      this.selectedGender.push(data);
    });
  }


}
