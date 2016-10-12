import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import { DynamicRouteModel } from './dynamic-route.model';
@Injectable()
export class DynamicRoutesService {
    routes = new ReplaySubject(1);
    routesModel = {};
    constructor() { }
    setRoutes(route: DynamicRouteModel) {
        Object.assign(this.routesModel, route)
        this.routes.next(this.routesModel);
    }
}
