import { Injectable } from "@angular/core";
import {
  Router,
  ActivatedRoute,
  CanActivate,
  CanDeactivate,
  Params,
  CanLoad,
  RouterStateSnapshot,
} from "@angular/router";

import { DynamicRoutesService } from "../shared/dynamic-route/dynamic-routes.service";
import { MainDashboardComponent } from "./main-dashboard.component";
@Injectable()
export class MainDashboardGuard
  implements CanActivate, CanDeactivate<MainDashboardComponent> {
  constructor(
    private dynamicRoutesService: DynamicRoutesService,
    private router: Router,
    private route: ActivatedRoute,
    private state: RouterStateSnapshot
  ) {}

  public canActivate() {
    console.log("router", this.state);
    return true;
  }

  public canDeactivate(target: MainDashboardComponent) {
    return true;
  }
}
