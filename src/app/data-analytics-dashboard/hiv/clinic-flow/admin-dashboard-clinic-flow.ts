import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';

import * as _ from 'lodash';
import * as moment from 'moment';
import { ClinicFlowCacheService } from '../../../hiv-care-lib/clinic-flow/clinic-flow-cache.service';

@Component({
  selector: 'admin-dashboard-clinic-flow',
  templateUrl: './admin-dashboard-clinic-flow.html',
  styleUrls: ['./admin-dashboard-clinic-flow.css']
})
export class AdminDashboardClinicFlowComponent implements OnInit {
  public locations: Array<string>;
  public selectedDate: any;
  private _datePipe: DatePipe;
  constructor(private clinicFlowCache: ClinicFlowCacheService) {
    this._datePipe = new DatePipe('en-US');
  }
  public ngOnInit() {
    if (this.clinicFlowCache.lastClinicFlowSelectedDate) {
      this.selectedDate = this.clinicFlowCache.lastClinicFlowSelectedDate;
    } else {
      this.selectedDate = this._datePipe.transform(new Date(), 'yyyy-MM-dd');
      this.clinicFlowCache.setSelectedDate(this.selectedDate);
    }
  }

  public renderClinicFlow(locationData: any) {
    let locations;
    if (locationData && locationData.locations) {
      const locationCheck = _.first(locationData.locations);
      if (_.isObject(locationCheck)) {
        locations = locationData.locations.slice().map((location) => {
          return location.value;
        });
      } else {
        locations = locationData.locations;
      }
      this.clinicFlowCache.setSelectedLocation(locations);
    }
    this.locations = locations;
  }

  public setSelectedDate(date) {
    this.selectedDate = date;
    this.clinicFlowCache.setSelectedDate(date);
  }

  public navigateDay(value) {
    if (value) {
      const m = moment(new Date(this.selectedDate));
      const revisedDate = m.add(value, 'd');

      this.selectedDate = this._datePipe.transform(revisedDate, 'yyyy-MM-dd');
      this.clinicFlowCache.setSelectedDate(this.selectedDate);
    }
  }
}
