import { Component, Output, EventEmitter, Input, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '@angular/http';
import { LoginService } from './login.service';
import { AuthenticationService } from '../amrs-api/authentication.service';
import { Messages } from '../utils/messages';
import { Subscription } from 'rxjs';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [  ]
})
export class LoginComponent {

  @Output() loginSuccess = new EventEmitter();
  @Output() loginFailure = new EventEmitter();

  password: string;

  error: string;

  busy: Subscription;

  @ViewChildren('password') passwordField;

  constructor( private router: Router, private authenticationService: AuthenticationService ) {
  }

  login(event, username: string, password: string) {

    event.stopPropagation();
    event.preventDefault();

    let body = JSON.stringify({ username, password });
    let currentRoute = window.location.toString();

    this.busy = this.authenticationService.authenticate(username, password)
      .subscribe(
        (response: Response) => {
          let data = response.json();

          if(data.authenticated) {

            this.loginSuccess.emit(true);

            if(currentRoute && currentRoute.indexOf('login') != -1) {

              let previousRoute: string = sessionStorage.getItem('previousRoute');

              if(previousRoute && previousRoute.length > 1)
                if(previousRoute && previousRoute.indexOf('login') != -1) {
                  this.router.navigate(['/']);
                } else
                  this.router.navigate([ previousRoute ]);
              else
                this.router.navigate(['/']);
            }
          } else {

            this.error = Messages.WRONG_USERNAME_PASSWORD;
            this.clearAndFocusPassword();
          }
        },
        (error: Error) => {

          this.error = Messages.WRONG_USERNAME_PASSWORD;
          this.loginFailure.emit(false);
          this.clearAndFocusPassword();
        });
  }

  clearAndFocusPassword() {

    this.passwordField.first.nativeElement.focus();
    this.passwordField.first.nativeElement.value = "";
  }
}
