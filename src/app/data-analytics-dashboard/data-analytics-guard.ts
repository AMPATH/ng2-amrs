import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, CanActivate, CanDeactivate,
  RouterStateSnapshot
} from '@angular/router';

import { DataAnalyticsDashboardComponent } from './data-analytics.component';
import { DynamicRoutesService } from '../shared/dynamic-route/dynamic-routes.service';

@Injectable()
export class DataAnalyticsDashboardGuard implements CanActivate,
  CanDeactivate<DataAnalyticsDashboardComponent> {

  constructor(private dynamicRoutesService: DynamicRoutesService) {
  }

  canActivate(routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.dynamicRoutesService.setRoutes({
      dashboardId: 'analyticsDashboard',
      programs: [], // TODO: Fetch this data from user service
      moduleLabel: 'Data Analytics Dashboard',
      params: {},
      routes: []
    });
    return true;
  }

  canDeactivate(target: DataAnalyticsDashboardComponent) {
    this.dynamicRoutesService.resetRoutes();
    return true;
  }
}
