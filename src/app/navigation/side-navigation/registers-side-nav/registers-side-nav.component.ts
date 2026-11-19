import { Component, OnInit, OnDestroy } from '@angular/core';
import { trigger, transition, style, animate } from '@angular/animations';
import { Router, NavigationEnd } from '@angular/router';
import { RouteModel } from '../../../shared/dynamic-route/route.model';
import { DynamicRoutesService } from '../../../shared/dynamic-route/dynamic-routes.service';
import { Subscription } from 'rxjs';
import { NavigationService } from '../../navigation.service';

@Component({
  selector: 'registers-side-nav',
  templateUrl: './registers-side-nav.component.html',
  styleUrls: ['./registers-side-nav.component.css'],
  animations: [
    trigger('enterChild', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)' }),
        animate('400ms', style({ transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        style({ transform: 'translateY(0%)' }),
        animate('400ms', style({ transform: 'translateY(100%)' }))
      ])
    ])
  ]
})
export class RegistersSideNavComponent implements OnInit, OnDestroy {
  public routes: Array<RouteModel> = [];
  public selectedRoute: RouteModel = null;
  public viewingChildRoutes = false;
  public changingRoutesSub: Subscription;
  public registersRoutesSub: Subscription;
  constructor(
    private dynamicRoutesService: DynamicRoutesService,
    private navigationService: NavigationService
  ) {
    this.subscribeToRoutesChangeEvents();
  }

  public ngOnInit() {
    this.subscribeToRoutesChangeEvents();
    console.log('routes:::: ', this.routes);
  }

  public ngOnDestroy() {
    this.changingRoutesSub.unsubscribe();
    this.registersRoutesSub.unsubscribe();
  }

  public viewChildRoutes(route: RouteModel) {
    this.viewingChildRoutes = true;
    this.selectedRoute = route;
    this.expandSideBar();
  }

  public viewProgramRoutes() {
    this.viewingChildRoutes = false;
    this.expandSideBar();
  }

  public subscribeToRoutesChangeEvents() {
    this.changingRoutesSub = this.dynamicRoutesService.registersRoutes.subscribe(
      (next) => {
        this.routes = next;
        if (this.routes && this.routes.length > 0) {
          this.selectedRoute = this.routes[0];
        }
      }
    );
    this.registersRoutesSub = this.dynamicRoutesService.registersRoutes.subscribe(
      (next) => {
        this.routes = next;
        if (this.routes && this.routes.length > 0) {
          this.selectedRoute = this.routes[0];
        }
      }
    );
  }

  public expandSideBar() {
    this.navigationService.expandSideBar();
  }

  public collapseSideBar() {
    this.navigationService.collapseSideBar();
  }
}
