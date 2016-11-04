import { Injectable } from '@angular/core';
import {Http} from '@angular/http';

import { AppSettingsService } from '../app-settings/app-settings.service';
import { Helpers } from '../utils/helpers';

@Injectable()
export class VitalsResourceService {

  constructor(private http : Http,private appSettingsService: AppSettingsService) {}

  getVitals(patientUuid :string, startIndex : number, limit :number) {

    let api = this.appSettingsService.getEtlServer() + '/patient/'+patientUuid+'/vitals';

    if (!startIndex) {
      startIndex = 0;
    }

    if (!limit) {
      limit = 20;
    }

    var params = {
      startIndex: startIndex,
      uuid: patientUuid,
      limit: limit
    };

    return this.http.get(Helpers.buildUrl(api).withParams(params));
  }
}


