import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OderSetResourceService {
  v = 'custom:(uuid,name,description,retired,orderSetMembers)';

  constructor(protected http: HttpClient,
    protected appSettingsService: AppSettingsService) {
  }

  getUrl(): string {
    return this.appSettingsService.getOpenmrsRestbaseurl().trim() + 'orderset';
  }

  searchDrugOrderSet(searchText: string, cached: boolean = false, v: string = null):
  Observable<any> {
    const url = this.getUrl();
   const params: HttpParams = new HttpParams()
    .set('q', searchText)
    .set('v', (v && v.length > 0) ? v : this.v);
    console.log(url);
    return this.http.get(url, {
      params: params
    }).pipe(
      map((response: any) => {
        console.log('order results', response);
        return response.results;
      }));
  }
  public getAllOrderSets(
    cached: boolean = false, v: string = null): Observable<any> {

    const url = this.getUrl();
    console.log(url, 'aasadas');
    this.v = 'full';

    const params: HttpParams = new HttpParams()
      .set('v', (v && v.length > 0) ? v : this.v);

    return this.http.get(url, {
      params: params
    }).map((response) => {

      return response;
    });
  }


}
