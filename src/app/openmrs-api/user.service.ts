// import { AppSettingsService } from './../app-settings';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http , Response , Headers, RequestOptions } from '@angular/http';
import { SessionStorageService } from '../utils/session-storage.service';
import { Constants } from '../utils/constants';
import { User } from '../models/user.model';
import {  URLSearchParams } from '@angular/http';
import { AppSettingsService } from '../app-settings';

@Injectable()
export class UserService {
  public baseOpenMrsUrl: string = this.getOpenMrsBaseUrl();
  public v: string = 'default';

  constructor(
    private sessionStorageService: SessionStorageService,
    private _http: Http,
    protected appSettingsService: AppSettingsService) { }

  public getLoggedInUser(): User {
    let userObject = this.sessionStorageService.getObject(Constants.USER_KEY);
    return new User(userObject);
  }
  // get all users

  public getAllUsers(): Observable <any> {

    let baseUrl = this.getOpenMrsBaseUrl();
    let url = baseUrl + 'user?v=custom:(uuid,display,person)';

    let headers = new Headers({'Content-Type': 'application/json'});
    let options = new RequestOptions({headers: headers});

    return this._http.get(url, options)
      .map((response) => {
        return response.json().results;
      });
  }
  public getOpenMrsBaseUrl(): string {

    return this.appSettingsService.getOpenmrsRestbaseurl().trim();
  }

  public searchUsers(searchText: string) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('q', searchText);
    params.set('v', 'default');

    let allCohortMembersUrl: string = this.baseOpenMrsUrl + 'user' ;

    return this._http.get(allCohortMembersUrl, {
      search: params
    })
      .map((response) => {
        return response.json().results;
      });
  }
}
