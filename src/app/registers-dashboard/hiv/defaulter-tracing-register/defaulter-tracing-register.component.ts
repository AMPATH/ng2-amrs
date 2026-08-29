import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DefaulterTracingRegisterCacheService } from './defaulter-tracing-register-cache.service';

@Component({
  selector: 'app-defaulter-tracing-register',
  templateUrl: './defaulter-tracing-register.component.html',
  styleUrls: ['./defaulter-tracing-register.component.css']
})
export class DefaulterTracingRegisterComponent implements OnInit {
  public locations: any;
  public selectedDate: any;
  private _datePipe: DatePipe;
  constructor(
    private defaulterTracingRegisterCacheService: DefaulterTracingRegisterCacheService
  ) {
    this._datePipe = new DatePipe('en-US');
  }
  public monthString = moment().format('YYYY-MM');
  public ngOnInit() {
    if (
      this.defaulterTracingRegisterCacheService
        .lastdefaulterTracingRegisterSelectedDate
    ) {
      this.selectedDate = this.defaulterTracingRegisterCacheService.lastdefaulterTracingRegisterSelectedDate;
    } else {
      this.selectedDate = this.monthString.toString();
      this.defaulterTracingRegisterCacheService.setSelectedDate(
        this.selectedDate
      );
    }
  }

  public renderDefaulterTracingRegister(locationData: any) {
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
      this.defaulterTracingRegisterCacheService.setSelectedLocation(locations);
    }
    this.locations = locations;
  }

  public setSelectedDate(date) {
    this.selectedDate = date;
    this.defaulterTracingRegisterCacheService.setSelectedDate(date);
  }

  public navigateDay(value) {
    if (value) {
      const m = moment(new Date(this.selectedDate));
      this.monthString = moment(this.monthString)
        .add(value, 'months')
        .endOf('month')
        .format('YYYY-MM');
      this.defaulterTracingRegisterCacheService.setSelectedDate(
        this.monthString
      );
    }
  }
  exportAllData() {
    throw new Error('Method not implemented.');
  }
}
