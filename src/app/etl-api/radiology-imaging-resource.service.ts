import { Injectable } from '@angular/core';
import { Http, URLSearchParams, Response, Headers,
  RequestOptions, ResponseContentType } from '@angular/http';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable, Subscriber } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class RadiologyImagingResourceService {

  constructor(private http: Http, private appSettingsService: AppSettingsService,
              private domSanitizer: DomSanitizer, ) { }
  public getUrl(): string {

    return this.appSettingsService.getEtlRestbaseurl().trim() ;
  }
  public getPatientImagingReport(patientIdentifier: string): Observable<any> {
    let url = this.getUrl();
    let params: URLSearchParams = new URLSearchParams();
    params.set('patient', patientIdentifier);

    return this.http.get(url + 'radiology-diagnostic-report', {
      search: params
    }).map((response: Response) => {
      return response.json();
    });
  }
  public getWadoImageUrl(patientIdentifier: string, id): Observable<any> {
    let url = this.getUrl();
    let params: URLSearchParams = new URLSearchParams();
    params.set('patient', patientIdentifier);
    params.set('id', id);

    return this.http.get(url + 'radiology-images', {
      search: params
    }).map((response: any) => {
      return response._body;
    });
  }

  public getAllPatientImageResult(patientIdentifier: string): Observable<any> {
    let url = this.getUrl();
    let params: URLSearchParams = new URLSearchParams();
    params.set('patient', patientIdentifier);

    return this.http.get(url + 'radiology-all-patient-images', {
      search: params
    }).map((response: any) => {
      return response.json();
    });
  }

  public getPatientImages(url): Observable<any> {
    return new Observable((observer: Subscriber<any>) => {
      let objectUrl: string = null;
      let headers = new Headers({ 'Accept': 'image/jpeg' });
      this.http
        .get(url, {
          headers,
          responseType: ResponseContentType.Blob
        })
        .subscribe((m) => {
          objectUrl = URL.createObjectURL(m.blob());
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
    let url = this.appSettingsService.getEtlRestbaseurl().trim() + 'radiology-comments';
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(url, JSON.stringify(payload), options)
      .map((response: Response) => {
        return response.json();
      });

  }

}
