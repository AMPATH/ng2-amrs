
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject, Subject, ReplaySubject } from 'rxjs/Rx';
import * as Moment from 'moment';
@Injectable()
export class DataAnalyticsDashboardService {
  public dataIsLoading: boolean = true;
  private cached = {};
  private selectedFilters;
  private locations;
  private urlSource;
  private dataSubject = new ReplaySubject<any>(1);
  private reportFilters = new BehaviorSubject(this.selectedFilters);
  private selectedLocations = new BehaviorSubject(this.locations);
  private isLoading = new BehaviorSubject(this.dataIsLoading);
  private currentTab = new Subject();

  constructor() {
  }

  public setSelectedReportFilters(filters: any) {
    this.reportFilters.next(filters);
  }

  public getSelectedReportFilters() {
    return this.reportFilters;
  }

  public setSelectedLocations(locations: any) {
    if (locations.locations) {
      locations.locations = locations.locations.map((loc) => loc.value);
    }
    this.dataSubject.next(locations);
  }

  public getSelectedLocations() {
    return this.dataSubject;
  }

  public setUrlSource(source: any) {
    this.urlSource = source ;
  }
  public getUrlSource() {
   return this.urlSource;
  }
}
