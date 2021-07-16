import { take } from "rxjs/operators";
import { Injectable } from "@angular/core";
import { AppSettingsService } from "../app-settings/app-settings.service";
import { Observable, Subscriber } from "rxjs";
import { DomSanitizer } from "@angular/platform-browser";
import { HttpParams, HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable()
export class RadiologyImagingResourceService {
  constructor(
    private http: HttpClient,
    private appSettingsService: AppSettingsService,
    private domSanitizer: DomSanitizer
  ) {}
  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim();
  }
  public getPatientImagingReport(patientIdentifier: string): Observable<any> {
    const url = this.getUrl();
    let params: HttpParams = new HttpParams();
    params = params.set("patient", patientIdentifier);
    return this.http.get(url + "radiology-diagnostic-report", {
      params: params,
    });
  }
  public getWadoImageUrl(patientIdentifier: string, id): Observable<any> {
    const url = this.getUrl();
    const params: HttpParams = new HttpParams()
      .set("patient", patientIdentifier)
      .set("id", id);

    return this.http.get(url + "radiology-images", {
      responseType: "text",
      params: params,
    });
  }

  public getAllPatientImageResult(patientIdentifier: string): Observable<any> {
    const url = this.getUrl();
    const params: HttpParams = new HttpParams().set(
      "patient",
      patientIdentifier
    );

    return this.http.get(url + "radiology-all-patient-images", {
      params: params,
    });
  }

  public getPatientImages(url): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let objectUrl: string = null;
      const headers = new HttpHeaders({ Accept: "image/jpeg" });
      this.http
        .get(url, {
          headers,
          responseType: "blob",
        })
        .pipe(take(1))
        .subscribe((m) => {
          objectUrl = URL.createObjectURL(m);
          observer.next(objectUrl);
        });

      return () => {
        if (objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrl = null;
        }
      };
    });
  }

  public createRadiologyComments(payload) {
    const url =
      this.appSettingsService.getEtlRestbaseurl().trim() + "radiology-comments";
    const headers = new HttpHeaders({ "Content-Type": "application/json" });
    return this.http.post(url, JSON.stringify(payload), { headers });
  }
}
