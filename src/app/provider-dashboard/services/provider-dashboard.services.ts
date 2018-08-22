
import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BehaviorSubject, Subject, ReplaySubject } from 'rxjs/Rx';
import * as Moment from 'moment';
@Injectable()
export class ProviderDashboardService {
  public dataIsLoading: boolean = true;
  private cached = {};
  private selectedFilters;
  private locations;
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
    this.dataSubject.next(locations);
  }

  public getSelectedLocations() {
    return this.dataSubject;
  }
}
