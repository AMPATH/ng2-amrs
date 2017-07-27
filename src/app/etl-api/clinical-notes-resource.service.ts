import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';

import { AppSettingsService } from '../app-settings';

@Injectable()
export class ClinicalNotesResourceService {

  constructor(private http: Http, private appSettingsService: AppSettingsService) { }

  public getClinicalNotes(patientUuid: string, startIndex: number, limit: number) {

    let api = this.appSettingsService.getEtlServer() +
      '/patient/' + patientUuid + '/clinical-notes';

    if (!startIndex) {
      startIndex = 0;
    }
    if (!limit) {
      limit = 10;
    }

    let params: URLSearchParams = new URLSearchParams();

    params.set('startIndex', startIndex as any as string);
    params.set('limit', limit as any as string);

    return this.http.get(api, {search: params}).map((data) => data.json());
  }
}
