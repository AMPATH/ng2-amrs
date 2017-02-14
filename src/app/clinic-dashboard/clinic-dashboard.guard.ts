import { Injectable } from '@angular/core';
import {
  CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router,
  ActivatedRoute
} from '@angular/router';

import { DynamicRoutesService } from '../shared/dynamic-route/dynamic-routes.service';
import { ClinicDashboardComponent } from './clinic-dashboard.component';
@Injectable()
export class ClinicDashboardGuard implements CanActivate, CanDeactivate<ClinicDashboardComponent> {

  constructor(private dynamicRoutesService: DynamicRoutesService, private router: Router,
              private route: ActivatedRoute) {
  }

  canActivate(routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let component: any = routeSnapshot.component;
    if (component.name === 'ClinicDashboardComponent') {
      let locationUuid = routeSnapshot.params['location_uuid'];
      if (locationUuid) {
        this.dynamicRoutesService.setRoutes({
          dashboardId: 'clinicDashboard',
          programs: [], // TODO: Fetch this data from user service
          moduleLabel: 'Clinic Dashboard',
          params: {
            locationUuid: locationUuid
          },
          routes: []
        });
      } else {
        this.router.navigate(['/patient-dashboard/patient-search']);
      }
    }
    return false;
  }

  canDeactivate(target: ClinicDashboardComponent): boolean {
    this.dynamicRoutesService.resetRoutes();
    return true;
  }
}
