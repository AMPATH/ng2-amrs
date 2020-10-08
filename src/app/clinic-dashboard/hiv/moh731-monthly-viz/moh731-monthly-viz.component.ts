import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { ClinicKibanaVizComponent } from '../../clinic-kibana-viz/clinic-kibana-viz.component';

@Component({
  selector: 'moh731-monthly-viz',
  templateUrl: 'moh731-monthly-viz.component.html',
  styleUrls: ['moh731-monthly-viz.component.css']
})
export class Moh731MonthlyVizComponent extends ClinicKibanaVizComponent {
  constructor(route: ActivatedRoute, location: Location, router: Router) {
    super(route, location, router);
    this.height = '1680';
    // tslint:disable-next-line:max-line-length
    this.kibanaVizUrl =
      'https://ngx.ampath.or.ke/app/kibana#/dashboard/489e2c50-9509-11e8-a012-810dc09c435e?embed=true&_g=()';
  }
}
