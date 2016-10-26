import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate() {

    //TODO - use angular2 location object
    let previousRoute: string = window.location.toString();

    if(previousRoute && previousRoute.indexOf('#') != -1) {
      previousRoute = previousRoute.substring(previousRoute.indexOf('#') + 1);
    }

    sessionStorage.setItem('previousRoute', previousRoute);

    let credentials = sessionStorage.getItem('credentials');

    if (credentials) {
      return true;
    }

    this.router.navigate(['/login']);

    return false;
  }
}
