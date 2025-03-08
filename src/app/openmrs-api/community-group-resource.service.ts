import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable, forkJoin, BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';
import { map, catchError } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { SessionStorageService } from '../utils/session-storage.service';
import { Constants } from '../utils/constants';
import { CohortMemberResourceService } from './cohort-member-resource.service';
@Injectable()
export class CommunityGroupService {
  public cachedResults: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public v = 'full';
  public _v =
    'custom:(uuid,name,description,cohortLeaders,startDate,endDate,location:(display),cohortVisits:(startDate),attributes,cohortMembers:(uuid,endDate))';

  constructor(
    private http: HttpClient,
    private _appSettingsService: AppSettingsService,
    private sessionStorageService: SessionStorageService,
    private cohortMemberResourceService: CohortMemberResourceService
  ) {}

  public getOpenMrsBaseUrl(): string {
    return this._appSettingsService.getOpenmrsRestbaseurl() + 'cohortm';
  }

  public getCohortVisitUrl(): string {
    return (
      this._appSettingsService.getOpenmrsRestbaseurl() + 'cohortm/cohortvisit'
    );
  }

  public searchCohort(searchString: string, searchByLandmark = false) {
    if (searchByLandmark) {
      return this.getGroupsByLandmark(searchString);
    } else {
      const regex = new RegExp(/DC-\d{5}-\d{5}/i);
      const regex2 = new RegExp(/DC-test-\d{5}/i);
      if (regex.test(searchString) || regex2.test(searchString)) {
        return this.getGroupByGroupNumber(searchString);
      } else {
        return this.getGroupByName(searchString);
      }
    }
  }

  public getGroupByGroupNumber(groupNumber: string): Observable<any> {
    const params = new HttpParams()
      .set('attributes', `"groupNumber":"${groupNumber}"`)
      .set('v', this._v)
      .set('cohortType', 'community_group');

    const url = this.getOpenMrsBaseUrl() + '/cohort';
    return this.http
      .get<any>(url, {
        params: params
      })
      .pipe(map((response) => response.results));
  }

  public getGroupByName(name: string): Observable<any> {
    const params = new HttpParams()
      .set('v', this._v)
      .set('q', name)
      .set('cohortType', 'community_group');

    return this.http
      .get<any>(this.getOpenMrsBaseUrl() + '/cohort', {
        params: params
      })
      .pipe(map((response) => response.results));
  }

  public getGroupByUuid(groupUuid: string): Observable<any> {
    const one$ = new Observable((observer) => {
      this.cohortMemberResourceService
        .getCohortMembersByCohort(groupUuid)
        .subscribe((group) => {
          this._getGroupByUuid(groupUuid, group).subscribe((res) => {
            observer.next(res);
            observer.complete();
          });
        });
    });

    return one$;
  }
  //       'custom:(attributes,auditInfo,cohortLeaders,cohortType,cohortVisits,description,display,endDate,groupCohort,location,name,startDate,uuid,voided,voidReason)'

  public _getGroupByUuid(
    groupUuid: string,
    cohortMembers: any
  ): Observable<any> {
    let group: any;
    const params = new HttpParams().set(
      'v',
      'custom:(attributes,auditInfo,cohortLeaders,cohortType,description,display,endDate,groupCohort,location,name,startDate,uuid,voided,voidReason)'
    );
    const url = this.getOpenMrsBaseUrl() + '/cohort' + `/${groupUuid}`;
    return this.http
      .get(url, {
        params: params
      })
      .pipe(
        map((response) => {
          group = response;
          group.cohortMembers = cohortMembers;
          console.log('group is already here', group);
          return group;
        })
      );
  }

  public getCohortTypes(): Observable<any> {
    const params = new HttpParams().set('v', this.v);
    const url = this.getOpenMrsBaseUrl() + '/cohorttype';
    return this.http
      .get<any>(url, {
        params: params
      })
      .pipe(
        map((response) => {
          return response.results;
        })
      );
  }

  public getCohortPrograms() {
    const params = new HttpParams();
    params.set('v', this.v);
    const url = this.getOpenMrsBaseUrl() + '/cohortprogram';
    return this.http
      .get<any>(url, {
        params: params
      })
      .pipe(
        map((response) => {
          return response.results;
        })
      );
  }

  public createGroup(payload) {
    if (!payload) {
      return null;
    }

    const params = new HttpParams().set('v', this.v);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = this.getOpenMrsBaseUrl() + '/cohort';
    return this.http.post(url, JSON.stringify(payload), { headers });
  }

  public disbandGroup(uuid: string, endDate: Date, reason: string): any {
    const url = this.getOpenMrsBaseUrl() + '/cohort' + `/${uuid}`;
    const body = {
      endDate: endDate,
      voided: true,
      voidReason: reason
    };
    console.log(body);
    return this.http.post(url, body);
  }

  public getGroupAttribute(attributeType: string, attributes: any[]): any {
    return _.filter(
      attributes,
      (attribute) => attribute.cohortAttributeType.name === attributeType
    )[0];
  }

  public updateCohortGroup(payload, uuid): Observable<any> {
    if (!payload) {
      return null;
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    const url = this.getOpenMrsBaseUrl() + '/cohort/' + uuid;
    return this.http.post(url, JSON.stringify(payload), { headers });
  }

  public activateGroup(uuid: any): any {
    const body = {
      endDate: null,
      voided: false,
      voidReason: null
    };
    const url = this.getOpenMrsBaseUrl() + `/cohort/${uuid}`;
    return this.http.post(url, body);
  }

  public startGroupVisit(payload): any {
    const url = this.getCohortVisitUrl();
    return this.http.post(url, payload);
  }

  public startIndividualVisit(payload): any {
    const url = this.getOpenMrsBaseUrl() + `/cohortmembervisit`;
    return this.http.post(url, payload);
  }

  public getGroupsByLandmark(landmark: string) {
    const params = new HttpParams()
      .set('attributes', `"landmark":"${landmark}"`)
      .set('v', this._v)
      .set('cohortType', 'community_group');

    const url = this.getOpenMrsBaseUrl() + '/cohort';
    return this.http
      .get<any>(url, {
        params: params
      })
      .pipe(map((response) => response.results));
  }

  public saveSearchResults(searchResults) {
    this.cachedResults.next(searchResults);
  }
  public getPreviousSearchResults() {
    return this.cachedResults.asObservable();
  }

  public getGroupsByLocationUuid(locationUuid: string) {
    const params = new HttpParams()
      .set('location', `${locationUuid}`)
      .set('v', this._v);
    const url = this.getOpenMrsBaseUrl() + '/cohort';
    return this.http
      .get<any>(url, { params })
      .pipe(map((response) => response.results));
  }

  public generateGroupNumber(locationUuid: string, test = 'true') {
    const url = `https://ngx.ampath.or.ke/group-idgen/generategroupnumber/${locationUuid}`;
    const credentials = this.sessionStorageService.getItem(
      Constants.CREDENTIALS_KEY
    );
    const params = new HttpParams().set('test', test);
    const headers = new HttpHeaders().set(
      'Authorization',
      `Basic ${credentials}`
    );
    return this.http.get(url);
  }
}
