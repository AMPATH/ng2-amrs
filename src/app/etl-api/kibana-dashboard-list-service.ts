
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map} from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class KibanaDashboardListService {

  constructor(private http: HttpClient, private appSettingsService: AppSettingsService) {
  }

  public getUrl(): string {
    return this.appSettingsService.getEtlRestbaseurl().trim() + `kibana-dashboards`;
  }

  public getKibanaDahboards() {

    const url = this.getUrl();
    return this.http.get(url, {
     }).pipe(
       map((response: Response) => {
         return response;
       }), catchError((err: any) => {
          console.log('Err', err);
          const error: any = err;
          const errorObj = {
            'error': error.status,
            'message': error.statusText
          };
          return of(errorObj);
       }), );
  }
}
