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
  public departmentConf: any[] =
  require('../program-visit-encounter-search/department-programs-config.json');
  private user: User;

  constructor(private userService: UserService
    ,         private localStorage: LocalStorageService
    ,         private http: Http
    ,         private appSettingsService: AppSettingsService) { }

  public getLocations(): Observable<any> {

    let api = this.appSettingsService.getOpenmrsServer() + '/ws/rest/v1/location?v=default';

    return this.http.get(api);

  }

  public getDepartments() {
     return this.departmentConf;

  }

  public getCurrentUserDefaultLocation() {

    let userDisplay = this.getAuthenticatedUser().display;
    let location = this.localStorage.getItem('userDefaultLocation' + userDisplay);
    return JSON.parse(location) ? JSON.parse(location).display : undefined;
  }

  public getCurrentUserDefaultLocationObject() {
    let userDisplay = this.getAuthenticatedUser().display;
    let location = this.localStorage.getItem('userDefaultLocation' + userDisplay);
    if (location) {
      return JSON.parse(location);
    }
    return null;
  }
  public getAuthenticatedUser(): User {
    return this.userService.getLoggedInUser();
  }

  public getCurrentUserDepartment() {

    let department = this.localStorage.getItem('department');

    if (department === null) {
            return [];
     } else {
           return JSON.parse(department);
     }

  }

  public setUserProperty(propertyKey: string, property: string) {

    if (propertyKey === 'userDefaultLocation') {

      propertyKey = propertyKey + this.getAuthenticatedUser().display;

      this.locationSubject.next(property);
      this.localStorage.setItem(propertyKey, property);
    }

  }
  public setUserDepartment($department) {

    let department = this.localStorage.getItem('department');

    if (department === null) {

     } else {
          this.localStorage.remove('department');
     }

    this.localStorage.setItem('department', $department);

  }

  public removeUserDepartment() {

    let department = this.localStorage.getItem('department');

    if (department === null) {

    } else {
      this.localStorage.remove('department');
    }


  }
}
