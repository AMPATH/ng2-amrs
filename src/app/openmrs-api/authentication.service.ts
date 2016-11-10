import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { SessionService } from './session.service';
import { LocalStorageService } from '../utils/local-storage.service';
import { SessionStorageService } from '../utils/session-storage.service';
import { Constants } from '../utils/constants';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AuthenticationService {

  constructor(
    private appSettingsService: AppSettingsService,
    private localStorageService: LocalStorageService,
    private sessionStorageService: SessionStorageService,
    private sessionService: SessionService) { }

  authenticate(username: string, password: string) {

    let credentials = {
      username: username,
      password: password
    };

    let request = this.sessionService.getSession(credentials);

    request
      .subscribe(
      (response: Response) => {

        let data = response.json();

        if (data.authenticated) {

          this.setCredentials(username, password);

          // store logged in user details in session storage
          let user = data.user;
          this.storeUser(user);
        }
      });

    return request;
  }

  logOut() {

    let response = this.sessionService.deleteSession();

    response
      .subscribe(
      (res: Response) => {

        this.clearSessionCache();
      },
      (error: Error) => {

        this.clearSessionCache();
      });

    return response;
  }

  clearSessionCache() {
    this.clearCredentials();
    this.clearUserDetails();
  }

  private setCredentials(username: string, password: string) {

    let base64 = btoa(username + ':' + password);
    this.sessionStorageService.setItem(Constants.CREDENTIALS_KEY, base64);
  }

  private clearCredentials() {

    this.sessionStorageService.remove(Constants.CREDENTIALS_KEY);
  }

  private storeUser(user: any) {
    this.sessionStorageService.setObject(Constants.USER_KEY, user);
  }

  private clearUserDetails() {
    this.sessionStorageService.remove(Constants.USER_KEY);
  }
}
