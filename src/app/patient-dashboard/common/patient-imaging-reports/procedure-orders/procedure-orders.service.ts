import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';

import { AppSettingsService } from '../../../../app-settings/app-settings.service';
import { ProviderResourceService } from '../../../../openmrs-api/provider-resource.service';
import { UserService } from '../../../../openmrs-api/user.service';

@Injectable({
  providedIn: 'root'
})

export class ProcedureOrdersService {
  public v = 'custom:(uuid,display,conceptClass)';
  private canDeleteOrderPrivileges = ['242411e4-27de-4541-a25c-bdc211f5dceb'];

  constructor(
    private providerResourceService: ProviderResourceService,
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService,
    private userService: UserService) { }

  public getUrl(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'concept';
  }

  public getProviderByPersonUuid(uuid): Observable<any> {
    const providerSearchResults: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    this.providerResourceService.getProviderByPersonUuid(uuid)
      .subscribe(
        (provider) => {
          const mappedProvider = {
            label: (provider as any).display,
            value: (provider as any).person.uuid,
            providerUuid: (provider as any).uuid
          };
          providerSearchResults.next(mappedProvider);
        },
        (error) => {
          providerSearchResults.error(error);
        }

      );
    return providerSearchResults.asObservable();
  }


  public getAllConcepts(cached: boolean = false, v: string = null): Observable<any> {
    const url = this.getUrl();
    const params: HttpParams = new HttpParams()
      .set('v', (v && v.length > 0) ? v : this.v);
    return this.http.get(url, {
      params: params
    }).map((response) => {
      return response;
    });
  }

  public determineIfUserHasVoidingPrivileges(): boolean {
    const privileges: any[] = this.userService.getLoggedInUser().privileges;
    let authorized = false;
    if (privileges === null) {
      authorized = true;
    } else {
      _.forEach(privileges, (privilege) => {
        _.forEach(this.canDeleteOrderPrivileges, (allowedPrivilege) => {
          if (allowedPrivilege === privilege.uuid) {
            authorized = true;
          }
        });
        if (authorized) {
          return false;
        }
      });
    }
    return authorized;
  }
}
