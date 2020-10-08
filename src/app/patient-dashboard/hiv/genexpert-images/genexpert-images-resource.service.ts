import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { AppSettingsService } from '../../../app-settings/app-settings.service';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ObsResourceService } from '../../../openmrs-api/obs-resource.service';

@Injectable()
export class GeneXpertResourceService {
  constructor(private obsResourceService: ObsResourceService) {}

  public getImages(patientUuid): Observable<any> {
    return this.obsResourceService.getObsPatientObsByConcept(
      patientUuid,
      '6fa355eb-9321-4850-884c-12594194862a'
    );
  }
}
