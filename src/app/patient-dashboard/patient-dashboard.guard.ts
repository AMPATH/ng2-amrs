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
import { PatientService } from './patient.service';

@Injectable()
export class PatientDashboardGuard implements CanActivate {

  constructor(private dynamicRoutesService: DynamicRoutesService, private router: Router,
              private route: ActivatedRoute, private patientService: PatientService) {
  }

  canActivate(routeSnapshot: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let component: any = routeSnapshot.component;
    if (component.name === 'PatientDashboardComponent') {
      let patientUuid = routeSnapshot.params['patient_uuid'];
      if (patientUuid) {
        // set patient object
        this.patientService.setCurrentlyLoadedPatientByUuid(patientUuid).subscribe(
          (patientObject) => {
            if (patientObject) {
              this.dynamicRoutesService.setRoutes({
                dashboardId: 'patientDashboard',
                programs: patientObject.enrolledPrograms,
                moduleLabel: 'Patient Dashboard',
                params: {
                  patientUuid: patientUuid
                },
                routes: []
              });
            }
          });

      } else {
        this.router.navigate(['/patient-dashboard/patient-search']);
      }
    }
    return true;
  }

  canDeactivate(target: PatientDashboardComponent): boolean {
    this.dynamicRoutesService.resetRoutes();
    return true;
  }
}
