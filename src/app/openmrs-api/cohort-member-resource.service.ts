import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/** The members as the group pages have always asked for them. */
const COHORT_MEMBERS_FULL_V =
  'custom:(startDate,endDate,patient:(identifiers,person:(uuid,display,gender,age,birthdate,preferredName,attributes)))';

/**
 * The same members with each identifier and person attribute cut down to the
 * fields the group pages and the Patient / Person models read.
 */
const COHORT_MEMBERS_SLIM_V =
  'custom:(startDate,endDate,patient:(uuid,' +
  'identifiers:(uuid,identifier,preferred,identifierType:(uuid,name,display)),' +
  'person:(uuid,display,gender,age,birthdate,preferredName,' +
  'attributes:(uuid,display,value,attributeType:(uuid,display)))))';

@Injectable()
export class CohortMemberResourceService {
  public baseOpenMrsUrl: string = this.getOpenMrsBaseUrl();

  constructor(
    private _http: HttpClient,
    private _appSettingsService: AppSettingsService
  ) {}

  public getOpenMrsBaseUrl(): string {
    return this._appSettingsService.getOpenmrsRestbaseurl().trim();
  }

  // Fetch all non-retired

  public getAllCohortMembers(parentUuid): Observable<any> {
    if (!parentUuid) {
      return null;
    }

    const allCohortMembersUrl: string =
      this.baseOpenMrsUrl + 'cohort/' + parentUuid + '/member';

    return this._http.get<any>(allCohortMembersUrl).pipe(
      map((response) => {
        return response.results;
      })
    );
  }

  // Fetch specific Cohort

  public getCohortMember(parentUuid, uuid): Observable<any> {
    if (!parentUuid || !uuid) {
      return null;
    }

    const cohortUrl =
      this.baseOpenMrsUrl + 'cohort/' + parentUuid + '/member/' + uuid;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http.get(cohortUrl, { headers });
  }

  // Add Cohort member
  public addCohortMember(parentUuid, payload): Observable<any> {
    if (!payload || !parentUuid) {
      return null;
    }

    const addCohortUrl: string =
      this.baseOpenMrsUrl + 'cohort/' + parentUuid + '/member';
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this._http.post(addCohortUrl, JSON.stringify(payload), { headers });
  }

  // Retire/Void Cohort

  public retireCohortMember(parentUuid, uuid): Observable<any> {
    if (!uuid || !parentUuid) {
      return null;
    }

    const retireRestUrl =
      'cohort/' + parentUuid + '/member/' + uuid + '?!purge';

    const retireCohortUrl: string = this.baseOpenMrsUrl + retireRestUrl;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this._http.delete(retireCohortUrl, { headers });
  }

  public getCohortMembersByCohort(cohortUuid): Observable<any> {
    if (!cohortUuid) {
      return null;
    }
    const fetch = (v: string) =>
      this._http
        .get<any>(
          this.baseOpenMrsUrl +
            `cohortm/cohortmember?cohort=${cohortUuid}&v=${v}`,
          { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
        )
        .pipe(map((response) => response.results));
    // Only the identifier and attribute fields the group pages read; the full
    // records are used if the slim request is refused.
    return fetch(COHORT_MEMBERS_SLIM_V).pipe(
      catchError((err) => {
        console.warn('Group members: using the full members request.', err);
        return fetch(COHORT_MEMBERS_FULL_V);
      })
    );
  }
}
