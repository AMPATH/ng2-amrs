import { Injectable } from '@angular/core';
import {
  Router, ActivatedRoute, CanActivate, CanDeactivate, Params, CanLoad,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';

import { DynamicRoutesService } from '../shared/dynamic-route/dynamic-routes.service';
import { ProviderDashboardComponent } from './provider-dashboard.component';
@Injectable()
export class ProviderDashboardGuard implements CanActivate,
 CanDeactivate<ProviderDashboardComponent> {

  constructor(private dynamicRoutesService: DynamicRoutesService) {
  }

  public canActivate(routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.dynamicRoutesService.setRoutes({
      dashboardId: 'providerDashboard',
      programs: [], // TODO: Fetch this data from user service
      moduleLabel: 'Provider Dashboard',
      params: {},
      routes: []
    });
    return true;
  }

  public canDeactivate(target: ProviderDashboardComponent) {
    this.dynamicRoutesService.resetRoutes();
    return true;
  }
}
