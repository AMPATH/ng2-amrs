
import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable()
export class ClinicalNotesResourceService {

  constructor(private http: HttpClient, private appSettingsService: AppSettingsService) { }

  public getClinicalNotes(patientUuid: string, startIndex: number, limit: number) {

    const api = this.appSettingsService.getEtlServer() +
      '/patient/' + patientUuid + '/clinical-notes';

    if (!startIndex) {
      startIndex = 0;
    }
    if (!limit) {
      limit = 10;
    }

    const params: HttpParams = new HttpParams()
      .set('startIndex', startIndex as any as string)
      .set('limit', limit as any as string);

    return this.http.get(api, { params: params });
  }
}
