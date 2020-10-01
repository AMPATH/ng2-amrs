import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

import { KibanaVizComponent } from '../../../shared/kibana-viz/kibana-viz.component';

@Component({
  selector: 'moh731-monthly-viz-analytics',
  templateUrl: 'moh731-monthly-viz.component.html'
})
export class Moh731MonthlyVizComponent extends KibanaVizComponent {
  constructor(route: ActivatedRoute, location: Location, router: Router) {
    super(route, location, router);
    this.height = '1680';
    // tslint:disable-next-line:max-line-length
    this.kibanaVizUrl =
      'https://ngx.ampath.or.ke/app/kibana#/dashboard/489e2c50-9509-11e8-a012-810dc09c435e?embed=true&_g=()';
  }
}
