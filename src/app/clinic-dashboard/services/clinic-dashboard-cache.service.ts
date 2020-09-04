import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import * as Moment from 'moment';

import { LocalStorageService } from 'src/app/utils/local-storage.service';
@Injectable()
export class ClinicDashboardCacheService {
    public dataIsLoading = true;
    private cached = {};
    private initialUuid;
    private currentClinic = new BehaviorSubject(this.initialUuid);
    private dailTabCurrentDate = Moment(new Date()).format('YYYY-MM-DD');
    private dailTabCurrentDateSubject = new BehaviorSubject(this.dailTabCurrentDate);
    private isLoading = new BehaviorSubject(this.dataIsLoading);
    private currentTab = new Subject();

    constructor(private localStorageService: LocalStorageService) { }

    public add(key: string, value: any) {
        this.cached[key] = value;
    }
    public getCached() {
        return this.cached;
    }
    public getByKey(key) {
        return this.cached[key];
    }
    public remove(key) {
        delete this.cached[key];
    }
    public clear() {
        this.cached = {};
    }
    public setCurrentClinic(currentClinicUuid: string) {
      if (this.currentClinic.value && currentClinicUuid === this.currentClinic.value) {
        return; // before broadcasting please check you are not sending same location
      }
      this.initialUuid = currentClinicUuid;
      this.currentClinic.next(currentClinicUuid);
    }
    public setCurrentTab(currentTab: string) {
        this.currentTab.next(currentTab);
    }
    public getCurrentClinic() {
        return this.currentClinic;
    }
    public getCurrentTab() {
        return this.currentTab;
    }
    public setDailyTabCurrentDate(date) {
        this.dailTabCurrentDate = Moment(date).format('YYYY-MM-DD');
        this.dailTabCurrentDateSubject.next(this.dailTabCurrentDate);
    }
    public getDailyTabCurrentDate() {
        return this.dailTabCurrentDateSubject;
    }
    public setIsLoading(loading: boolean) {
        this.isLoading.next(loading);
    }
    public getIsLoading() {
        return this.isLoading;
    }

    public didLocationChange(location: string): boolean {
        const cachedLocation = this.localStorageService.getItem('currentLocation');
        if (cachedLocation && cachedLocation !== location) {
            return true;
        }
        this.localStorageService.setItem('currentLocation', location);
        return false;
    }
}
