import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import { AppSettingsService } from '../app-settings/app-settings.service';


@Injectable()
export class VitalsResourceService {

  constructor(private http: Http, private appSettingsService: AppSettingsService) { }

  getVitals(patientUuid: string, startIndex: string, limit: string) {

    let api = this.appSettingsService.getEtlServer() + '/patient/' + patientUuid + '/vitals';

    if (!startIndex) {
      startIndex = '0';
    }
    if (!limit) {
      limit = '20';
    }

    let params: URLSearchParams = new URLSearchParams();

    params.set('startIndex', startIndex);
    params.set('uuid', patientUuid);
    params.set('limit', limit);


    return this.http.get(api, { search: params });
  }
}


