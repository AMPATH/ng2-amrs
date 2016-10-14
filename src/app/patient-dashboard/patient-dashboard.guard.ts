import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { DynamicRoutesService } from '../shared/services/dynamic-routes.service';
@Injectable()
export class PatientDashboardGuard implements CanActivate {

    constructor(private dynamicRoutesService: DynamicRoutesService) { }
    canActivate() {
        console.log('Do Route stuff');
        let routes = [
            {
                url: 'patient-dashboard/patient-search',
                label: 'Patient Search',
                icon: 'fa fa-search'
            },
            {
                url: 'patient-dashboard//patient-info',
                label: 'Patient Info',
                icon: 'fa fa-user'
            },
            {
                url: 'patient-dashboard/patient-encounters',
                label: 'Patient Encounters',
                icon: 'fa fa-users'
            }
        ]
        this.dynamicRoutesService.setRoutes({
            key: 'patientDashboard',
            moduleLabel: "Patient Dashboard", routes: routes
        });
        return true;
    }
}