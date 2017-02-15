import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Rx';

@Injectable()
export class ClinicDashboardCacheService {
    private cached = {};
    private currentClinic = new Subject();
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
        this.currentClinic.next(currentClinicUuid);
    }
    public getCurrentClinic() {
        return this.currentClinic;
    }
}
