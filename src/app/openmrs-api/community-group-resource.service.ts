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
  'encounters:(encounterDatetime,encounterType:(uuid))))))';

/**
 * The same with each encounter's observations, needed only for the OTZ
 * module columns. Observations are by far the largest part (tens of thousands
 * for one group), so they are fetched only for OTZ clubs, after the table.
 */
const GROUP_DETAIL_WITH_OBS_V =
  'custom:(uuid,' +
  'cohortVisits:(uuid,startDate,endDate,visitType:(uuid),' +
  'cohortMemberVisits:(visit:(startDatetime,patient:(uuid),' +
  'encounters:(encounterDatetime,encounterType:(uuid),obs:(uuid,display))))))';

/** The group and its meetings only - the member visits come from the ETL. */
const GROUP_MEETINGS_V =
  'custom:(attributes,auditInfo,cohortLeaders,cohortType,description,display,endDate,groupCohort,location,name,startDate,uuid,voided,voidReason,' +
  'cohortVisits:(uuid,startDate,endDate,visitType:(uuid)))';

/**
 * Puts the ETL attendance rows on the meetings in the shape the group page
 * reads: meeting.cohortMemberVisits[].visit.{uuid, startDatetime, patient,
 * encounters[].{encounterDatetime, encounterType}}.
 */
function attachMemberVisits(group: any, rows: any[]): any {
  const byMeeting = new Map<string, Map<string, any>>();
  (rows || []).forEach((row: any) => {
    if (!byMeeting.has(row.cohort_visit_uuid)) {
      byMeeting.set(row.cohort_visit_uuid, new Map<string, any>());
    }
    const visits = byMeeting.get(row.cohort_visit_uuid);
    if (!visits.has(row.visit_uuid)) {
      visits.set(row.visit_uuid, {
        visit: {
          uuid: row.visit_uuid,
          startDatetime: row.visit_start,
          patient: { uuid: row.patient_uuid },
          encounters: []
        }
      });
    }
    if (row.encounter_type_uuid) {
      visits.get(row.visit_uuid).visit.encounters.push({
        encounterDatetime: row.encounter_datetime,
        encounterType: { uuid: row.encounter_type_uuid }
      });
    }
  });
  (group.cohortVisits || []).forEach((meeting: any) => {
    const visits = byMeeting.get(meeting.uuid);
    meeting.cohortMemberVisits = visits ? Array.from(visits.values()) : [];
  });
  return group;
}

/**
 * Whether every meeting came back with its member visits in the shape the
 * group page reads: each with its visit, the visit's patient and encounters,
 * and each encounter's type (and observations, when asked for).
 */
function hasMemberVisits(group: any, withObs = false): boolean {
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
              (!withObs || Array.isArray(encounter.obs))
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
    // Fast path: the group and its meeting list from OpenMRS (small), and the
    // member visits and encounters from the ETL server (one SQL query), side
    // by side. If either fails, the OpenMRS request with member visits is used.
    const groupWithVisits$ = forkJoin([
      this.getGroupMeetingsOnly(groupUuid),
      this.getGroupMeetingAttendance(groupUuid)
    ]).pipe(
      map(([group, rows]) => attachMemberVisits(group, rows)),
      catchError((err) => {
        console.warn(
          'Group detail: attendance from ETL unavailable; using OpenMRS.',
          err
        );
        return this._getGroupByUuid(groupUuid, null);
      })
    );
    const group$ = forkJoin([members$, groupWithVisits$]).pipe(
      map(([cohortMembers, group]) => {
        group.cohortMembers = cohortMembers;
        return group;
      })
    );
    return { members$, group$ };
  }

  /** The group with its meetings, without the meetings' member visits. */
  private getGroupMeetingsOnly(groupUuid: string): Observable<any> {
    const url = this.getOpenMrsBaseUrl() + '/cohort' + `/${groupUuid}`;
    return this.http
      .get<any>(url, { params: new HttpParams().set('v', GROUP_MEETINGS_V) })
      .pipe(
        map((group: any) => {
          if (!group || !Array.isArray(group.cohortVisits)) {
            throw new Error('Group meetings missing');
          }
          return group;
        })
      );
  }

  /** Member visits and encounters of the group's meetings, from the ETL. */
  private getGroupMeetingAttendance(groupUuid: string): Observable<any[]> {
    const url =
      this._appSettingsService.getEtlRestbaseurl().trim() +
      'group-meeting-attendance';
    return this.http
      .get<any>(url, { params: new HttpParams().set('cohortUuid', groupUuid) })
      .pipe(
        map((response: any) => {
          if (!response || !Array.isArray(response.result)) {
            throw new Error('Unexpected attendance response');
          }
          return response.result;
        })
      );
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

  /**
   * The group's meetings with each encounter's observations - for the OTZ
   * module columns, loaded after the members table is shown. Falls back to
   * the full group request if the slim one is refused.
   */
  public getGroupMeetingsWithObs(groupUuid: string): Observable<any[]> {
    const url = this.getOpenMrsBaseUrl() + '/cohort' + `/${groupUuid}`;
    const fetch = (v: string) =>
      this.http.get<any>(url, { params: new HttpParams().set('v', v) });
    return fetch(GROUP_DETAIL_WITH_OBS_V).pipe(
      switchMap((group: any) =>
        hasMemberVisits(group, true)
          ? of(group)
          : throwError('Slim meetings request lacked observations')
      ),
      catchError((err) => {
        console.warn('Group detail: using the full request for modules.', err);
        return fetch(GROUP_DETAIL_FULL_V);
      }),
      map((group: any) => (group && group.cohortVisits) || [])
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
