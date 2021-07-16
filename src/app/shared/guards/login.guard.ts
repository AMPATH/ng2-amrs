import { Injectable } from "@angular/core";
import { Router, CanActivate } from "@angular/router";

import { Constants } from "../../utils/constants";

@Injectable()
export class LoginGuard implements CanActivate {
  private url: any;

  constructor(private router: Router) {}

  public canActivate() {
    const credentials = sessionStorage.getItem(Constants.CREDENTIALS_KEY);

    if (credentials && window.location.hash.match("#/login")) {
      this.router.navigate(["patient-dashboard/patient-search"]);
    } else {
      return true;
    }
  }
}
