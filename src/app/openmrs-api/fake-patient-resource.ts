import { PatientResourceService } from './patient-resource.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { Patient } from '../models/patient.model';
import { HttpClient } from '@angular/common/http';
/**
 * FakePatientResourceService
 */
export class FakePatientResourceService extends PatientResourceService {
  public returnErrorOnNext = false;

  constructor(protected http: HttpClient, protected appSettingsService: AppSettingsService) {
    super(http, appSettingsService);
  }

  public searchPatient(searchText: string,
                       cached: boolean = false, v: string = null): Observable<any> {
    const test: BehaviorSubject<any> = new BehaviorSubject<any>([]);
    const patients = [
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

    if (!this.returnErrorOnNext) {
      test.next(patients);
    } else {
      test.error(new Error('Error loading patient'));
    }
    return test.asObservable();
  }

  public getPatientByUuid(uuid: string, cached: boolean = false, v: string = null):
  Observable<any> {
    const subject = new BehaviorSubject<any>({});
    subject.next(new Patient({
      uuid: uuid,
      display: 'display'
    }));
    return subject;
  }
}
