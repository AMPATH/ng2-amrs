import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  ActivatedRoute
} from '@angular/router';

import { DynamicRoutesService } from '../shared/dynamic-route/dynamic-routes.service';
import { ClinicDashboardComponent } from './clinic-dashboard.component';
import { UserDefaultPropertiesService } from '../user-default-properties/user-default-properties.service';
import { ClinicDashboardCacheService } from './services/clinic-dashboard-cache.service';
import { RoutesProviderService } from '../shared/dynamic-route/route-config-provider.service';
import { ClinicRoutesFactory } from '../navigation/side-navigation/clinic-side-nav/clinic-side-nav-routes.factory';

@Injectable()
export class ClinicDashboardGuard
  implements CanActivate, CanDeactivate<ClinicDashboardComponent>
{
  constructor(
    private dynamicRoutesService: DynamicRoutesService,
    private router: Router,
    private route: ActivatedRoute,
    private routesProvider: RoutesProviderService,
    private userDefaultProperties: UserDefaultPropertiesService,
    private clinicDashboardCacheService: ClinicDashboardCacheService,
    private clinicRoutesFactory: ClinicRoutesFactory
  ) {}

  public canActivate(
    routeSnapshot: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const component: any = routeSnapshot.component;
    if (component.name === 'ClinicDashboardComponent') {
      const userLocation =
        this.userDefaultProperties.getCurrentUserDefaultLocationObject();
      const locationUuid = routeSnapshot.params['location_uuid'];
      if (locationUuid) {
        this.clinicDashboardCacheService.setCurrentClinic(locationUuid);
        const routes =
          this.clinicRoutesFactory.createClinicDashboardRoutes(locationUuid);
        this.dynamicRoutesService.setClinicDashBoardRoutes(routes);
      } else if (userLocation && userLocation.uuid) {
        this.clinicDashboardCacheService.setCurrentClinic(userLocation.uuid);
        this.router.navigate([
          '/clinic-dashboard',
          userLocation.uuid,
          'general',
          'daily-schedule'
        ]);
      } else {
        return true;
      }
      return true;
    }
  }

  public canDeactivate(target: ClinicDashboardComponent): boolean {
    this.dynamicRoutesService.resetRoutes();
    return true;
  }
}
