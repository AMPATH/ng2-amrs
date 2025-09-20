import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import * as Moment from 'moment';

import { AppFeatureAnalytics } from './../../../shared/app-analytics/app-feature-analytics.service';
import { DataAnalyticsDashboardService } from './../../../data-analytics-dashboard/services/data-analytics-dashboard.services';

@Component({
  selector: 'app-moh-412-filter',
  templateUrl: './moh-412-filter.component.html',
  styleUrls: ['./moh-412-filter.component.css']
})
export class MOH412FilterComponent implements OnInit, OnChanges {
  @Input() public startDate = Moment().startOf('month').format('YYYY-MM-DD');
  @Input() public endDate = Moment().endOf('month').format('YYYY-MM-DD');
  @Input() public reportType = '';
  @Input() public indicators = '';
  @Input() public ageRangeStart: number;
  @Input() public ageRangeEnd: number;
  @Input() public reportIndex: number;
  @Input() public reportUuid: number;
  @Input() public period = '';
  @Input() public gender: any = [];
  @Input() public dashboardType = '';
  @Input() public dashboardLocation = [];
  @Input() public currentView = 'pdf';
  public title = 'Filters';
  public data = [];
  public sectionsDef = [];
  public isAggregated = false;
  public selectedIndicators = [];
  public enabledControls = 'monthControl,locationControl,locationTypeControl';
  public isLoadingReport = false;
  public encounteredError = false;
  public errorMessage = '';
  public reportName = 'moh-412-report';
  public dates: any;
  public age: any;
  public selectedGender: any = [];
  public selectedLocationType = '';
  public locationUuids: Array<string>;
  public monthlySummary: any = [];
  public errorObj = {
    message: '',
    isError: false
  };

