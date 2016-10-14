import { Component, OnInit } from '@angular/core';

import { DynamicRoutesService } from '../shared/services/dynamic-routes.service';
import { DynamicRouteModel } from '../shared/services/dynamic-route.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {
  routes: any[];
  constructor(private dynamicRoutesService: DynamicRoutesService) {
  }

  ngOnInit() {
    this.dynamicRoutesService.routes.subscribe(result => {
      this.routes = (<DynamicRouteModel>result).routes;
    },
      err => console.log(err),
      () => console.log('Completed'));
  }

}
