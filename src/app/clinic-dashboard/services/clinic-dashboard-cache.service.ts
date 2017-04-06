import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs/Rx';
import * as Moment from 'moment';
@Injectable()
export class ClinicDashboardCacheService {
    private cached = {};

    private initialUuid;
    private currentClinic = new BehaviorSubject(this.initialUuid);
    private dailTabCurrentDate = Moment(this.currentClinic).format('YYYY-MM-DD');
    private dailTabCurrentDateSubject = new BehaviorSubject(this.dailTabCurrentDate);
    private currentTab = new Subject();

    constructor() { }
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
}
