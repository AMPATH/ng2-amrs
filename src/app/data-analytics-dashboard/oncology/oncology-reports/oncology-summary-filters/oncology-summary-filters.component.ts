import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataAnalyticsDashboardService
} from '../../../services/data-analytics-dashboard.services';
import * as Moment from 'moment';
import { AppFeatureAnalytics
} from '../../../../shared/app-analytics/app-feature-analytics.service';
import * as _ from 'lodash';

@Component({
  selector: 'oncology-summary-filters',
  templateUrl: './oncology-summary-filters.component.html',
  styleUrls: ['./oncology-summary-filters.component.css']
})
export class OncologySummaryFiltersComponent implements OnInit, OnChanges {

  public tittle  = 'Filters';
  public data = [];
  public sectionsDef = [];
  public isAggregated: boolean;
  public selectedIndicators  = [];
  public enabledControls = 'datesControl,' +
    'ageControl,genderControl,locationControl';
  public isLoadingReport = false;
  public encounteredError = false;
  public errorMessage = '';
  public reportName = 'oncology-summary-monthly-report';
  public dates: any;
  public age: any;
  @Input() public startDate;
  @Input() public endDate;
  @Input() public reportType = '';
  @Input() public indicators = '';
  @Input() public ageRangeStart: number;
  @Input() public ageRangeEnd: number;
  @Input() public reportIndex: number;
  @Input() public reportUuid: number;
  @Input() public gender: any = [];
  public selectedGender: any = [];
  public locationUuids: Array<string>;
  public monthlySummary: any = [];
  // public gender: Array<string>;

  constructor(
    protected appFeatureAnalytics: AppFeatureAnalytics,
    public dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  public ngOnInit() {
  }
  public ngOnChanges(changes: SimpleChanges) {
    this.processFilterData(changes);

  }

  public getLocationsSelected() {
    this.dataAnalyticsDashboardService.getSelectedMonthlyIndicatorLocations().subscribe(
      (data)  => {
        if (data) {
          this.locationUuids = data.locations;
        }

      });
  }

  public processFilterData(filterChanges: any) {
     if (filterChanges.gender.currentValue) {
          this.formatGenderFilter(filterChanges.gender.currentValue
          );
     }

  }

  public formatGenderFilter(genderArray) {
       const selectedGender = [];
       _.each(genderArray, (gender) => {
           selectedGender.push({
             'label': gender,
             'value':  gender
           });
       });

       this.selectedGender = selectedGender;

  }

  public generateReport() {
    this.isLoadingReport = true;
    this.getLocationsSelected();
    this.storeReportParamsInUrl();
    this.encounteredError = false;
    this.errorMessage = '';
    this.isLoadingReport = false;
  }

  public storeReportParamsInUrl() {
    const urlParams = this.route.snapshot.queryParams;
    const queryParams = {
      'endDate': Moment(this.endDate).format('YYYY-MM-DD'),
      'startDate': Moment(this.startDate).format('YYYY-MM-DD'),
      'indicators': this.indicators,
      'gender': this.gender,
      'startAge': this.ageRangeStart,
      'endAge': this.ageRangeEnd,
      'type': this.reportType,
      'report': urlParams.report,
      'reportIndex': this.reportIndex,
      'reportUuid': this.reportUuid,
      'locationUuids': this.getSelectedLocations(this.locationUuids)
    };

    this.router.navigate(['./'],
    {
      queryParams: queryParams,
      relativeTo: this.route
    });

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
        selectedLocations = selectedLocations + ',' + (locationUuids[i] as any).value;
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

  public getSelectedIndicators(selectedIndicator) {
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
      this.selectedIndicators.push(data.value);
    });
  }

  public translateIndicator(indicator: string) {
    return indicator.toLowerCase().split('_').map((word) => {
      return (word.charAt(0) + word.slice(1));
    }).join(' ');
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

  public getLocations($event) {
  }
}
