import { Injectable } from '@angular/core';
import {Http,URLSearchParams} from '@angular/http';

import {Observable} from 'rxjs/Rx';
import { AppSettingsService } from '../app-settings/app-settings.service';


@Injectable()
export class VitalsResourceService {

  constructor(private http : Http,private appSettingsService: AppSettingsService) {}

  getVitals(patientUuid :string, startIndex : string, limit :string) {

    return Observable.of({
      startIndex: '0',
      limit: '10',
      result: []
    });


  }
}
