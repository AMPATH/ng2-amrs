import { Injectable } from '@angular/core';
import {
  Router,
  ActivatedRoute,
  ActivatedRouteSnapshot,
  CanActivate,
  CanDeactivate,
  Params,
  CanLoad,
  RouterStateSnapshot
} from '@angular/router';

import { DynamicRoutesService } from '../shared/dynamic-route/dynamic-routes.service';
import { PatientDashboardComponent } from './patient-dashboard.component';
@Injectable()
export class PatientDashboardGuard implements CanActivate {

  constructor(private dynamicRoutesService: DynamicRoutesService, private router: Router,
              private route: ActivatedRoute) {
  }

  canActivate(routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let component: any = routeSnapshot.component;
    if (component.name === 'PatientDashboardComponent') {
      let patientUuid = routeSnapshot.params['patient_uuid'];
      if (patientUuid) {
        this.dynamicRoutesService.setRoutes({
          dashboardId: 'patientDashboard',
          programUuids: ['hiv-uuid', 'onc-uuid'], // TODO: Fetch this data from patient service
          moduleLabel: 'Patient Dashboard',
          params: {
            patientUuid: patientUuid
          }
        });
      } else {
        this.router.navigate(['/patient-dashboard/patient-search']);
      }
    }
    return true;
  }

  canDeactivate(target: PatientDashboardComponent) {

    return true;
  }
}
