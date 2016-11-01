import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { DynamicRoutesService } from '../shared/services/dynamic-routes.service';
import { DynamicRouteModel } from '../shared/services/dynamic-route.model';
import { AuthenticationService } from '../amrs-api/authentication.service';
import { Subscription } from 'rxjs';

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

  busyIndicator: Subscription;

  constructor(private router: Router, private dynamicRoutesService: DynamicRoutesService, private authenticationService: AuthenticationService) {
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

  logout() {

    this.busyIndicator = this.authenticationService.logOut()
    .subscribe(
      (response: Response) => {
        this.router.navigate(['/login']);
      },
      (error: Error) => {
        this.router.navigate(['/login']);
      });
  }
}
