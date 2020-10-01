import { Observable, BehaviorSubject } from 'rxjs';
import { AppSettingsService } from '../app-settings/app-settings.service';
import { ProgramEnrollmentResourceService } from './program-enrollment-resource.service';
import { HttpClient } from '@angular/common/http';
/**
 * FakeProgramEnrollmentResourceService
 */
export class FakeProgramEnrollmentResourceService extends ProgramEnrollmentResourceService {
  public returnErrorOnNext = false;

  constructor(
    protected http: HttpClient,
    protected appSettingsService: AppSettingsService
  ) {
    super(http, appSettingsService);
  }

  public getProgramEnrollmentByPatientUuid(uuid: string): Observable<any> {
    const subject = new BehaviorSubject<any>(null);
    subject.next([
      {
        uuid: 'uuid1',
        display: 'display'
      },
      {
        uuid: 'uuid2',
        display: 'display'
      }
    ]);
    return subject;
  }

  public saveUpdateProgramEnrollment(paylod: any): Observable<any> {
    const subject = new BehaviorSubject<any>(null);
    subject.next([
      {
        uuid: 'uuid1',
        display: 'display'
      }
    ]);
    return subject;
  }
}