  constructor(
    protected appFeatureAnalytics: AppFeatureAnalytics,
    public dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  public ngOnInit() {}

  public ngOnChanges(changes: SimpleChanges) {
    this.processFilterData(changes);
  }

  public getLocationsSelected() {
    this.dataAnalyticsDashboardService
      .getSelectedLocations()
      .subscribe((data) => {
        if (data) {
          this.locationUuids = data.locations;
        }
      });
  }

  public processFilterData(filterChanges: any) {
    if (filterChanges.gender !== undefined) {
      if (filterChanges.gender.currentValue !== undefined) {
        this.formatGenderFilter(filterChanges.gender.currentValue);
      }
    }
    if (filterChanges.dashboardType !== undefined) {
      if (filterChanges.dashboardType.currentValue !== undefined) {
        this.toggleFilterControls(filterChanges.dashboardType.currentValue);
      }
    }
    if (filterChanges.dashboardLocation !== undefined) {
      if (
        filterChanges.dashboardLocation.currentValue !== undefined &&
        filterChanges.dashboardLocation.previousValue !== undefined
      ) {
        this.generateReport();
      }
    }
    if (filterChanges.currentView !== undefined) {
      if (
        filterChanges.currentView.currentValue !== undefined &&
        filterChanges.currentView.previousValue !== undefined
      ) {
        this.generateReport();
      }
    }
  }

  public formatGenderFilter(genderArray) {
    const selectedGender = [];
    _.each(genderArray, (gender) => {
      selectedGender.push({
        label: gender,
        value: gender
      });
    });
    this.selectedGender = selectedGender;
  }

  public selectedPeriodChange($event) {
    this.period = $event;
  }

  public generateReport() {
    this.isLoadingReport = true;
    this.getLocationsSelected();
    this.setIsAggregated();
    this.storeReportParamsInUrl();
    this.encounteredError = false;
    this.errorMessage = '';
    this.isLoadingReport = false;
  }

  public storeReportParamsInUrl() {
    const urlParams = this.route.snapshot.queryParams;
    const queryParams = {
      endDate: Moment(this.endDate).format('YYYY-MM-DD'),
      startDate: Moment(this.startDate).format('YYYY-MM-DD'),
      locationType: this.selectedLocationType,
      indicators: this.indicators,
      gender: this.gender,
      period: this.period,
      startAge: this.ageRangeStart,
      endAge: this.ageRangeEnd,
      type: this.reportType,
      report: urlParams.report,
      currentView: this.currentView,
      reportIndex: this.reportIndex,
      reportUuid: this.reportUuid,
      locationUuids: this.getDashboardOrAnnalyticsLocation(this.dashboardType),
      isAggregated: this.isAggregated
    };

    this.router.navigate(['./'], {
      queryParams: queryParams,
      relativeTo: this.route
    });
  }

  public getDashboardOrAnnalyticsLocation(dashboardType: string) {
    let location: any;
    switch (dashboardType) {
      case 'clinic-dashboard':
        location = this.dashboardLocation;
        break;
      case 'data-analytics':
        location = this.getSelectedLocations(this.locationUuids);
        break;
      default:
        location = this.getSelectedLocations(this.locationUuids);
    }

    return location;
  }

  public getSelectedLocations(locationUuids: Array<string>): string {
    if (!locationUuids || locationUuids.length === 0) {
      return '';
    }

    let selectedLocations = '';

    for (let i = 0; i < locationUuids.length; i++) {
      if (i === 0) {
        selectedLocations = selectedLocations + (locationUuids[0] as any).value;
      } else {
        selectedLocations =
          selectedLocations + ',' + (locationUuids[i] as any).value;
      }
    }
    return selectedLocations;
  }

  public formatDateField(result) {
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
  public onAgeChangeFinished($event) {
    this.ageRangeStart = $event.ageFrom;
    this.ageRangeEnd = $event.ageTo;
  }

  public getSelectedGender(selectedGender) {
    const gender: any = [];
    _.each(selectedGender, (specGender: any) => {
      if (typeof specGender === 'string') {
        gender.push(specGender);
      } else {
        gender.push(specGender.value);
      }
    });
    this.gender = gender;
  }

  public getSelectedIndicators(selectedIndicator) {}

  public formatIndicatorsToSelectArray(indicatorParam: string) {
    const arr = indicatorParam.split(',');
    _.each(arr, (indicator) => {
      const text = this.translateIndicator(indicator);
      const id = indicator;

      const data = {
        value: id,
        label: text
      };
      this.selectedIndicators.push(data.value);
    });
  }

  public translateIndicator(indicator: string) {
    return indicator
      .toLowerCase()
      .split('_')
      .map((word) => {
        return word.charAt(0) + word.slice(1);
      })
      .join(' ');
  }

  public formatGenderToSelectArray(genderParam: string) {
    if (genderParam.length > 1) {
      const arr = genderParam.split(',');
      _.each(arr, (gender) => {
        const id = gender;
        const text = gender === 'M' ? 'Male' : 'Female';
        const data = {
          id: id,
          text: text
        };
        this.selectedGender.push(data);
      });
    } else {
      const data = {
        id: genderParam,
        text: genderParam === 'M' ? 'Male' : 'Female'
      };
      this.selectedGender.push(data);
    }
  }

  public getLocations($event) {}
  public onMonthChange($event) {
    this.startDate = Moment($event).startOf('month').format('YYYY-MM-DD');
    this.endDate = Moment($event).endOf('month').format('YYYY-MM-DD');
  }
  public toggleFilterControls(dashboardType: string) {
    if (dashboardType === 'data-analytics') {
      this.enabledControls = 'monthControl,locationControl,locationTypeControl';
    } else if (dashboardType === 'clinic-dashboard') {
      this.enabledControls = 'monthControl,locationTypeControl';
    } else {
      this.enabledControls = 'monthControl,locationControl,locationTypeControl';
    }
  }
  public locationTypeChange($event) {
    this.selectedLocationType = $event;
  }

  public setIsAggregated() {
    this.dataAnalyticsDashboardService
      .getIsAggregated()
      .pipe()
      .subscribe((data) => {
        if(data) {
          this.isAggregated = data.isAggregated;
        }
      });
  }
}
