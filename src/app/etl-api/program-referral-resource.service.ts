import { Injectable } from "@angular/core";
import { AppSettingsService } from "../app-settings/app-settings.service";
import { Observable, from } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class ProgramReferralResourceService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService
  ) {}
  public getUrl(): string {
    return (
      this.appSettingsService.getEtlRestbaseurl().trim() + "patient-referral"
    );
  }
  public saveReferralEncounter(payload): Observable<any> {
    if (!payload) {
      return from(null);
    }
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post(this.getUrl(), JSON.stringify(payload), { headers });
  }
}
