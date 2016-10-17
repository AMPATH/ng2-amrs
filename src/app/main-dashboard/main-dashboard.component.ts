import { Component, OnInit } from '@angular/core';

import { DynamicRoutesService } from '../shared/services/dynamic-routes.service';
import { DynamicRouteModel } from '../shared/services/dynamic-route.model';
declare var jQuery: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {
  routeConfig = <DynamicRouteModel>{};
  sidebarOpen = true;
  isMobile = false;
  constructor(private dynamicRoutesService: DynamicRoutesService) {
  }

  ngOnInit() {
    //Work Around for min-height
    window.dispatchEvent(new Event('resize'));
    this.dynamicRoutesService.routes.subscribe(result => {
      this.routeConfig = (<DynamicRouteModel>result);
      if (this.routeConfig.routes.length > 0 && !this.isMobile) {
        this.sidebarOpen = true;
      } else {
        this.sidebarOpen = false;
      }
    },
      err => console.log(err),
      () => console.log('Completed'));
  }
  screenChanges(event) {
    this.sidebarOpen = event;
    this.isMobile = event;
  }
}
