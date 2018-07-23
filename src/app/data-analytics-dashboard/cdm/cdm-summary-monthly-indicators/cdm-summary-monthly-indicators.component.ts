import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CdmMonthlySummaryIndicatorsResourceService }
from './../../../etl-api/cdm-monthly-summary-indicators-resource.service';
import { DataAnalyticsDashboardService } from '../../services/data-analytics-dashboard.services';
import * as Moment from 'moment';
import { AppFeatureAnalytics } from './../../../shared/app-analytics/app-feature-analytics.service';
import * as _ from 'lodash';

@Component({
  selector: 'cdm-summary-monthly-indicators',
  styleUrls: ['cdm-summary-monthly-indicators.component.css'],
  templateUrl: 'cdm-summary-monthly-indicators.component.html'
})

export class CdmSummaryMonthlyIndicatorsComponent implements OnInit {
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
  public reportName: string = 'cdm-summary-monthly-report';
  public dates: any;
  public age: any;
  public title: string =  'CDM Summary Monthly Indicators';
  public startDate: Date = Moment().startOf('year').toDate();
  public endDate: Date = Moment().endOf('month').toDate();
  public gender: Array<string>;
  public locationUuids: Array<string>;
  public monthlySummary: any  = [];
  public params: any;

  constructor(
    private cdmMonthlySummaryIndicatorsResourceService: CdmMonthlySummaryIndicatorsResourceService,
    protected appFeatureAnalytics: AppFeatureAnalytics,
    public dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    private route: ActivatedRoute, private location: Location,
    private router: Router
  ) {
  }

  public ngOnInit() {
   console.log('Loaded CdmSummaryMonthlyIndicatorsComponent ...');
   /*
   this.route.parent.parent.parent.params.subscribe((params: any) => {
    this.locationUuids = [];
    if (params.location_uuid) {
      this.locationUuids.push(params.location_uuid);
    }
  });
  */

   this.route
      .queryParams
      .subscribe((params) => {
        this.locationUuids = [];
        if (params) {
             if (params.location_uuid) {
              this.locationUuids.push(params.location_uuid);
            }
             this.params = params;
             console.log('Params', params);
           }
        }, (error) => {
          console.error('Error', error);
       });
   this.loadReportParamsFromUrl();
   this.getLocationsSelected();
  }

  public getLocationsSelected() {
    console.log('LOcations Selected...');
    this.dataAnalyticsDashboardService.getSelectedMonthlyIndicatorLocations().subscribe(
      (data)  => {
        if (data) {
          console.log('LOcations Selected Data...', data);
          this.locationUuids = data.locations;
        }

      });
  }

  public generateReport() {
    this.storeReportParamsInUrl();
    this.getLocationsSelected();
    console.log('Generate report');
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
    this.cdmMonthlySummaryIndicatorsResourceService
      .getCdmSummaryMonthlyIndicatorsReport({
          endDate: Moment(this.endDate).format(),
          gender: this.gender ? this.gender : 'F,M',
          startDate: Moment(this.startDate).format(),
          indicators: this.indicators,
          locationUuids: this.getSelectedLocations(this.locationUuids),
          startAge: this.startAge,
          endAge: this.endAge
       }).subscribe(
      (data) => {
        console.log('getCdmSummaryMonthlyIndicatorsReport', data);
        this.isLoadingReport = false;
        this.monthlySummary = data.result;
        // this.sectionsDef =   data.indicatorDefinitions;
        // this.data =  this.formatDateField(data.result) ;
        this.appFeatureAnalytics
          .trackEvent('CDM monthly indicators', 'CDM monthly indicators report',
            'CDM monthly indicators report generated');

      }, (error) => {
        this.isLoadingReport = false;
        this.errorMessage = error;
        this.encounteredError = true;
      });
  }

  public storeReportParamsInUrl() {
    let path = this.router.parseUrl(this.location.path());
    let queryParams = {
      'endDate': this.endDate.toUTCString(),
      'startDate': this.startDate.toUTCString(),
      'indicators': this.indicators,
      'gender': (this.gender ? this.gender : 'F,M' as any),
      'startAge': (this.startAge as any),
      'endAge': (this.endAge as any),
      'locationUuids': this.getSelectedLocations(this.locationUuids)
    };

    this.router.navigate(['./'],
    {
      queryParams: queryParams,
      relativeTo: this.route
    });

    // this.location.replaceState(path.toString());
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
    let dates = [];
    for (const item of result) {
      let data = item;
      for (let r in data) {
        if (data.hasOwnProperty(r)) {
          let month = Moment(data.month).format('MMM, YYYY');
          data['reporting_month'] = month;
        }
      }
      dates.push(data);
    }
    return dates;

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
          indicators = '' + selectedIndicator[i].value;
        } else {
          indicators = indicators + ',' + selectedIndicator[i].value;
        }
      }
    }
    return this.indicators = indicators;
  }

  public loadReportParamsFromUrl() {
    let path = this.router.parseUrl(this.location.path());
    let pathHasHistoricalValues = path.queryParams['startDate'] &&
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
      this.formatGenderToSelectArray(path.queryParams['gender']);
    }
    if (path.queryParams['startAge']) {
      this.startAge = (path.queryParams['startAge'] as any);
    }
    if (path.queryParams['endAge']) {
      this.endAge = (path.queryParams['endAge'] as any);
    }
    if (pathHasHistoricalValues) {
      this.generateReport();
    }
  }

  public formatIndicatorsToSelectArray(indicatorParam: string) {
    let arr = indicatorParam.split(',');
    _.each(arr, (indicator) => {
      let text = this.translateIndicator(indicator);
      let id = indicator;

      let data = {
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
      let arr = genderParam.split(',');
      _.each(arr, (gender) => {
        let id = gender;
        let text = gender === 'M' ? 'Male' : 'Female';
        let data = {
          id: id,
          text: text
        };
        this.selectedGender.push(data);
      });
    } else {
      let data = {
        id: genderParam,
        text: genderParam === 'M' ? 'Male' : 'Female'
      };
      this.selectedGender.push(data);
    }
  }

  public getLocations($event) {
    console.log('GetLocations', $event);
  }
}
