import { PatientResourceService } from './patient-resource.service';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { AppSettingsService } from '../app-settings/app-settings.service';
/**
 * FakePatientResourceService
 */
export class FakePatientResourceService extends PatientResourceService {
  constructor(protected http: Http, protected appSettingsService: AppSettingsService) {
    super(http, appSettingsService);
  }
  returnErrorOnNext: boolean = false;

  searchPatient(searchText: string, cached: boolean = false, v: string = null): Observable<any> {
    let test: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    let patients = [
      {
        uuid: 'uuid',
        display: 'display'
      },
      {
        uuid: 'uuid',
        display: 'kennedy'
      },
      {
        uuid: 'uuid',
        display: 'display'
      },
      {
        uuid: 'uuid',
        display: 'kennedy john'
      },
      {
        uuid: 'uuid',
        display: 'display'
      },
      {
        uuid: 'uuid',
        display: 'brian'
      },
      {
        uuid: 'uuid',
        display: 'allan'
      },
      {
        uuid: 'uuid',
        display: 'kennedy'
      },
      {
        uuid: 'uuid',
        display: 'display'
      },
      {
        uuid: 'uuid',
        display: 'kennedy'
      },
      {
        uuid: 'uuid',
        display: 'display'
      },
      {
        uuid: 'uuid',
        display: 'kennedy john'
      },
      {
        uuid: 'uuid',
        display: 'display'
      },
    ];


    if (!this.returnErrorOnNext)
      test.next(patients);
    else
      test.error(new Error('Error loading patient'));
    return test.asObservable();
  }
}
