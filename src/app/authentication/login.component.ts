import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { LoginService } from './login.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @Output() loginSuccess = new EventEmitter();
  @Output() loginFailure = new EventEmitter();

  error: string;

  constructor( private router: Router ) {
  }

  login(event, username: string, password: string) {

    event.stopPropagation();
    event.preventDefault();

    let body = JSON.stringify({ username, password });
    let currentRoute = window.location.toString();

    //sessionStorage.setItem('credentials', 'sdffdgjkmfd gdfkigdfkddmgkdm');

    //if(currentRoute && currentRoute.indexOf('login') != -1) {

      //let previousRoute: string = sessionStorage.getItem('previousRoute');

      //if(previousRoute) this.router.navigate([ previousRoute ]);
    //}

    this.loginSuccess.emit(true);

    // this.loginService.login(body)
    //   .subscribe(
    //     (response: Response) => {
    //       let data = response.json();
    //        localStorage.setItem('id_token', data.token);
    //        this.router.navigate(['home']);
    //        this.success.emit(true);
    //     },
    //     (error: Error) => {
    //         this.error = 'wrong username or password';
    //        this.failure.emit(false);
    //     });
  }
}
