import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate,
  RouterStateSnapshot
} from '@angular/router';

import { DynamicRoutesService } from '../shared/dynamic-route/dynamic-routes.service';
import { RegistersDashboardComponent } from './registers-dashboard.component';
import { RegistersRoutesFactory } from '../navigation/side-navigation/registers-side-nav/register-side-nav-routes.factory';

@Injectable()
export class RegistersDashboardGuard
  implements CanActivate, CanDeactivate<RegistersDashboardComponent> {
  constructor(
    private dynamicRoutesService: DynamicRoutesService,
    private registersRoutesFactory: RegistersRoutesFactory
  ) {}

  public canActivate(
    routeSnapshot: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    const routes = this.registersRoutesFactory.createRegistersDashboardRoutes();
    this.dynamicRoutesService.setRegistersDashBoardRoutes(routes);
    return true;
  }

  public canDeactivate(target: RegistersDashboardComponent) {
    this.dynamicRoutesService.resetRoutes();
    return true;
  }
}
