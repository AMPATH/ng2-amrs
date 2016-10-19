import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, CanActivate, CanDeactivate, Params, CanLoad } from '@angular/router';

import { DynamicRoutesService } from '../shared/services/dynamic-routes.service';
import { PatientDashboardComponent } from './patient-dashboard.component';
@Injectable()
export class PatientDashboardGuard implements CanActivate, CanDeactivate<PatientDashboardComponent> {

    constructor(private dynamicRoutesService: DynamicRoutesService, private router: Router,
        private route: ActivatedRoute) { }
    canActivate() {
        return true;
    }
    canDeactivate(target: PatientDashboardComponent) {
        this.dynamicRoutesService.setRoutes({
            key: 'patientDashboard',
            moduleLabel: "Patient Dashboard", routes: []
        });
        return true;
    }
}
