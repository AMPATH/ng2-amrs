import { Injectable } from '@angular/core';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { UserService } from '../openmrs-api/user.service';
import { User } from '../models/user.model';
import { LocalStorageService } from '../utils/local-storage.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserDefaultPropertiesMockService {
  constructor(
    private localStorage: LocalStorageService,
    private http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {}

  public getLocations(): Observable<any> {
    const api =
      this.appSettingsService.getOpenmrsServer() +
      '/ws/rest/v1/location?v=default';

    return this.http.get(api);
  }

  public getCurrentUserDefaultLocation() {
    const userDisplay = this.getAuthenticatedUser().display;

    return 'userDefaultLocation' + userDisplay;
  }

  public getAuthenticatedUser(): User {
    return new User({ display: 'test' });
  }

  public setUserProperty(propertyKey: string, property: string) {
    this.localStorage.setItem(propertyKey, property);
  }
}
