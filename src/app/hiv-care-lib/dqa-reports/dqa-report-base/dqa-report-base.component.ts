import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as Moment from 'moment';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { DataAnalyticsDashboardService } from 'src/app/data-analytics-dashboard/services/data-analytics-dashboard.services';

@Component({
  selector: 'app-dqa-report-base',
  templateUrl: './dqa-report-base.component.html',
  styleUrls: ['./dqa-report-base.component.css']
})
export class DqaReportBaseComponent implements OnInit {
  public enabledControls =
    'locationControl,datesControl,patientTypeControl,sampleSizeControl';
  public _locationUuids: any = [];
  public showPatientList = false;
  public showInfoMessage = false;
  public selectedPatientType = '';
  public selectedSampleSize = '';
  private _startDate: Date = Moment().subtract(1, 'month').toDate();
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
  constructor(
    private router: Router,
    private dataAnalyticsDashboardService: DataAnalyticsDashboardService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {}
  public generateReport() {
    this.dataAnalyticsDashboardService
      .getSelectedLocations()
      .pipe(take(1))
      .subscribe((data) => {
        if (data) {
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
              locationUuids: this.getSelectedLocations(data.locations),
              endDate: Moment(this.endDate).format('YYYY-MM-DD'),
              startDate: Moment(this.startDate).format('YYYY-MM-DD'),
              limit: this.selectedSampleSize,
              patientType: this.selectedPatientType
            }
          });
          this.showPatientList = true;
        }
      });
  }
  private getSelectedLocations(locationUuids: Array<any>): string {
    return locationUuids.map((location) => location.value).join(',');
  }
  public patientTypeChange($event) {
    this.selectedPatientType = $event;
  }
  public sampleSizeChange($event) {
    this.selectedSampleSize = $event;
  }
}
