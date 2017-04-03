import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { Response } from '@angular/http';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';

import { DynamicRoutesService } from '../shared/dynamic-route/dynamic-routes.service';
import { DynamicRouteModel } from '../shared/dynamic-route/dynamic-route.model';
import { AuthenticationService } from '../openmrs-api/authentication.service';
import { Subscription } from 'rxjs';
import { UserService } from '../openmrs-api/user.service';
import { User } from '../models/user.model';
import { LocalStorageService } from '../utils/local-storage.service';
import { AppState } from '../app.service';

declare let jQuery: any;

@Component({
  selector: 'app-dashboard',
  styleUrls: ['./main-dashboard.component.css'],
  templateUrl: './main-dashboard.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MainDashboardComponent implements OnInit, OnDestroy {
  public routeConfig = <DynamicRouteModel>{};
  public sidebarOpen = true;
  public isMobile = false;
  public appSubscription: Subscription;
  public currentDashboard: string = '';
  user: User;
  version: string;
  buildDate: Date;
  userLocation: string = '';
  busyIndicator: Subscription;
  active = false;
  interval;
  countDown = 0;
  constructor(private router: Router,
    private localStore: LocalStorageService,
    private dynamicRoutesService: DynamicRoutesService,
    private authenticationService: AuthenticationService,
    private userService: UserService, private appState: AppState) {

  }
  ngOnDestroy() {
    this.appSubscription.unsubscribe();
  }
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let navEvent = event as NavigationEnd;
        this.adjustDashBoard(navEvent.url);
      }
    });
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
    let location = this.localStore.getItem('userDefaultLocation' + this.user.display);
    this.userLocation = JSON.parse(location) ? JSON.parse(location).display : undefined;
    this.appSubscription = this.appState.setupIdleTimer(1000 * 60 * 30)
      .subscribe((status: { idle: boolean }) => {
        this.active = status.idle;
        if (status.idle) {
          this.timer(60);
        } else {
          clearInterval(this.interval);
        }
      });

  }

  screenChanges(event) {
    this.sidebarOpen = event;
    this.isMobile = event;
  }

  logout() {
    this.router.navigateByUrl('/login').then(result => {
      if (result) {
        this.authenticationService.logOut();
      }
    });
  }

  adjustDashBoard(currentUrl: string) {
    this.currentDashboard = '';

    if (currentUrl.includes('patient-search')) {
      this.currentDashboard = 'patient-search';
      return;
    }

    if (currentUrl.includes('patient-dashboard')) {
      this.currentDashboard = 'patient-dashboard';
      return;
    }

    if (currentUrl.includes('clinic-dashboard')) {
      this.currentDashboard = 'clinic-dashboard';
      return;
    }
  }

  clickOverlay($event) {
    this.appState.goActive(true);
  }

  timer(seconds?) {
    if (seconds) {
      this.countDown = seconds;
    }
    this.interval = setTimeout(() => {
      if (this.countDown > 0) {
        this.countDown = this.countDown - 1;
        this.timer();
      } else if (this.countDown === 0 && this.router.url !== '/login') {
        console.log('logOut', );
        this.logout();
      }
    }, 1000);
  }

}
