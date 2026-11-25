import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable, forkJoin, BehaviorSubject, of, throwError } from 'rxjs';
import * as _ from 'lodash';
import { map, catchError, shareReplay, switchMap } from 'rxjs/operators';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { SessionStorageService } from '../utils/session-storage.service';
import { Constants } from '../utils/constants';
import { CohortMemberResourceService } from './cohort-member-resource.service';
/** The group as the group page has always asked for it. */
const GROUP_DETAIL_FULL_V =
  'custom:(attributes,auditInfo,cohortLeaders,cohortType,cohortVisits,description,display,endDate,groupCohort,location,name,startDate,uuid,voided,voidReason)';

/**
 * The same, with each meeting cut down to what the group page and its summary
 * read. In full, every meeting carries every member visit with its whole visit,
 * encounters and observations, which makes large groups slow to open.
 */
const GROUP_DETAIL_V =
  'custom:(attributes,auditInfo,cohortLeaders,cohortType,description,display,endDate,groupCohort,location,name,startDate,uuid,voided,voidReason,' +
  'cohortVisits:(uuid,startDate,endDate,visitType:(uuid),' +
  'cohortMemberVisits:(visit:(startDatetime,patient:(uuid),' +
  'encounters:(encounterDatetime,encounterType:(uuid),obs:(uuid,display))))))';

/**
 * Whether every meeting came back with its member visits in the shape the
 * group page reads: each with its visit, the visit's patient and encounters,
 * and each encounter's type and observations.
 */
function hasMemberVisits(group: any): boolean {
  if (!group || !Array.isArray(group.cohortVisits)) {
    return false;
  }
  return group.cohortVisits.every(
    (meeting: any) =>
      Array.isArray(meeting.cohortMemberVisits) &&
      !!meeting.visitType &&
      meeting.cohortMemberVisits.every(
        (memberVisit: any) =>
          !!memberVisit &&
          !!memberVisit.visit &&
          !!memberVisit.visit.patient &&
          Array.isArray(memberVisit.visit.encounters) &&
          memberVisit.visit.encounters.every(
            (encounter: any) =>
              !!encounter &&
              !!encounter.encounterType &&
              Array.isArray(encounter.obs)
          )
      )
  );
}

@Injectable()
export class CommunityGroupService {
  public cachedResults: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public v = 'full';
  public _v =
    'custom:(uuid,name,description,cohortLeaders,startDate,endDate,location:(display),cohortVisits:(startDate),attributes,cohortMembers:(uuid,endDate))';

  /**
   * Only what the facility group list shows. The shared representation pulls
   * full attributes and full leaders (each leader's whole person record),
   * which OpenMRS builds one by one for every group.
   */
  public groupListV =
    'custom:(uuid,name,description,startDate,endDate,voided,location:(display),' +
    'cohortVisits:(startDate),cohortMembers:(endDate),' +
    'attributes:(value,cohortAttributeType:(name)),' +
    'cohortLeaders:(endDate,person:(display)))';

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

  /**
   * The group with its members. The members and the group are fetched at the
   * same time (they used to be fetched one after the other).
   */
  public getGroupByUuid(groupUuid: string): Observable<any> {
    return this.getGroupByUuidParts(groupUuid).group$;
  }

  /**
   * The same, with the members list on its own as well, so a page can start
   * work that needs only the members (such as their HIV summaries) before the
   * whole group has arrived. Both share one members request.
   */
  public getGroupByUuidParts(
    groupUuid: string
  ): { members$: Observable<any[]>; group$: Observable<any> } {
    const members$ = this.cohortMemberResourceService
      .getCohortMembersByCohort(groupUuid)
      .pipe(shareReplay(1));
    const group$ = forkJoin([
      members$,
      this._getGroupByUuid(groupUuid, null)
    ]).pipe(
      map(([cohortMembers, group]) => {
        group.cohortMembers = cohortMembers;
        return group;
      })
    );
    return { members$, group$ };
  }

  //       'custom:(attributes,auditInfo,cohortLeaders,cohortType,cohortVisits,description,display,endDate,groupCohort,location,name,startDate,uuid,voided,voidReason)'

  public _getGroupByUuid(
    groupUuid: string,
    cohortMembers: any
  ): Observable<any> {
    const url = this.getOpenMrsBaseUrl() + '/cohort' + `/${groupUuid}`;
    const fetch = (v: string) =>
      this.http.get<any>(url, { params: new HttpParams().set('v', v) });
    const withMembers = (group: any) => {
      group.cohortMembers = cohortMembers;
      return group;
    };
    // The meetings in full only if the slim request is refused or comes back
    // without the member visits the page needs.
    return fetch(GROUP_DETAIL_V).pipe(
      switchMap((group: any) =>
        hasMemberVisits(group)
          ? of(group)
          : throwError('Slim group request lacked member visits')
      ),
      catchError((err) => {
        console.warn('Group detail: using the full group request.', err);
        return fetch(GROUP_DETAIL_FULL_V);
      }),
      map(withMembers)
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

  /**
   * Groups at a location. With programUuid, only that program's groups are
   * asked for (the same attribute search used for group number and landmark).
   */
  public getGroupsByLocationUuid(
    locationUuid: string,
    v: string = this._v,
    programUuid?: string
  ) {
    let params = new HttpParams()
      .set('location', `${locationUuid}`)
      .set('v', v);
    if (programUuid) {
      params = params.set('attributes', `"programUuid":"${programUuid}"`);
    }
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
