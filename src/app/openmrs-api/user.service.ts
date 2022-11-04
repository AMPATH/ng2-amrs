import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SessionStorageService } from '../utils/session-storage.service';
import { Constants } from '../utils/constants';
import { User } from '../models/user.model';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpParams, HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class UserService {
  public baseOpenMrsUrl: string = this.getOpenMrsBaseUrl();
  public v = 'default';

  constructor(
    private sessionStorageService: SessionStorageService,
    private _http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}

  public getLoggedInUser(): User {
    const userObject = this.sessionStorageService.getObject(Constants.USER_KEY);
    return new User(userObject);
  }
  // get all users

  public getAllUsers(): Observable<any> {
    const baseUrl = this.getOpenMrsBaseUrl();
    const url = baseUrl + 'user?v=custom:(uuid,display,person)';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get<any>(url, { headers }).pipe(
      map((response) => {
        return response.results;
      })
    );
  }
  public getOpenMrsBaseUrl(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim();
  }

  public searchUsers(searchText: string) {
    const params: HttpParams = new HttpParams()
      .set('q', searchText)
      .set('v', 'default');

    const allCohortMembersUrl: string = this.baseOpenMrsUrl + 'user';

    return this._http
      .get<any>(allCohortMembersUrl, {
        params: params
      })
      .pipe(
        map((response) => {
          return response.results;
        })
      );
  }

  // fetch user by uuid

  public getUserByUuid(uuid: string) {
    if (!uuid) {
      return null;
    }
    const c = 'custom:(uuid,display,person)';
    console.log('getUserByUuid', uuid);
    const params: HttpParams = new HttpParams().set('v', c);

    const userUrl: string = this.baseOpenMrsUrl + 'user/' + uuid;

    return this._http.get<any>(userUrl, {
      params: params
    });
  }
}
