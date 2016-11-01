import { Injectable } from '@angular/core';
import { CanActivate, CanDeactivate } from '@angular/router';

import { DynamicRoutesService } from '../shared/dynamic-route/dynamic-routes.service';
import { ClinicDashboardComponent } from './clinic-dashboard.component';
@Injectable()
export class ClinicDashboardGuard implements CanActivate, CanDeactivate<ClinicDashboardComponent> {

  constructor(private dynamicRoutesService: DynamicRoutesService) {
  }

  canActivate() {
    console.log('Route Stuff');
    let routes = [
      {
        url: 'clinic-dashboard/111/daily-schedule',
        label: 'Daily Schedule',
        icon: 'fa fa-calendar-check-o'
      },
      {
        url: 'clinic-dashboard/111/monthly-schedule',
        label: 'Monthly Schedule',
        icon: 'fa fa-calendar'
      }
    ];

    return true;
  }

  canDeactivate(target: ClinicDashboardComponent) {

    return true;
  }
}
