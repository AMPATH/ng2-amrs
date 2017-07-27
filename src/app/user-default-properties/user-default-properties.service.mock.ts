import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { AppSettingsService } from '../app-settings';
import { UserService } from '../openmrs-api/user.service';
import { User } from '../models/user.model';
import { LocalStorageService } from '../utils/local-storage.service';
import { Observable } from 'rxjs';

@Injectable()
export class UserDefaultPropertiesMockService {

  private user: User;

  constructor(private userService: UserService
    ,         private localStorage: LocalStorageService
    ,         private http: Http
    ,         private appSettingsService: AppSettingsService) { }

 public  getLocations(): Observable<any> {

    let api = this.appSettingsService.getOpenmrsServer() + '/ws/rest/v1/location?v=default';

    return this.http.get(api);

  }

 public  getCurrentUserDefaultLocation() {

    let userDisplay = this.getAuthenticatedUser().display;

    return 'userDefaultLocation' + userDisplay;
  }

  public getAuthenticatedUser(): User {
    return new User({display: 'test'});
  }

  public setUserProperty(propertyKey: string, property: string) {

    this.localStorage.setItem(propertyKey, property);

  }
}
