import { Observable, Subject, BehaviorSubject } from 'rxjs/Rx';
import { Http } from '@angular/http';
import { AppSettingsService } from '../app-settings';
import { ProgramEnrollmentResourceService } from './program-enrollment-resource.service';
/**
 * FakeProgramEnrollmentResourceService
 */
export class FakeProgramEnrollmentResourceService extends ProgramEnrollmentResourceService {
  public returnErrorOnNext: boolean = false;

  constructor(protected http: Http, protected appSettingsService: AppSettingsService) {
    super(http, appSettingsService);
  }

  public getProgramEnrollmentByPatientUuid(uuid: string): Observable<any> {
    let subject = new BehaviorSubject<any>(null);
    subject.next(
      [
        {
          uuid: 'uuid1',
          display: 'display'
        },
        {
          uuid: 'uuid2',
          display: 'display'
        }
      ]
    );
    return subject;
  }

  public saveUpdateProgramEnrollment(paylod: any): Observable<any> {
    let subject = new BehaviorSubject<any>(null);
    subject.next(
      [
        {
          uuid: 'uuid1',
          display: 'display'
        }
      ]
    );
    return subject;
  }
}
