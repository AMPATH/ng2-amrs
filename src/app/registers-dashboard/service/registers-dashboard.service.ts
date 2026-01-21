import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, ReplaySubject } from 'rxjs';

@Injectable()
export class RegistersDashboardService {
  public dataIsLoading = true;
  private cached = {};
  private selectedFilters = null;
  private locations = null;
  private urlSource;
  private dataSubject = new ReplaySubject<any>(1);
  private dataIndicactorSubject = new ReplaySubject<any>(1);
  private dataMontthlyIndicactorSubject = new ReplaySubject<any>(1);
  private reportFilters = new BehaviorSubject(this.selectedFilters);
  private selectedLocations = new BehaviorSubject(this.locations);
  private selectedIndicatorLocations = new BehaviorSubject(this.locations);
  private isLoading = new BehaviorSubject(this.dataIsLoading);
  private currentTab = new Subject();

  constructor() {}

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

  public setSelectedIndicatorLocations(locations: any) {
    this.dataIndicactorSubject.next(locations);
  }

  public getSelectedIndicatorLocations() {
    return this.dataIndicactorSubject;
  }

  public getSelectedMonthlyIndicatorLocations() {
    return this.dataMontthlyIndicactorSubject;
  }

  public setSelectedMonthlyIndicatorLocations(locations: any) {
    this.dataMontthlyIndicactorSubject.next(locations);
  }

  public setUrlSource(source: any) {
    this.urlSource = source;
  }

  public getUrlSource() {
    return this.urlSource;
  }
}
