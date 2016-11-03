import { PatientResourceService } from '../../amrs-api/patient-resource.service';
import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
/**
 * FakePatientResourceService
 */
export class FakePatientResourceService extends PatientResourceService {
  constructor() {
    super();
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
