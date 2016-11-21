import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { UserService } from '../openmrs-api/user.service';
import { User } from '../models/user.model';
import { LocalStorageService } from '../utils/local-storage.service';
import { Observable } from 'rxjs';


@Injectable()
export class UserDefaultPropertiesService {

  private user: User;

  constructor(private userService: UserService
    , private localStorage: LocalStorageService
    , private http: Http
    , private appSettingsService: AppSettingsService) { }

  getLocations(): Observable<any> {

    let api = this.appSettingsService.getOpenmrsServer() + '/ws/rest/v1/location?v=default';

    return this.http.get(api);

  }

  getCurrentUserDefaultLocation() {

    let userDisplay = this.getAuthenticatedUser().display;

    return this.localStorage.getItem('userDefaultLocation' + userDisplay);
  }

  getAuthenticatedUser(): User {
    return this.userService.getLoggedInUser();
  }

  setUserProperty(propertyKey: string, property: string) {

    if (propertyKey === 'userDefaultLocation') {

      propertyKey = propertyKey + this.getAuthenticatedUser().display;

      this.localStorage.setItem(propertyKey, property);
    }

  }
}



