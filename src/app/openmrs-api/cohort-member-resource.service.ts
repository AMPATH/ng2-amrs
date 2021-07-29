import { map } from "rxjs/operators";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { AppSettingsService } from "../app-settings/app-settings.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";

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
      this.baseOpenMrsUrl + "cohort/" + parentUuid + "/member";

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
      this.baseOpenMrsUrl + "cohort/" + parentUuid + "/member/" + uuid;
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this._http.get(cohortUrl, { headers });
  }

  // Add Cohort member
  public addCohortMember(parentUuid, payload): Observable<any> {
    if (!payload || !parentUuid) {
      return null;
    }

    const addCohortUrl: string =
      this.baseOpenMrsUrl + "cohort/" + parentUuid + "/member";
    const headers = new HttpHeaders({ "Content-Type": "application/json" });

    return this._http.post(addCohortUrl, JSON.stringify(payload), { headers });
  }

  // Retire/Void Cohort

  public retireCohortMember(parentUuid, uuid): Observable<any> {
    if (!uuid || !parentUuid) {
      return null;
    }

    const retireRestUrl =
      "cohort/" + parentUuid + "/member/" + uuid + "?!purge";

    const retireCohortUrl: string = this.baseOpenMrsUrl + retireRestUrl;
    const headers = new HttpHeaders({ "Content-Type": "application/json" });

    return this._http.delete(retireCohortUrl, { headers });
  }

  public getCohortMembersByCohort(cohortUuid): Observable<any> {
    if (!cohortUuid) {
      return null;
    }
    const v = `custom:(startDate,endDate,patient:(identifiers,person:(uuid,display,gender,age,birthdate,preferredName,attributes)))`;
    const requestUrl = `${this.baseOpenMrsUrl}cohortm/cohortmember?cohort=${cohortUuid}&v=${v}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this._http
      .get<any>(requestUrl, { headers })
      .pipe(
        map((response) => {
          return response.results;
        })
      );
  }
}
