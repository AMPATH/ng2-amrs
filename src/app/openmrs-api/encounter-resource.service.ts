import { of as observableOf, Observable, Subject } from "rxjs";
import { map, flatMap } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { AppSettingsService } from "../app-settings/app-settings.service";
import { HttpClient, HttpParams, HttpHeaders } from "@angular/common/http";

@Injectable()
export class EncounterResourceService {
  public v: string =
    "custom:(uuid,encounterDatetime," +
    "patient:(uuid,uuid),form:(uuid,name)," +
    "visit:(uuid,display,auditInfo,startDatetime,stopDatetime,location:(uuid,display)" +
    ",visitType:(uuid,name))," +
    "location:ref,encounterType:ref,encounterProviders:(uuid,display,provider:(uuid,display)))";

  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}
  public getUrl(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim();
  }

  public getEncountersByPatientUuid(
    patientUuid: string,
    cached: boolean = false,
    v: string = null
  ): Observable<any> {
    if (!patientUuid) {
      return null;
    }
    const url = this.getUrl() + "encounter";
    let params = new HttpParams().set("patient", patientUuid).set("v", this.v);

    return this.http
      .get(url, {
        params: params,
      })
      .pipe(
        flatMap((encounters: any) => {
          if (encounters.results.length >= 500) {
            params = params.set("startIndex", "500");
            return this.http
              .get<any>(url, {
                params: params,
              })
              .pipe(
                map((res) => {
                  return encounters.results.concat(res.results);
                })
              );
          } else {
            return observableOf(encounters.results);
          }
        })
      );
  }
  public getEncounterByUuid(uuid: string): Observable<any> {
    if (!uuid) {
      return null;
    }
    const _customDefaultRep =
      'custom:(uuid,encounterDatetime,' +
      'patient:(uuid,uuid,person,identifiers:full),form:(uuid,name),' +
      'visit:(uuid,visitType,display,startDatetime,stopDatetime),' +
      'location:ref,encounterType:ref,' +
      'encounterProviders:(uuid,display,provider:(uuid,display)),orders:full,' +
      'obs:(uuid,obsDatetime,concept:(uuid,uuid,name:(display),datatype),value:ref,groupMembers))';
    const params = new HttpParams().set('v', _customDefaultRep);
    const url = this.getUrl() + 'encounter/' + uuid;
    return this.http.get(url, { params: params });
  }
  public getEncounterTypes(v: string) {
    if (!v) {
      return null;
    }
    const url = this.getUrl() + "encountertype";
    return this.http.get(url).pipe(
      map((response: any) => {
        return response.results;
      })
    );
  }

  public saveEncounter(payload) {
    console.log("payload", payload);
    if (!payload) {
      return null;
    }
    const url = this.getUrl() + "encounter";
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post(url, JSON.stringify(payload), { headers });
  }

  public updateEncounter(uuid, payload) {
    if (!payload || !uuid) {
      return null;
    }
    const url = this.getUrl() + "encounter/" + uuid;
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post(url, JSON.stringify(payload), { headers });
  }

  public voidEncounter(uuid) {
    if (!uuid) {
      return null;
    }
    const url = this.getUrl() + "encounter/" + uuid + "?!purge";
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.delete(url, { headers });
  }
}
