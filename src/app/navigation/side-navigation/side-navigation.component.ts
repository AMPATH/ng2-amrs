import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { DynamicRoutesService } from '../../shared/dynamic-route/dynamic-routes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'side-navigation',
  templateUrl: './side-navigation.html'
})
export class SideNavigationComponent implements OnInit, OnDestroy {
  // tslint:disable-next-line:no-input-rename
  @Input('current-dashboard') public currentDashboard: string;
  public routes: Array<any> = [];
  public changingRoutesSub: Subscription;
  constructor(private dynamicRoutesService: DynamicRoutesService) {
  }

  public ngOnInit() {
    this.changingRoutesSub =
      this.dynamicRoutesService.routes.subscribe((next) => {
        this.routes = next['routes'];
      });
  }

  public ngOnDestroy() {
    this.changingRoutesSub.unsubscribe();
  }
}
