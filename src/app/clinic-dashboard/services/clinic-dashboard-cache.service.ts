import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class ClinicDashboardCacheService {
    private cached = {};
    private initialUuid;
    private currentClinic = new BehaviorSubject(this.initialUuid);
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
    public getCurrentClinic() {
        return this.currentClinic;
    }
}
