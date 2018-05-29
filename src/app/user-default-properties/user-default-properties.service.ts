import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { AppSettingsService } from '../app-settings';
import { UserService } from '../openmrs-api/user.service';
import { User } from '../models/user.model';
import { LocalStorageService } from '../utils/local-storage.service';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable()
export class UserDefaultPropertiesService {

  public locationSubject = new BehaviorSubject<any>('');
  private user: User;

  constructor(private userService: UserService
    ,         private localStorage: LocalStorageService
    ,         private http: Http
    ,         private appSettingsService: AppSettingsService) { }

  public getLocations(): Observable<any> {

    let api = this.appSettingsService.getOpenmrsServer() + '/ws/rest/v1/location?v=default';

    return this.http.get(api);

  }

  public getCurrentUserDefaultLocation() {

    let userDisplay = this.getAuthenticatedUser() ?  this.getAuthenticatedUser().display : null;
    let location = this.localStorage.getItem('userDefaultLocation' + userDisplay);
    return JSON.parse(location) ? JSON.parse(location).display : undefined;
  }

  public getCurrentUserDefaultLocationObject() {
    let userDisplay = this.getAuthenticatedUser() ? this.getAuthenticatedUser().display : null;
    let location = this.localStorage.getItem('userDefaultLocation' + userDisplay);
    if (location) {
      return JSON.parse(location);
    }
    return null;
  }
  public getAuthenticatedUser(): User {
    return this.userService.getLoggedInUser();
  }

  public setUserProperty(propertyKey: string, property: string) {

    if (propertyKey === 'userDefaultLocation') {

      propertyKey = propertyKey + this.getAuthenticatedUser().display;
      this.locationSubject.next(property);
    }
    this.localStorage.setItem(propertyKey, property);
  }

  public getUserProperty(propertyKey) {
    return this.localStorage.getItem(propertyKey);
  }

  public removeUserProperty(propertyKey) {
    return this.localStorage.remove(propertyKey);
  }
}
