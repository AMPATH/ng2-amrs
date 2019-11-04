import { Component, OnInit , Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataAnalyticsDashboardService } from './../../data-analytics-dashboard/services/data-analytics-dashboard.services';
import { ClinicDashboardCacheService } from './../../clinic-dashboard/services/clinic-dashboard-cache.service';
import * as _ from 'lodash';
import * as Moment from 'moment';

@Component({
    selector: 'retention-report-filters',
    templateUrl: './retention-report-filters.component.html',
    styleUrls: ['./retention-report-filters.component.css']
})

export class RetentionReportFiltersComponent implements OnInit {

public title = 'Retention Report Filters';
public enabledControls = 'datesControl,' +
    'ageControl,genderControl';
public selectedIndicators  = [];
@Input() public startDate = Moment().startOf('week').toISOString();
@Input() public endDate  = Moment().endOf('week').toISOString();
@Input() public reportType = '';
@Input() public indicators = '';
@Input() public ageRangeStart: number;
@Input() public ageRangeEnd: number;
@Input() public reportIndex: number;
@Input() public reportUuid: number;
@Input() public period = '';
@Input() public gender: any = [];
@Input() public dashboardType = '';
@Input() public params: any;
public selectedGender: any = [];
public locationUuids: Array<string>;
public isLoadingReport = false;
public reportName = 'retention-report';
public errorObj = {
'isError': false,
'message': ''
};
public validParams = true;


constructor( private router: Router,
    private route: ActivatedRoute,
    public dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    private clinicDashboardCacheService: ClinicDashboardCacheService) {
}

public ngOnInit() {
  this.setControls();
  this.setParamsFromUrl();
}

public setControls() {

   const dashboardType = this.dashboardType;
    switch (dashboardType) {
      case 'clinic-dashboard':
      this.enabledControls = 'datesControl,ageControl,genderControl';
      break;
   case 'analytics-dashboard':
      this.enabledControls = 'datesControl,ageControl,genderControl,locationsControl';
       break;
    default:
      break;

    }

}

public setParamsFromUrl() {
    if (this.params.startDate && this.params.endDate) {
       this.startDate = Moment(this.params.startDate).toISOString();
       this.endDate = Moment(this.params.endDate).toISOString();
       this.ageRangeStart = this.params.startAge;
       this.ageRangeEnd = this.params.endAge;
    }
}


  public processFilterData(filterChanges: any) {
     if (filterChanges.gender.currentValue) {
          this.formatGenderFilter(filterChanges.gender.currentValue
          );
     }
  }

  public getLocationsSelected() {
    this.dataAnalyticsDashboardService.getSelectedMonthlyIndicatorLocations().subscribe(
      (data)  => {
        if (data) {
          this.locationUuids = data.locations;
        }

      });
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

  public selectedPeriodChange($event) {
    this.period = $event;
  }

  public generateReport() {
    this.resetErrorObj();
    this.validateParams();
    if (this.validParams) {
      this.getLocationsSelected();
      this.storeReportParamsInUrl();
    }
  }

  public validateParams() {

    switch (this.reportType) {
      case 'weekly':
       this.validateWeekRange();
      break;
      default:

    }

  }

  public validateWeekRange() {
     const startDate = Moment(this.startDate);
     const endDate = Moment(this.endDate);
     const diff = endDate.diff(startDate, 'days');
     if (diff > 7) {

        this.errorObj = {
        'isError': true,
        'message': 'For daily data, ensure date range is 7 days or less'
        };

        this.validParams = false;

     } else {

       this.validParams = true;
     }

  }

  public resetErrorObj() {
    this.errorObj = {
      'isError': false,
      'message': ''
      };
  }

  public storeReportParamsInUrl() {
    const urlParams = this.route.snapshot.queryParams;
    const queryParams = {
      'endDate': Moment(this.endDate).format('YYYY-MM-DD'),
      'startDate': Moment(this.startDate).format('YYYY-MM-DD'),
      'indicators': this.indicators,
      'gender': this.gender,
      'period': this.period,
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
