import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate,
  RouterStateSnapshot
} from '@angular/router';

import { DataAnalyticsDashboardComponent } from './data-analytics.component';
import { DynamicRoutesService } from '../shared/dynamic-route/dynamic-routes.service';
import { ClinicRoutesFactory } from '../navigation/side-navigation/clinic-side-nav/clinic-side-nav-routes.factory';

@Injectable()
export class DataAnalyticsDashboardGuard
  implements CanActivate, CanDeactivate<DataAnalyticsDashboardComponent>
{
  constructor(
    private dynamicRoutesService: DynamicRoutesService,
    private clinicRoutesFactory: ClinicRoutesFactory
  ) {}

  public canActivate(
    routeSnapshot: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    const routes = this.clinicRoutesFactory.createAnalyticsDashboardRoutes();
    this.dynamicRoutesService.setAnalyticsDashBoardRoutes(routes);
    return true;
  }

  public canDeactivate(target: DataAnalyticsDashboardComponent) {
    this.dynamicRoutesService.resetRoutes();
    return true;
  }
}
