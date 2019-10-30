import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import * as Moment from 'moment';
import { take } from 'rxjs/operators';
import { DataAnalyticsDashboardService } from 'src/app/data-analytics-dashboard/services/data-analytics-dashboard.services';
import { ClinicDashboardCacheService } from 'src/app/clinic-dashboard/services/clinic-dashboard-cache.service';

@Component({
  selector: 'app-dqa-report-base',
  templateUrl: './dqa-report-base.component.html',
  styleUrls: ['./dqa-report-base.component.css']
})
export class DqaReportBaseComponent implements OnInit {
  public enabledControls = ' datesControl';
  public _locationUuids: any = [];
  public showPatientList = false;
  public statusError = false;
  public multipleLocation = false;
  public reportName: string;
  public cacheAvailable = false;
  public errorMessage = '';
  public dateName = {
    startDate: 'Visits Start Date *:',
    endDate: 'Visits End Date *'
  };
  private _startDate: Date = new Date('01-01-2018');
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

  constructor(private router: Router, private dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    private clinicDashboardCacheService: ClinicDashboardCacheService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    const cachedParams = this.getDQAReportPatientListParam('DQAReportPatientListParam');
    if (cachedParams) {
      this.cacheAvailable = true;
      this.loadDQAReportPatientListFromCachedParams(cachedParams);
    } else {
      this.route
        .queryParams
        .subscribe((params) => {
          if (params) {
            this.reportName = params.report;
          }
        }, (error) => {
          console.error('Error', error);
        });
    }
    this.route.data.subscribe(url => {
      if (url.multipleLocation) {
        this.multipleLocation = url.multipleLocation;
        this.enabledControls = ' datesControl, locationControl';
      }
    });
  }
  private getDQAReportPatientListParam(key) {
    return this.clinicDashboardCacheService.getByKey(key);
  }
  private loadDQAReportPatientListFromCachedParams(cachedParams) {
    this.navigateToPatientList(cachedParams);
  }
  public generateReport() {
    this.statusError = false;
    this.errorMessage = '';
    if (this.multipleLocation) {
      this.dataAnalyticsDashboardService.getSelectedLocations().pipe(take(1)).subscribe(
        (data) => {
          if (data.locations) {
            this.createParams(this.getSelectedLocations(data.locations));
          } else {
            this.statusError = true;
            this.errorMessage = 'error';
          }
        });
    } else {
      this.route.parent.parent.params.subscribe((params) => {
        this.createParams(params['location_uuid']);
      });
    }
  }
  private getSelectedLocations(locationUuids: Array<any>): string {
    return locationUuids.map(location => location.value).join(',');
  }
  private toDateString(date: Date): string {
    return Moment(date).utcOffset('+03:00').format('YYYY-MM-DD');
  }
  private navigateToPatientList(params) {
    this.showPatientList = true;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: params
    });

  }

  public createParams(locationUuids) {
    if (Moment(this.endDate).isSameOrBefore(Moment(this.startDate))) {
      this.statusError = true;
      return this.errorMessage = 'end date cannot be before or equal to start date';
    }
    const params = {
      locationUuids: locationUuids,
      reportName: this.reportName,
      endDate: this.toDateString(this.endDate),
      startDate: this.toDateString(this.startDate),
      offset: 1,
      limit: 300,

    };
    this.cacheDQAReportPatientListParam(params);
  }
  private cacheDQAReportPatientListParam(params) {
    this.clinicDashboardCacheService.add('DQAReportPatientListParam', params);
    this.navigateToPatientList(params);
  }

}
