import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';

import { AppSettingsService } from '../app-settings/app-settings.service';


@Injectable()
export class CohortUserResourceService {

    constructor(private _http: Http , private _appSettingsService: AppSettingsService) {
    }

    getUrl(): string {
        return this._appSettingsService.getEtlRestbaseurl().trim();
    }

    getCohortbyUserUuid(userUuid): Observable <any> {
        if (!userUuid) {
            return null;
           }
        let url = this.getUrl() + 'cohort-user/' + userUuid;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this._http.get(url , options)
            .map((response: Response) => {
                return response.json();
            });

    }
}
