import { Component, OnInit } from '@angular/core';
import { Response } from '@angular/http';
import { Router } from '@angular/router';
import { DynamicRoutesService } from '../shared/dynamic-route/dynamic-routes.service';
import { DynamicRouteModel } from '../shared/dynamic-route/dynamic-route.model';
import { AuthenticationService } from '../openmrs-api/authentication.service';
import { Subscription } from 'rxjs';
import { UserService } from '../openmrs-api/user.service';
import { User } from '../models/user.model';

declare var jQuery: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './main-dashboard.component.html',
  styleUrls: ['./main-dashboard.component.css']
})
export class MainDashboardComponent implements OnInit {
  public routeConfig = <DynamicRouteModel>{};
  public sidebarOpen = true;
  public isMobile = false;
  user: User;
  version: string;
  buildDate: Date;

  busyIndicator: Subscription;

  constructor(private router: Router,
              private dynamicRoutesService: DynamicRoutesService,
              private authenticationService: AuthenticationService,
              private userService: UserService) {
  }

  ngOnInit() {
    // Work Around for min-height
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
    this.user = this.userService.getLoggedInUser();

    this.loadVersion();
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

  loadVersion() {

    try {

      var json = require("../version.json");

      if(json && json.version) {

        this.version = json.version.version;
        this.buildDate = new Date(json.version.buildDate);
      }

    } catch (e) {}
  }
}
