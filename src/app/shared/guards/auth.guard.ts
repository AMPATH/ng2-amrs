import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { Constants } from '../../utils/constants';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) { }

  public canActivate() {

    // TODO - use angular2 location object
    let previousRoute: string = window.location.toString();

    if (previousRoute && previousRoute.indexOf('#') !== -1) {
      previousRoute = previousRoute.substring(previousRoute.indexOf('#') + 1);
    } else {
      previousRoute = '/';
    }

    sessionStorage.setItem('previousRoute', previousRoute);

    const credentials = sessionStorage.getItem(Constants.CREDENTIALS_KEY);

    if (credentials) {
      return true;
    }

    this.router.navigate(['/login']);

    return false;
  }
}
