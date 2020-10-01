import { Injectable } from '@angular/core';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class FakeEncounterResourceService {
  public v: string =
    'custom:(uuid,encounterDatetime,' +
    'patient:(uuid,uuid),form:(uuid,name),' +
    'location:ref,encounterType:ref,provider:ref)';

  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {}
  public getUrl(): string {
    return '';
  }

  public getEncountersByPatientUuid(
    patientUuid: string,
    cached: boolean = false,
    v: string = null
  ): Observable<any> {
    return of([
      {
        uuid: '927d9d1f-44ce-471e-a77b-d1f1342f43f6',
        encounterDatetime: '2011-02-09T00:00:00.000+0300',
        patient: {
          uuid: '922fc86d-ad42-4c50-98a6-b1f310863c07'
        },
        form: {
          uuid: '4710fa02-46ee-421d-a951-9eb012e2e950',
          name: 'AMPATH Pediatric Return Visit Form 4.4 with Mother-Baby Link'
        },
        location: {
          uuid: '08feb5b6-1352-11df-a1f1-0026b9348838',
          display: 'Amukura',
          links: [
            {
              rel: 'self',
              uri: 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/'
            }
          ]
        }
      }
    ]);
  }
  public getEncounterByUuid(uuid: string): Observable<any> {
    return of({
      uuid: '927d9d1f-44ce-471e-a77b-d1f1342f43f6',
      encounterDatetime: '2011-02-09T00:00:00.000+0300',
      patient: {
        uuid: '922fc86d-ad42-4c50-98a6-b1f310863c07'
      },
      form: {
        uuid: '4710fa02-46ee-421d-a951-9eb012e2e950',
        name: 'AMPATH Pediatric Return Visit Form 4.4 with Mother-Baby Link'
      },
      location: {
        uuid: '08feb5b6-1352-11df-a1f1-0026b9348838',
        display: 'Amukura',
        links: [
          {
            rel: 'self',
            uri: 'https://amrs.ampath.or.ke:8443/amrs/ws/rest/'
          }
        ]
      }
    });
  }
  public getEncounterTypes(v: string) {
    return {
      results: [
        {
          uuid: 'df5549ce-1350-11df-a1f1-0026b9348838',
          display: 'ADHERENCEREINITIAL',
          links: [
            {
              rel: 'self',
              uri: 'https://amrs.ampath.or.ke:8443/'
            }
          ]
        },
        {
          uuid: 'df5548c0-1350-11df-a1f1-0026b9348838',
          display: 'ADHERENCERETURN',
          links: [
            {
              rel: 'self',
              uri: 'https://amrs.ampath.or.ke:8443/'
            }
          ]
        }
      ]
    };
  }

  public saveEncounter(payload) {
    return {
      results: [
        {
          uuid: 'df5549ce-1350-11df-a1f1-0026b9348838',
          display: 'ADHERENCEREINITIAL',
          links: [
            {
              rel: 'self',
              uri: 'https://amrs.ampath.or.ke:8443/'
            }
          ]
        },
        {
          uuid: 'df5548c0-1350-11df-a1f1-0026b9348838',
          display: 'ADHERENCERETURN',
          links: [
            {
              rel: 'self',
              uri: 'https://amrs.ampath.or.ke:8443/'
            }
          ]
        }
      ]
    };
  }

  public updateEncounter(uuid, payload) {
    return {
      results: [
        {
          uuid: 'df5549ce-1350-11df-a1f1-0026b9348838',
          display: 'ADHERENCEREINITIAL',
          links: [
            {
              rel: 'self',
              uri: 'https://amrs.ampath.or.ke:8443/'
            }
          ]
        },
        {
          uuid: 'df5548c0-1350-11df-a1f1-0026b9348838',
          display: 'ADHERENCERETURN',
          links: [
            {
              rel: 'self',
              uri: 'https://amrs.ampath.or.ke:8443/'
            }
          ]
        }
      ]
    };
  }
}
